// eslint.config.js
import js from "@eslint/js";
import react from "eslint-plugin-react";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

// Combine Next.js and Core Web Vitals ESLint rules
const [nextCompatConfig] = compat.config({
  extends: ["next", "next/core-web-vitals"],
});

export default [
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
  {
    ...nextCompatConfig,
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
      ...nextCompatConfig.plugins,
      "@typescript-eslint": tseslint,
      react,
    },
    rules: {
      ...nextCompatConfig.rules,
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      ...nextCompatConfig.settings,
      react: {
        version: "detect",
      },
      next: {
        rootDir: "./",
      },
    },
  },
];
