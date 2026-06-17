// eslint.config.js
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier: prettierPlugin,
    },

    rules: {
      "no-var": "error",
      semi: ["error","always"],
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-multi-spaces": "error",
      "space-in-parens": "error",
      "no-multiple-empty-lines": "error",
      "prefer-const": "error",
      "prettier/prettier": ["error", {semi:true}]
    },
  }
);
