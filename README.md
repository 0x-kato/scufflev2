## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

```bash

#Steps to launch the backend app are below, follow them for plug+play

#Running the db first time:
docker compose up dev-db -d

#migrating the ddb and restarting the db to push new changes:
npx prisma generate
npx prisma migrate dev
npm run db:dev:restart
#and to watch db changes in prisma:
npx prisma studio

#to start the backend simply run
npm run start:dev
```

Nest is [MIT licensed](LICENSE).
