#!/bin/bash

set -euo pipefail

# Configuration
TIMEOUT=60
SLEEP_INTERVAL=5
MAX_RETRIES=$((TIMEOUT / SLEEP_INTERVAL))
TRAEFIK_NETWORK=proxy
TRAEFIK_API_URL="https://traefik.$CNAME/api/http/services"
DOCKER_HOST="ssh://$SSH_USER@$SSH_HOST"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
  local level=$1
  local message=$2
  case $level in
    "INFO")  echo -e "${GREEN}[INFO]${NC} $message" ;;
    "WARN")  echo -e "${YELLOW}[WARN]${NC} $message" ;;
    "ERROR") echo -e "${RED}[ERROR]${NC} $message" ;;
  esac
}

docker_cmd() {
  DOCKER_HOST=$DOCKER_HOST docker "$@"
}

docker_compose_cmd() {
  docker_cmd compose -f ./docker-compose.yaml "$@"
}

get_container_ip() {
  docker_cmd inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$1"
}

wait_for_health() {
  local service=$1
  local container_ip=$2
  for ((i=1; i<=$MAX_RETRIES; i++)); do
    if docker_cmd run --rm --net $TRAEFIK_NETWORK curlimages/curl -fs "http://$container_ip:$SERVICE_PORT/up" > /dev/null 2>&1; then
      return 0
    fi
    sleep $SLEEP_INTERVAL
  done
  return 1
}

wait_for_traefik() {
  local service=$1
  local container_ip=$2
  for ((i=1; i<=$MAX_RETRIES; i++)); do
    if curl -fs -u "$DASHBOARD_USER:$DASHBOARD_PASSWORD" "$TRAEFIK_API_URL" |
      jq --arg container_ip "http://$container_ip:$SERVICE_PORT" \
        '.[] | select(.type == "loadbalancer") | select(.serverStatus[$container_ip] == "UP")' > /dev/null 2>&1; then
      return 0
    fi
    sleep $SLEEP_INTERVAL
  done
  return 1
}

deploy_service() {
  local service=$1

  log "INFO" "Deploying $service..."

  log "INFO" "Stopping $service..."
  docker_compose_cmd stop "$service"

  log "INFO" "Starting $service..."
  docker_compose_cmd up -d --force-recreate "$service"

  local container_ip=$(get_container_ip "$service")

  if [[ -z "$container_ip" ]]; then
    log "ERROR" "Failed to get IP for $service"
    return 1
  fi

  log "INFO" "Waiting for $service to become healthy..."
  if ! wait_for_health "$service" "$container_ip"; then
    log "ERROR" "$service failed health check"
    return 1
  fi
  log "INFO" "$service is healthy"

  log "INFO" "Waiting for Traefik to recognize $service..."
  if ! wait_for_traefik "$service" "$container_ip"; then
    log "ERROR" "Traefik failed to recognize $service"
    return 1
  fi
  log "INFO" "Traefik recognized $service"

  log "INFO" "$service deployed successfully"
  return 0
}

main() {
  log "INFO" "Starting deployment process for $SERVICE_NAME"

  log "INFO" "Pulling latest $SERVICE_NAME image..."
  docker_cmd image pull "birzgalisn/rates-$SERVICE_NAME:main"

  local services=("blue-$SERVICE_NAME" "green-$SERVICE_NAME")
  for service in "${services[@]}"; do
    if ! deploy_service "$service"; then
      log "ERROR" "Deployment failed for $service"
      docker_compose_cmd stop --timeout=30 "$service"
      exit 1
    fi
  done

  log "INFO" "Pruning unused Docker images..."
  docker_cmd image prune -f

  log "INFO" "Deployment completed successfully for all services"
}

main
