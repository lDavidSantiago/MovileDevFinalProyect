import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  // Aplica a todos los archivos JS, TS, JSX, TSX
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["eslint.config.mjs"], // Excluir el propio archivo de configuración
    // Configuración base de JS recomendado
    ...js.configs.recommended,
    // Configuración de lenguaje y parser TypeScript
    languageOptions: {
      parser: tseslint.parser, // Usa el parser de TypeScript
      parserOptions: {
        ecmaFeatures: { jsx: true }, // Habilita JSX
        project: "./tsconfig.json", // Ruta a tu tsconfig.json (ajusta si es necesario)
      },
      globals: {
        ...globals.browser, // Agrega globales de navegador
      },
    },
    // Reglas específicas pueden ir aquí si necesitas anular algo
    rules: {
      // Ejemplo: Deshabilitar una regla específica de JS si es necesario
      // "no-unused-vars": "off",
    },
  },

  // Configuración recomendada de TypeScript ESLint
  ...tseslint.configs.recommended,

  // Configuración recomendada de React Hooks
  // Nota: reactHooks.configs.recommended es un objeto, no un array
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // Aplica solo a archivos que puedan contener React
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: reactHooks.configs.recommended.rules,
  }
);
