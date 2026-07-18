# 🧬 Materiales Auto-Reparables con Memoria de Forma Cuántica

[Quieres conoces la solución Pincha Aquí](https://materialesautoreparables.netlify.app/)
> Un material que se autodiagnostica y se autorrepara sin intervención externa, inspirado en la capacidad regenerativa de los tejidos biológicos llevada a escala atómica.

![Status](https://img.shields.io/badge/status-conceptual%20%2F%20prototipo-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Made with](https://img.shields.io/badge/made%20with-React%20%7C%20TypeScript%20%7C%20Express-orange)

---

## 📖 Índice

- [Inspiración](#-inspiración)
- [¿Qué hace?](#-qué-hace)
- [Cómo lo construimos](#-cómo-lo-construimos)
- [Stack tecnológico](#-stack-tecnológico)
- [Características principales](#-características-principales)
- [Retos que enfrentamos](#-retos-que-enfrentamos)
- [Logros de los que estamos orgullosos](#-logros-de-los-que-estamos-orgullosos)
- [Lo que aprendimos](#-lo-que-aprendimos)
- [Qué sigue](#-qué-sigue)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Licencia](#-licencia)

---

## 💡 Inspiración

La inspiración surgió al observar cómo los materiales convencionales se degradan con el tiempo: grietas en estructuras, fatiga en aleaciones, desgaste en polímeros usados en aeroespacial, medicina y electrónica flexible.

Nos preguntamos: **¿qué pasaría si un material pudiera "sentir" su propio daño y corregirlo antes de que se propague?** La convergencia entre nanotecnología, ciencia de materiales y computación cuántica nos pareció un terreno fértil para explorar esta idea, incluso como concepto especulativo con potencial disruptivo a largo plazo.

## ⚙️ ¿Qué hace?

El sistema propuesto combina:

- **Sensores de daño distribuidos a nivel molecular** que detectan micro-fracturas o rupturas de enlaces en tiempo real.
- **Una matriz de polímero/aleación con memoria de forma**, capaz de "recordar" su configuración original.
- **Un mecanismo de reconfiguración asistido por principios cuánticos** (túnel cuántico, entrelazamiento de estados moleculares) que acelera la migración de átomos hacia las posiciones de reparación, reduciendo el tiempo de autorreparación de horas/días a segundos.

El resultado conceptual es un material que se autodiagnostica y se autorrepara sin intervención externa, extendiendo drásticamente su vida útil.

## 🛠️ Cómo lo construimos

1. Investigamos la literatura existente sobre **polímeros con memoria de forma (SMP)** y **aleaciones con memoria de forma (SMA, como el Nitinol)** como base física real.
2. Diseñamos un modelo conceptual/simulado superponiendo hipótesis de efectos cuánticos (túnel cuántico asistido, estados de superposición en defectos cristalinos) sobre estos materiales existentes.
3. Construimos una simulación computacional simplificada para representar cómo se comportaría la reconfiguración atómica ante un daño simulado.
4. Usamos herramientas de modelado molecular y un motor de simulación para ilustrar el proceso de **"detección → reconfiguración → reparación"**.

## 🧰 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + TypeScript |
| Backend | Express (Node.js) |
| IA generativa | Gemini 3.5 Flash vía SDK `@google/genai` |
| Estilos | Tema "Sophisticated Dark" personalizado |
| Tipografía | Playfair Display, Inter, JetBrains Mono |

## ✨ Características principales

- **🔬 Simulador de Red Atómica Molecular**  
  Canvas interactivo impulsado por física que representa redes cristalinas o cadenas de polímeros. Permite hacer clic y arrastrar para fracturar enlaces y dislocar átomos, generando estrés mecánico y defectos en tiempo real.

- **📐 Laboratorio de Ecuaciones Cuánticas**  
  Playground matemático dinámico que grafica curvas de transmisión de paquetes de onda: *Probabilidad de Túnel Cuántico* vs. *Difusión Térmica Clásica de Arrhenius*, con sliders de temperatura y energía de activación.

- **🤖 Sintetizador de Materiales Asistido por IA**  
  Endpoint seguro en Express que envía parámetros de síntesis de materiales a Gemini 3.5 Flash, devolviendo un dossier técnico estructurado con viabilidad estructural, cambios en el módulo de Young y pasos recomendados de laboratorio (DFT *ab-initio*).

- **📚 Marco Científico y Ruta de Desarrollo**  
  Documentación educativa que detalla la ciencia detrás de las aleaciones con memoria de forma, la mecánica del túnel cuántico y el reto físico de la decoherencia térmica a temperatura ambiente.

- **🎨 Tema visual "Sophisticated Dark"**  
  Fondo oscuro (`#0a0a0c`), acentos cian tipo láser (`#00f2ff`), bordes de baja opacidad e indicadores con efecto neón, combinados con tipografía editorial y técnica.

## 🚧 Retos que enfrentamos

- La física cuántica a temperatura ambiente y en materiales macroscópicos presenta enormes desafíos de **decoherencia**: mantener efectos cuánticos coherentes fuera de condiciones criogénicas es, con la tecnología actual, extremadamente difícil.
- Traducir un concepto altamente especulativo en una demostración tangible dentro del tiempo del hackathon.
- Encontrar el equilibrio entre rigor científico y la naturaleza aspiracional/futurista de la propuesta.
- Simplificar modelos matemáticos complejos (mecánica cuántica + ciencia de materiales) para que fueran comprensibles y demostrables.

## 🏆 Logros de los que estamos orgullosos

- Construimos un modelo conceptual coherente que conecta tecnología real (SMP/SMA) con hipótesis de vanguardia en física cuántica.
- Desarrollamos una simulación/visualización que comunica la idea de forma clara e intuitiva, incluso para audiencias no especializadas.
- Generamos una narrativa técnica y creativa que despierta interés tanto en ingenieros de materiales como en físicos cuánticos.

## 📚 Lo que aprendimos

- Profundizamos en los fundamentos de los polímeros y aleaciones con memoria de forma.
- Entendimos mejor las limitaciones actuales de la computación y física cuántica aplicada a sistemas macroscópicos.
- Aprendimos a comunicar ideas altamente técnicas y especulativas de manera accesible, balanceando ambición con honestidad científica.
- Reforzamos habilidades de modelado y simulación para representar fenómenos aún no completamente realizables experimentalmente.

## 🔭 Qué sigue

- [ ] Colaborar con laboratorios de ciencia de materiales para validar experimentalmente los componentes no cuánticos del sistema (SMP/SMA con sensores integrados).
- [ ] Explorar alternativas más viables a corto plazo, como mecanismos de autorreparación asistidos por IA o microcápsulas reactivas, mientras la tecnología cuántica macroscópica madura.
- [ ] Profundizar en simulaciones con software de química cuántica (DFT, dinámica molecular) para dar mayor sustento teórico a las hipótesis planteadas.
- [ ] Buscar financiamiento o alianzas académicas para convertir el concepto en una línea de investigación a largo plazo.

## 📦 Instalación

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio

# Instala las dependencias
npm install

# Configura tus variables de entorno (por ejemplo, la clave de la API de Gemini)
cp .env.example .env
```

## ▶️ Uso

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar el servidor
npm start
```

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">Hecho con 🧠 y curiosidad científica.</p>
