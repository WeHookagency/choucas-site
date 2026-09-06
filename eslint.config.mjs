import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Maquettes et moteur de rendu de Claude Design : ce sont des references
    // de design, pas du code de production. Elles se lisent dans un
    // navigateur, elles ne sont ni compilees ni livrees.
    "references/**",
  ]),
]);

export default eslintConfig;
