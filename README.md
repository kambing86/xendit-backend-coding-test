# Xendit Coding Exercise

## Setup

1. ensure `node > v12` installed
2. run `npm install`
3. run `npm start`

## Documentation

Documentation is written using Swagger Specification, please follow steps below

1. run `npm start`
2. explore `http://localhost:8010/api-docs` for more info

## Tooling

- `babel` for typescript
- `eslint` with `tslint`, together with `editorconfig` and `prettier`
- `mocha` with `nyc`
- `lint-staged` to only run command on staged files
- `husky` to replace `pre-push`
  - can do more than `pre-push` and well maintained
  - use `pre-commit` hook with `lint-staged` to execute `prettier` and `npm run lint`
- `artillery` for load testing
- `swagger-ui-express` for swagger documentation
- `winston` for logging
- `@nearform/sql` for SQL injection protection

## Load Testing

1. run `npm start`
2. run `npn run test:load` in another terminal
