// Next 16 quitó el comando `next lint`. ESLint 9 usa "flat config" y exige
// este archivo; sin él, `npm run lint` reventaba y el CI llevaba commits
// fallando en silencio, lo que además saltaba los pasos de despliegue.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Apps Script de Google: no es un módulo de este proyecto.
      "pr-autopilot/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];
