const prettierConfig = require("eslint-config-prettier");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactRecommended = require("eslint-plugin-react/configs/recommended");
const tsEslintPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: tsEslintPlugin.configs["base"].parserOptions,
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
    },
    rules: {
      ...tsEslintPlugin.configs["eslint-recommended"].rules,
      ...tsEslintPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ...reactRecommended,
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "react/prop-types": "off",
      "sort-imports": ["warn", { ignoreDeclarationSort: true }],
    },
  },
  prettierConfig,
];
