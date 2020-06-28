module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  plugins: ["@typescript-eslint/tslint"],
  parserOptions: {
    project: "tsconfig.json",
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": ["warn"],
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/no-angle-bracket-type-assertion": ["off"], // can be removed after react-scripts update
    "@typescript-eslint/tslint/config": [
      "warn",
      {
        lintFile: "./tslint.json", // path to tslint.json of your project
      },
    ],
    "no-console": ["warn"],
    "spaced-comment": [
      "error",
      "always",
      {
        markers: ["/"],
      },
    ],
    "comma-dangle": ["error", "always-multiline"],
    "no-shadow": ["warn"],
  },
};
