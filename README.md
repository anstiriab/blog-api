# Blog API

## Description

This is an example of Blog API that was built using NestJS, TypeORM and PostgreSQL database to store the blog posts and GraphQL for API endpoints. 

## Running the app:

### Requirements:

- node version >= 18

### Environment variables

The application uses two variable files. `.env` for the application itself, `.env.docker` for starting the database using docker. Add these files with the correct values.  
You can find examples of variable values in `.env.example` and `.env.docker.example` 

### Installation

To install node modules:

```bash
$ npm install
```

### Build the app

```bash
$ npm run build
```

### Database

Start the database container using docker:

```bash
$ docker-compose --env-file=.env.docker up -d 
```

### Running

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
