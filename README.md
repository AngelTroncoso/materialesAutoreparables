# 🧬 Materiales Auto-Reparables con Memoria de Forma Cuántica

> Plataforma de simulación y diseño científico para materiales inteligentes que se autodiagnostican y autorreparan mediante mecanismos asistidos por principios cuánticos (túnel cuántico, coherencia de espín) combinados con aleaciones y polímeros con memoria de forma (SMA/SMP).

![Status](https://img.shields.io/badge/status-prototipo%20conceptual-blueviolet)
![License](https://img.shields.io/badge/license-MIT-informational)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![AI](https://img.shields.io/badge/AI-Gemini%203.5%20Flash-orange)

---

## 📖 Tabla de contenidos

- [Inspiración](#-inspiración)
- [Qué hace](#-qué-hace)
- [Arquitectura del sistema](#-arquitectura-del-sistema)
- [Módulos de la aplicación](#-módulos-de-la-aplicación)
- [Stack tecnológico](#-stack-tecnológico)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Uso](#-uso)
- [Desarrollo con Codex](#-desarrollo-con-codex)
- [Idiomas soportados](#-idiomas-soportados)
- [Desafíos técnicos](#-desafíos-técnicos)
- [Roadmap](#-roadmap)
- [Aprendizajes](#-aprendizajes)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 💡 Inspiración

Los materiales convencionales se degradan con el tiempo: grietas en estructuras, fatiga en aleaciones, desgaste en polímeros usados en industrias como la aeroespacial, la medicina y la electrónica flexible.

Este proyecto parte de una pregunta especulativa: **¿qué pasaría si un material pudiera "sentir" su propio daño y corregirlo antes de que se propague**, imitando la capacidad regenerativa de los tejidos biológicos pero llevada a escala atómica? La convergencia entre nanotecnología, ciencia de materiales y computación cuántica ofrece un terreno fértil para explorar esta idea como concepto de investigación con potencial disruptivo a largo plazo.

## ⚙️ Qué hace

El sistema propuesto combina tres capas conceptuales:

1. **Sensores de daño distribuidos a nivel molecular** que detectan micro-fracturas o rupturas de enlaces en tiempo real.
2. **Una matriz de polímero/aleación con memoria de forma** (basada en tecnología real como Nitinol o SMP), capaz de "recordar" su configuración original.
3. **Un mecanismo de reconfiguración asistido por principios cuánticos** (túnel cuántico, estados de superposición en defectos cristalinos) que acelera hipotéticamente la migración de átomos hacia las posiciones de reparación.

El resultado es una plataforma de simulación que ilustra el ciclo **detección → reconfiguración → reparación**, apoyada por IA generativa para explorar composiciones de materiales.

## 🏗️ Arquitectura del sistema

```
┌────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                     │
│  Lattice Simulator │ Equation Sandbox │ Material Synthesizer │
│  Loop Engineer UI  │ Quantum Specs Deck │ Documentación      │
└───────────────────────────┬──────────────────────────────────┘
                             │  REST / fetch
┌───────────────────────────▼──────────────────────────────────┐
│                    BACKEND (Node.js + Express)                │
│         Proxy seguro hacia la API de Gemini (@google/genai)   │
└───────────────────────────┬──────────────────────────────────┘
                             │
┌───────────────────────────▼──────────────────────────────────┐
│                     Gemini 3.5 Flash (LLM)                    │
│   Generación de formulaciones · Crítica física · Evaluación   │
└────────────────────────────────────────────────────────────────┘
```

El **Loop Engineer** implementa un bucle cerrado de optimización de doble agente inspirado en los *self-driving labs*:

```
┌────────────────────────────────────────────────────────┐
    ▼                                                     │
[ 1. GENERACIÓN ] ──► [ 2. SIMULACIÓN ] ──► [ 3. EVALUACIÓN ] ┘
  (Agente Formulador)    (Solver DFT/MD)     (Crítico físico)
```

- **Agente A – Formulation Engineer:** propone una receta estequiométrica, distribución de dopantes cuánticos y estímulos físicos.
- **Agente B – Simulador/Crítico:** estima propiedades (módulo de Young, resistencia a tracción, coherencia cuántica, tasa de recuperación, viabilidad de síntesis) y emite retroalimentación para el siguiente ciclo.

## 🧩 Módulos de la aplicación

| Módulo | Descripción |
|---|---|
| **Lattice Simulator** | Canvas interactivo que representa redes cristalinas/cadenas poliméricas; permite fracturar enlaces y observar la dinámica de defectos en tiempo real. |
| **Equation Sandbox** | Laboratorio matemático que grafica la probabilidad de túnel cuántico frente a la difusión térmica clásica (Arrhenius), con sliders de temperatura y energía de activación. |
| **Material Synthesizer** | Endpoint que envía parámetros de síntesis a Gemini y devuelve un dossier técnico con viabilidad estructural, propiedades predichas y pasos de laboratorio recomendados (DFT *ab initio*). |
| **Loop Engineer** | Orquestador de doble agente (generación → simulación → evaluación) con consola de monitoreo en tiempo real. |
| **Quantum Specs Deck** | Panel con las siete especificaciones clave de ingeniería cuántica (ver más abajo), con interruptores que retroalimentan el simulador. |
| **Scientific Documentation** | Marco educativo sobre aleaciones/polímeros con memoria de forma, mecánica de túnel cuántico y el problema de la decoherencia térmica ambiental. |

### Las 7 especificaciones clave (Quantum Specs Deck)

1. Blindaje fonónico dinámico por metamateriales acústicos.
2. Acoplamiento predictivo con bases de datos de estabilidad cristalina (tipo GNoME / Materials Project).
3. Solucionador Hamiltoniano 3D de enlace fuerte (*tight-binding*).
4. Excitación de coherencia por pulsos láser / RF modulada.
5. Diseño de estados topológicamente protegidos.
6. Integración *hardware-in-the-loop* con síntesis robótica (PVD).
7. Métricas unificadas de rendimiento cuántico del material (SHQY, tasa de recuperación elástica, factor de calidad de coherencia).

> ⚠️ **Nota de transparencia científica:** estas especificaciones son en gran parte **especulativas/aspiracionales**. Mantener coherencia cuántica a temperatura ambiente en sistemas macroscópicos sigue siendo un desafío abierto de la física actual. Este repositorio es una herramienta de exploración conceptual y comunicación de ideas, no una implementación validada experimentalmente.

## 🛠️ Stack tecnológico

- **Frontend:** React + TypeScript
- **Backend:** Node.js + Express (proxy seguro hacia la API de IA)
- **IA generativa:** Gemini 3.5 Flash vía SDK `@google/genai`
- **Estilos:** Tema "Sofisticado Oscuro" — Playfair Display (títulos), Inter (UI), JetBrains Mono (datos técnicos)
- **Internacionalización:** Español, Inglés y Chino

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/<tu-usuario>/<tu-repositorio>.git
cd <tu-repositorio>

# Instalar dependencias
npm install

# Levantar el entorno de desarrollo (frontend + backend)
npm run dev
```

> Ajusta estos comandos si tu `package.json` define scripts distintos (por ejemplo `npm run start:server` y `npm run start:client` por separado).

## 🔑 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con tu clave de la API de Gemini:

```env
GEMINI_API_KEY=tu_clave_aqui
```

> El backend actúa como proxy para que la clave nunca se exponga en el cliente.

## 🚀 Uso

1. Ejecuta el backend y el frontend (`npm run dev`).
2. Abre la aplicación en tu navegador (por defecto `http://localhost:3000` o el puerto configurado).
3. Explora los módulos:
   - Genera fracturas en el **Lattice Simulator** y observa la reconfiguración.
   - Ajusta temperatura y energía de activación en el **Equation Sandbox**.
   - Propón una composición en el **Material Synthesizer** y revisa el dossier generado por IA.
   - Lanza un ciclo de optimización en el **Loop Engineer** y sigue la consola de logs.
4. Cambia de idioma (ES / EN / ZH) desde el selector disponible en la interfaz.

## 🤖 Desarrollo con Codex

Codex puede trabajar directamente sobre el repositorio para explicar la arquitectura, localizar errores, implementar mejoras, revisar cambios y actualizar pruebas o documentación. En este proyecto se usa como **asistente de desarrollo**, mientras que Gemini continúa siendo el modelo consumido por la aplicación durante la ejecución.

El archivo [`AGENTS.md`](AGENTS.md) proporciona a Codex contexto persistente sobre la arquitectura, los comandos y las restricciones del proyecto. Al abrir el repositorio con Codex, se pueden solicitar tareas concretas como:

- "Revisa `server.ts` y mejora el manejo de errores sin cambiar el proveedor de IA."
- "Añade una opción al simulador y actualiza las traducciones en los tres idiomas."
- "Busca problemas de tipos, corrígelos y comprueba el resultado con `npm run lint`."
- "Explica el flujo entre `MaterialSynthesizer.tsx` y `/api/simulate-material`."

No es necesario añadir Codex al bundle del frontend ni entregarle una clave desde el navegador. Si en el futuro se desea incorporar una función de usuario basada en modelos de OpenAI, debe implementarse como una integración de servidor independiente y mantener las credenciales fuera del cliente.

## 🌐 Idiomas soportados

- 🇪🇸 Español
- 🇬🇧 Inglés
- 🇨🇳 Chino

## 🧗 Desafíos técnicos

- La decoherencia cuántica a temperatura ambiente en materiales macroscópicos es, con la tecnología actual, extremadamente difícil de sostener fuera de condiciones criogénicas.
- Traducir un concepto altamente especulativo en una demostración tangible e interactiva.
- Equilibrar el rigor científico con la naturaleza aspiracional de la propuesta.
- Simplificar modelos de mecánica cuántica y ciencia de materiales para que fueran comprensibles y demostrables en una interfaz web.

## 🗺️ Roadmap

- [ ] Integrar potenciales de aprendizaje automático (CHGNet / M3GNet) para acelerar simulaciones frente al DFT clásico.
- [ ] Conectar con **ASE** (Atomic Simulation Environment) para manipular estructuras atómicas reales.
- [ ] Validar experimentalmente los componentes no cuánticos (SMP/SMA con sensores integrados) junto a laboratorios de ciencia de materiales.
- [ ] Explorar alternativas de corto plazo: autorreparación asistida por IA o microcápsulas reactivas.
- [ ] Definir un esquema de exportación (JSON/CIF) compatible con laboratorios autónomos tipo A-Lab (LBNL).
- [ ] Desplegar el frontend en Google Cloud.
- [ ] Buscar alianzas académicas o financiamiento para una línea de investigación a largo plazo.

## 📚 Aprendizajes

- Fundamentos de polímeros y aleaciones con memoria de forma (SMP/SMA).
- Limitaciones actuales de la física y computación cuántica aplicadas a sistemas macroscópicos.
- Comunicación de ideas técnicas y especulativas de forma accesible, balanceando ambición con honestidad científica.
- Modelado y simulación de fenómenos aún no completamente realizables experimentalmente.

## 🤝 Contribuir

Las contribuciones son bienvenidas, especialmente de personas con experiencia en:

- Ciencia de materiales (SMA/SMP)
- Simulación DFT / dinámica molecular
- Desarrollo frontend (React/TypeScript)
- Diseño de sistemas multi-agente

Para contribuir:

1. Haz un fork del repositorio.
2. Crea una rama (`git checkout -b feature/nombre-de-tu-mejora`).
3. Realiza tus cambios y haz commit (`git commit -m 'Agrega X'`).
4. Envía un pull request describiendo el cambio.

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

<p align="center">Hecho con curiosidad científica, IA generativa y un poco de física especulativa ⚛️</p>
