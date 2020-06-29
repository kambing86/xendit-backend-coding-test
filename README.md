# Xendit Coding Exercise

## Setup

1. ensure `node > v12` installed
2. run `npm install`
3. run `npm start`

## Documentation

Documentation is written using Swagger Specification, please run `npm start` and explore `http://localhost:8010/api-docs` for more info

## Tooling

- `eslint` with `tslint`, together with `editorconfig` and `prettier`
- `mocha` with `nyc`
- `lint-staged` to only run command on staged files
- `husky` to replace `pre-push`
  - can do more than `pre-push` and well maintained
  - use `pre-commit` hook with `lint-staged` to execute `prettier` and `npm run lint`
