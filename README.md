## Description

Backend service for recruitment challenge

## Project setup

Fill in environment variables based on `.env.example` file and run the following commands:

```bash
$ npm install
$ docker compose up -d
$ npm run db:migration:up
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# unit tests with coverage report
$ npm run test:cov

# e2e tests
$ npm run test:migration:up
$ npm run test:e2e
```
