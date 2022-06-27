module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["@beaumontjonathan/eslint-config-custom"],
  parserOptions: {
    project: 'tsconfig.json'
  },
  settings: {
  },
};
