#!/bin/bash

set -euo pipefail

# Configuration
TIMEOUT=60
SLEEP_INTERVAL=5
MAX_RETRIES=$((TIMEOUT / SLEEP_INTERVAL))
SSH_USER=${SSH_USER:-"user"}
SSH_HOST=${SSH_HOST:-"host"}
SERVICE_NAME=${SERVICE_NAME:-"service"}
SERVICE_PORT=${SERVICE_PORT:-8080}
DASHBOARD_USER=${DASHBOARD_USER:-"admin"}
DASHBOARD_PASSWORD=${DASHBOARD_PASSWORD:-"password"}
CNAME=${CNAME:-"example.com"}

log() {
  local level="$1"
  local message="$2"
  case $level in
    "INFO")  echo -e "\033[0;32m[INFO]\033[0m $message" ;;
    "WARN")  echo -e "\033[1;33m[WARN]\033[0m $message" ;;
    "ERROR") echo -e "\033[0;31m[ERROR]\033[0m $message" ;;
  esac
}

docker_cmd() {
  DOCKER_HOST="ssh://$SSH_USER@$SSH_HOST" docker "$@"
}

docker_compose_cmd() {
  docker_cmd compose -f ./docker-compose.yaml "$@"
}

get_container_ip() {
  docker_cmd inspect --format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" "$1"
}

get_service() {
  docker_cmd ps --format "{{.Names}}" | grep -q "$1"
}

wait_for_health() {
  local container_ip="$1"
  for ((i=1; i<=MAX_RETRIES; i++)); do
    if docker_cmd run --rm --net proxy curlimages/curl -fs "http://$container_ip:$SERVICE_PORT/up" > /dev/null 2>&1; then
      return 0
    fi
    sleep $SLEEP_INTERVAL
  done
  return 1
}

wait_for_traefik() {
  local container_ip="$1"
  for ((i=1; i<=MAX_RETRIES; i++)); do
    if curl -fs -u "$DASHBOARD_USER:$DASHBOARD_PASSWORD" "https://traefik.$CNAME/api/http/services" |
      jq --arg container_ip "http://$container_ip:$SERVICE_PORT" \
        '.[] | select(.type == "loadbalancer") | select(.serverStatus[$container_ip] == "UP")' > /dev/null 2>&1; then
      return 0
    fi
    sleep $SLEEP_INTERVAL
  done
  return 1
}

deploy_service() {
  local service="$1"
  log "INFO" "Starting $service..."
  if ! docker_compose_cmd up -d --force-recreate "$service"; then
    log "ERROR" "Failed to start $service"
    return 1
  fi

  local container_ip
  container_ip=$(get_container_ip "$service")

  if [[ -z $container_ip ]]; then
    log "ERROR" "Failed to get IP for $service"
    return 1
  fi

  log "INFO" "Waiting for $service to become healthy..."
  if ! wait_for_health "$container_ip"; then
    log "ERROR" "$service failed health check"
    return 1
  fi

  log "INFO" "Waiting for Traefik to recognize $service..."
  if ! wait_for_traefik "$container_ip"; then
    log "ERROR" "Traefik failed to recognize $service"
    return 1
  fi

  return 0
}

rollback() {
  local failed_service="$1"
  local old_service="$2"
  log "WARN" "Rolling back to $old_service..."
  docker_compose_cmd stop --timeout=30 "$failed_service"
  if [[ -n $old_service ]]; then
    docker_compose_cmd start "$old_service"
  fi
}

main() {
  local active_service inactive_service

  if get_service "blue-$SERVICE_NAME"; then
    active_service="blue-$SERVICE_NAME"
    inactive_service="green-$SERVICE_NAME"
  elif get_service "green-$SERVICE_NAME"; then
    active_service="green-$SERVICE_NAME"
    inactive_service="blue-$SERVICE_NAME"
  else
    active_service=""
    inactive_service="blue-$SERVICE_NAME"
  fi

  log "INFO" "Pulling latest $SERVICE_NAME image..."
  if ! docker_cmd image pull "birzgalisn/rates-$SERVICE_NAME:main"; then
    log "ERROR" "Failed to pull the latest image"
    exit 1
  fi

  if ! deploy_service "$inactive_service"; then
    log "ERROR" "Deployment failed for $inactive_service"
    rollback "$inactive_service" "$active_service"
    exit 1
  fi

  if [[ -n $active_service ]]; then
    log "INFO" "Stopping $active_service..."
    docker_compose_cmd stop --timeout=30 "$active_service"
  fi

  log "INFO" "Pruning unused Docker images..."
  docker_cmd image prune -f

  log "INFO" "Deployment completed successfully"
}

main
