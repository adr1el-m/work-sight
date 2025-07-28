import js from "@eslint/js";
import react from "eslint-plugin-react";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

// Assign the configuration array to a variable
const eslintConfig = [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "out/",
      ".pnpm-store/",
      "public/",
    ],
  },
  js.configs.recommended,
  ...compat
    .config({
      extends: ["next", "next/core-web-vitals"],
    })
    .map((config) => ({
      ...config,
      files: ["**/*.{js,ts,jsx,tsx}"],
    })),
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        jsx: true,
      },
      globals: {
        window: true,
        document: true,
        console: true,
        process: true,
        URL: true,
        HTMLImageElement: true,
        headers: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react,
      "@next": nextPlugin,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // You might also want to include rules from the compat config if there are
      // specific overrides or additions you want to ensure are present.
      // For example, if 'nextCompatConfig' (from the previous attempt) had
      // unique rules you wanted to preserve, you could spread them here.
      // However, by spreading `...compat.config(...)`, most Next.js rules
      // are already covered.
    },
    settings: {
      react: {
        version: "detect",
      },
      next: {
        rootDir: "./",
      },
    },
  },
];

// Export the variable
export default eslintConfig;
