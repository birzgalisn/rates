# Exchange rates

Browse various historical EUR exchange rates for currencies such as AUD, GBP, and USD.

## Requirements

**pnpm** is required to install all necessary packages.

**Docker** must be installed to run the development containers on the target machine.

(_Optional_) Containers can also be started by invoking `make dev` from the repository root directory.

## Getting the development environment started

First, clone the repository:

```bash
git clone git@github.com:birzgalisn/rates.git
```

After cloning the repository, from the root directory, create a new `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

Next, run the following command to install all necessary modules:

```bash
pnpm install
```

Finally, start the development Docker containers:

```bash
docker compose up
```

Once the containers are running, everything should be set up and ready to go. All migrations and data seeding are handled automatically.

Visit [http://rates.localhost](http://rates.localhost) to view the application.

## File structure

This repository includes the following packages/apps:

### Apps and packages

    .
    ├── apps
    │   ├── api                       # NestJS app (https://nestjs.com).
    │   └── web                       # Next.js app (https://nextjs.org).
    └── packages
        ├── @repo/api                 # Shared `NestJS` resources.
        ├── @repo/database            # `drizzle` database.
        ├── @repo/eslint-config       # `eslint` configurations (includes `prettier`)
        ├── @repo/jest-config         # `jest` configurations
        ├── @repo/typescript-config   # `tsconfig.json`s used throughout the monorepo
        └── @repo/ui                  # Shareable stub React component library.
