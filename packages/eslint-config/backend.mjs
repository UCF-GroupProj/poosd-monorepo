import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
  "**/node_modules/",
  "**/dist/",
  "src/utils/youtube-notifier/**/*",
  "**/build.js",
  "**/*.spec.ts",
  "jest.config.js",
  "eslint.config.mjs"
]), {
  extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),

  plugins: {
    "@typescript-eslint": typescriptEslint,
  },

  languageOptions: {

    parser: tsParser,
    ecmaVersion: "latest",
    sourceType: "module",

    parserOptions: {
      project: ["./tsconfig.json"],
    },
  },

  rules: {
    indent: ["error", 2, {
      SwitchCase: 1,
    }],
    semi: ["error", "always"],
    "no-async-promise-executor": "off",
    "@typescript-eslint/no-var-requires": "off",
    "no-constant-condition": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-unnecessary-template-expression": "error",
    eqeqeq: ["error", "always"],
    "no-trailing-spaces": ["error"],
    "spaced-comment": [
      "error",
      "always",
      {
        "markers": ["!"]
      }
    ],
    "object-curly-spacing": ["error", "always"],
    "@typescript-eslint/consistent-type-imports": "error",
    "lines-between-class-members": [
      'error',
      'always',
      { 'exceptAfterSingleLine': true }
    ]
  },
}]);