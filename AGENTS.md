# Contexto para asistentes de código

## Objetivo del proyecto

Este repositorio es un prototipo educativo de simulación de materiales auto-reparables con memoria de forma. La interfaz combina una simulación visual con análisis generados por Gemini para una demostración de hackathon.

Codex se utiliza como asistente de desarrollo del repositorio. No sustituir Gemini ni `@google/genai` como proveedor de IA de la aplicación salvo que la tarea lo solicite expresamente.

## Arquitectura

- `src/`: aplicación React y TypeScript.
- `src/components/`: módulos científicos e interactivos.
- `src/lib/translations.ts`: textos en español, inglés y chino.
- `server.ts`: servidor Express, endpoints de IA y proxy seguro hacia Gemini.
- `src/types.ts`: tipos compartidos de simulación y síntesis.

## Comandos

- Instalar dependencias: `npm install`
- Ejecutar en desarrollo: `npm run dev`
- Comprobar TypeScript: `npm run lint`
- Generar producción: `npm run build`

Antes de entregar cambios, ejecutar al menos `npm run lint` cuando el entorno lo permita.

## Reglas de desarrollo

- Mantener las claves y secretos exclusivamente en variables de entorno del servidor.
- Nunca exponer `GEMINI_API_KEY` en `src/`, respuestas de error o documentación con valores reales.
- Mantener sincronizados los textos visibles en los tres idiomas.
- Reutilizar los tipos de `src/types.ts` y los patrones visuales existentes.
- Mantener las afirmaciones científicas como conceptuales cuando no estén validadas experimentalmente.
- Evitar cambios amplios de proveedor, arquitectura o diseño si la tarea no los requiere.
- No editar artefactos generados en `dist/` ni dependencias en `node_modules/`.

## Criterios de aceptación

- La interfaz conserva el flujo de simulación y síntesis actual.
- Los endpoints no filtran secretos y devuelven errores entendibles.
- TypeScript compila sin errores nuevos.
- Los cambios visibles funcionan en español, inglés y chino.
- La documentación refleja cualquier cambio de configuración o uso.
