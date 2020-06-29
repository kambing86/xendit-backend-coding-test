module.exports = {
  "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
    "prettier --write",
    () => "npm run lint",
  ],
  "tests/**/*.{js,jsx,ts,tsx}": ["prettier --write", () => "npm run lint"],
};
