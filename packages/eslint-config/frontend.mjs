import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, ...compat.config({
  rules: {
    indent: ["error", 2, {
      SwitchCase: 1,
    }],
    semi: ["error", "always"],
    "no-async-promise-executor": "off",
    "no-constant-condition": "off",
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
    "lines-between-class-members": [
      'error',
      'always',
      { 'exceptAfterSingleLine': true }
    ]
  }
}), {
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
  
}];

export default eslintConfig;