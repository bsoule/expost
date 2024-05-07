import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import parser from "@typescript-eslint/parser";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser,
    },
    plugins: {
      tseslint,
    },
  },
  {
    files: ["vitest.setup.ts", "*.spec.ts", "src/lib/test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);

// export default [
//   js.configs.recommended,
//   {
//     extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
//     parser: "@typescript-eslint/parser",
//     plugins: ["@typescript-eslint"],
//     root: true,
//     overrides: [
//       {
//         files: ["vitest.setup.ts", "*.spec.ts", "src/lib/test/**/*.ts"],
//         rules: {
//           "@typescript-eslint/no-explicit-any": "off",
//         },
//       },
//     ],
//   },
// ];
