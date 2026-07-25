// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "out/**"] },
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      curly: "warn",
      eqeqeq: ["warn", "always"],
      "no-redeclare": "warn",
      "no-throw-literal": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
    },
  },
);
