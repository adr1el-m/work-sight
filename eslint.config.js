// eslint.config.js
import js from "@eslint/js";
import react from "eslint-plugin-react";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    // Files and directories to ignore during linting
    ignores: ["node_modules/", "dist/", "out/", "public/"],
  },
  // Recommended JavaScript rules
  js.configs.recommended,
  {
    // Target files for this configuration
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      // Parser for TypeScript and JSX files
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest", // Use the latest ECMAScript version
        sourceType: "module", // Enable ES modules
        jsx: true, // Enable JSX parsing
      },
      // Define global variables available in the environment
      globals: {
        window: true,
        document: true,
        console: true,
        process: true,
        URL: true,
        HTMLImageElement: true,
      },
    },
    // Plugins to use for React and TypeScript
    plugins: {
      "@typescript-eslint": tseslint,
      react,
    },
    rules: {
      // Disable the rule requiring React to be in scope for JSX (common for modern React setups)
      "react/react-in-jsx-scope": "off",
      // Add more specific rules here if needed for your dashboard
    },
    settings: {
      // Automatically detect the React version
      react: {
        version: "detect",
      },
    },
  },
];
