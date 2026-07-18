import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined in the environment variables.");
}

// API endpoint for Material Synthesis Simulation
app.post('/api/simulate-material', async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: 'API_KEY_MISSING',
      message: 'El servidor de IA no está configurado. Por favor, añada su GEMINI_API_KEY en la configuración de Secrets.'
    });
  }

  const { name, baseMaterial, dopant, trigger, notes } = req.body;

  try {
    const prompt = `
      Eres un prestigioso científico experto en Ciencia de Materiales Cuánticos y Nanotecnología.
      Analiza la siguiente propuesta de material con memoria de forma cuántica y autorreparación, y genera un reporte técnico de simulación muy detallado, físicamente fundamentado pero especulativo e innovador.

      Detalles de la propuesta:
      - Nombre del material o prototipo: ${name || 'N/A'}
      - Matriz o Material Base: ${baseMaterial || 'SMP (Shape Memory Polymer)'}
      - Dopante Cuántico / Aditivo: ${dopant || 'Nanosustratos de Carbono y Puntos Cuánticos'}
      - Activador / Trigger de reparación: ${trigger || 'Calor / Activación por coherencia láser'}
      - Notas adicionales: ${notes || 'Ninguna'}

      Genera un análisis científico robusto que responda exactamente al esquema JSON definido. Sé creativo, describe la física involucrada (por ejemplo, cómo el dopante facilita el túnel cuántico de átomos/oligómeros, o cómo se mantiene la coherencia a nanoescala) y entrega estimaciones realistas de propiedades mecánicas comparadas con el material convencional clásico.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Actúa como un físico cuántico y científico de materiales altamente cualificado de un laboratorio de investigación avanzada.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            materialName: { type: Type.STRING, description: 'El nombre técnico formal asignado al material formulado.' },
            molecularStructure: { type: Type.STRING, description: 'Descripción de la estructura molecular, nanodispersión de dopantes y alineamiento atómico.' },
            healingMechanism: { type: Type.STRING, description: 'Explicación teórica del mecanismo de autorreparación cuántica (por ejemplo, reducción de barrera energética por túnel cuántico o acoplamiento de espín).' },
            mechanicalProperties: {
              type: Type.OBJECT,
              properties: {
                youngModulus: { type: Type.STRING, description: 'Módulo de Young estimado (p. ej. 45 GPa, 12% superior al clásico)' },
                tensileStrength: { type: Type.STRING, description: 'Resistencia a la tracción (p. ej. 850 MPa)' },
                recoveryRatio: { type: Type.STRING, description: 'Porcentaje de recuperación de forma original (p. ej. 99.8%)' },
                healingSpeed: { type: Type.STRING, description: 'Velocidad de reparación atómica estimada ante microfisuras (p. ej. 12 nm/s vs 0.05 nm/s clásico)' }
              },
              required: ['youngModulus', 'tensileStrength', 'recoveryRatio', 'healingSpeed']
            },
            feasibilityRating: { type: Type.INTEGER, description: 'Puntuación de viabilidad tecnológica para su síntesis en laboratorio real a temperatura ambiente (1 a 100)' },
            quantumCoherenceEstimate: { type: Type.STRING, description: 'Estimación teórica de la duración de coherencia cuántica y atenuación de decoherencia térmica.' },
            researchNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Pasos recomendados para la investigación de laboratorio y simulación cuántica ab initio (DFT).'
            }
          },
          required: [
            'materialName',
            'molecularStructure',
            'healingMechanism',
            'mechanicalProperties',
            'feasibilityRating',
            'quantumCoherenceEstimate',
            'researchNextSteps'
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No se recibió respuesta válida del modelo.');
    }

    const data = JSON.parse(text.trim());
    return res.json(data);
  } catch (error: any) {
    console.error('Error in material synthesis API:', error);
    return res.status(500).json({
      error: 'SYNTHESIS_FAILED',
      message: error.message || 'Error al comunicarse con la IA para simular el material.'
    });
  }
});

// Endpoint for the Loop Engineer (Autonomous Agentic Formulation & Simulation Loop)
app.post('/api/run-loop-engineer', async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: 'API_KEY_MISSING',
      message: 'El servidor de IA no está configurado. Por favor, añada su GEMINI_API_KEY en la configuración de Secrets.'
    });
  }

  const {
    baseMaterial,
    preferredDopants,
    targetYoungModulus, // number (GPa), e.g., 50
    targetHealingSpeed, // number (nm/s), e.g., 10
    maxIterations = 3
  } = req.body;

  const iterationsToRun = Math.min(Math.max(1, Number(maxIterations) || 3), 5);
  const targetModulusNum = Number(targetYoungModulus) || 45;
  const targetSpeedNum = Number(targetHealingSpeed) || 8;

  const history: any[] = [];
  let currentPromptContext = '';
  let finalResult: any = null;
  let success = false;

  try {
    for (let i = 1; i <= iterationsToRun; i++) {
      // Step 1: Formulation Proposer Agent (Agent A)
      const proposerPrompt = `
        Eres el Agente "Formulation Engineer" (Ingeniero de Formulación de Materiales).
        Tu tarea es proponer una receta química y estructura molecular nano-dopada óptima de Memoria de Forma Cuántica para alcanzar o superar los siguientes objetivos:
        - Material Base o Matriz: ${baseMaterial || 'SMA (Nitinol)'}
        - Dopantes Preferidos / Aditivos: ${preferredDopants || 'Puntos cuánticos de grafeno o compuestos carbónicos'}
        - Objetivo Módulo de Young: >= ${targetModulusNum} GPa
        - Objetivo Velocidad de Reparación Atómica: >= ${targetSpeedNum} nm/s

        Historial de intentos previos y críticas:
        ${currentPromptContext || 'Este es el primer intento (Iteración 1). No hay historial previo.'}

        Propón una formulación altamente innovadora que ajuste los parámetros (concentración estequiométrica, espaciado de pozos cuánticos, dopaje molecular) para corregir las deficiencias reportadas en la crítica anterior.
      `;

      const proposalResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: proposerPrompt,
        config: {
          systemInstruction: 'Actúas como un ingeniero químico computacional senior experto en el diseño de fases de materiales nanoestructurados.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prototypeName: { type: Type.STRING, description: 'Nombre técnico para esta formulación de la iteración' },
              exactComposition: { type: Type.STRING, description: 'Fórmula estequiométrica exacta y dopaje molecular (p. ej., Ni50Ti50 + 0.15wt% GQDs)' },
              nanoscaleDistribution: { type: Type.STRING, description: 'Cómo se dispersan los dopantes o pozos cuánticos en la matriz y el espaciado atómico propuesto' },
              repairStimulus: { type: Type.STRING, description: 'Mecanismo físico/cuántico propuesto para la coherencia elástica y reducción de barrera energética' }
            },
            required: ['prototypeName', 'exactComposition', 'nanoscaleDistribution', 'repairStimulus']
          }
        }
      });

      const proposalText = proposalResponse.text;
      if (!proposalText) {
        throw new Error(`La iteración ${i} falló al proponer una formulación.`);
      }

      const proposal = JSON.parse(proposalText.trim());

      // Step 2: DFT Virtural Simulation & Critique Agent (Agent B)
      const evaluatorPrompt = `
        Eres el Agente "DFT & Molecular Simulation Solver" (Simulador de Densidad Funcional y Crítica Avanzada).
        Tu tarea es simular virtualmente mediante aproximaciones físicas rigurosas la propuesta entregada por el Formulation Engineer y evaluar si cumple las especificaciones requeridas.

        Propuesta a Simular:
        - Nombre: ${proposal.prototypeName}
        - Composición: ${proposal.exactComposition}
        - Distribución: ${proposal.nanoscaleDistribution}
        - Estímulo: ${proposal.repairStimulus}

        Metas del Usuario:
        - Módulo de Young Requerido: >= ${targetModulusNum} GPa
        - Velocidad de Reparación Requerida: >= ${targetSpeedNum} nm/s

        Calcula de manera fundamentada los siguientes parámetros macroscópicos esperados a temperatura ambiente (300K).
        Si el material no alcanza los objetivos requeridos, explica rigurosamente en la 'critique' qué fenómeno físico causó el fallo (p. ej., dispersión fonónica excesiva, aglomeración de dopantes, decoherencia cuántica rápida, reducción excesiva de resiliencia por exceso de carbono) y proporciona instrucciones explícitas sobre cómo debe el Formulation Engineer reajustar los porcentajes de dopante o la geometría del pozo atómico en el siguiente ciclo.
      `;

      const evaluationResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: evaluatorPrompt,
        config: {
          systemInstruction: 'Actúas como un simulador DFT computacional que analiza rigurosamente las propiedades de entrelazamiento de espín y resiliencia de fractura.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              youngModulusGpa: { type: Type.NUMBER, description: 'Módulo de Young simulado en GPa (p. ej. 48.5)' },
              tensileStrengthMpa: { type: Type.NUMBER, description: 'Resistencia a la tracción en MPa (p. ej. 820)' },
              recoveryRatioPercent: { type: Type.NUMBER, description: 'Tasa de recuperación elástica porcentual (p. ej. 99.7)' },
              healingSpeedNms: { type: Type.NUMBER, description: 'Velocidad de curación cuántica simulada en nm/s (p. ej. 11.2)' },
              feasibilityRating: { type: Type.INTEGER, description: 'Facilidad de síntesis real en laboratorio de película delgada (1-100)' },
              quantumCoherencePs: { type: Type.NUMBER, description: 'Duración estimada de coherencia cuántica de espín en picosegundos' },
              critique: { type: Type.STRING, description: 'Crítica científica profunda, explicando las deficiencias, éxitos y qué modificar estequiométricamente para mejorar.' },
              metAllTargets: { type: Type.BOOLEAN, description: 'True únicamente si youngModulusGpa >= ' + targetModulusNum + ' Y healingSpeedNms >= ' + targetSpeedNum }
            },
            required: [
              'youngModulusGpa',
              'tensileStrengthMpa',
              'recoveryRatioPercent',
              'healingSpeedNms',
              'feasibilityRating',
              'quantumCoherencePs',
              'critique',
              'metAllTargets'
            ]
          }
        }
      });

      const evaluationText = evaluationResponse.text;
      if (!evaluationText) {
        throw new Error(`La iteración ${i} falló al simular las propiedades.`);
      }

      const evaluation = JSON.parse(evaluationText.trim());

      // Log this iteration
      history.push({
        iteration: i,
        proposal,
        evaluation
      });

      // Update context for the next step's critique
      currentPromptContext += `
        --- Iteración ${i} ---
        Fórmula Evaluada: ${proposal.exactComposition}
        Resultados Simulados: Módulo Young = ${evaluation.youngModulusGpa} GPa (Meta: ${targetModulusNum}), Vel. Reparación = ${evaluation.healingSpeedNms} nm/s (Meta: ${targetSpeedNum}), Viabilidad = ${evaluation.feasibilityRating}/100
        Crítica del Evaluador: ${evaluation.critique}
        ¿Cumple todas las metas?: ${evaluation.metAllTargets ? 'SÍ' : 'NO'}
      `;

      if (evaluation.metAllTargets && evaluation.feasibilityRating >= 60) {
        success = true;
        finalResult = {
          materialName: proposal.prototypeName,
          molecularStructure: proposal.nanoscaleDistribution,
          healingMechanism: proposal.repairStimulus,
          mechanicalProperties: {
            youngModulus: `${evaluation.youngModulusGpa} GPa (Meta: ${targetModulusNum} GPa)`,
            tensileStrength: `${evaluation.tensileStrengthMpa} MPa`,
            recoveryRatio: `${evaluation.recoveryRatioPercent}%`,
            healingSpeed: `${evaluation.healingSpeedNms} nm/s (Meta: ${targetSpeedNum} nm/s)`
          },
          feasibilityRating: evaluation.feasibilityRating,
          quantumCoherenceEstimate: `${evaluation.quantumCoherencePs} ps de coherencia coherente simulada localmente.`,
          researchNextSteps: [
            "Exportar esta malla estequiométrica al supercomputador DFT (p. ej., VASP, Quantum ESPRESSO).",
            "Sintetizar muestra de validación mediante epitaxia de haz molecular (MBE).",
            "Mapear defectos topológicos mediante Microscopía de Túnel de Barrido (STM) de ultra bajo ruido."
          ]
        };
        break; // Met all criteria, loop completes!
      } else {
        // Prepare for the next loop, keep the best evaluated so far as candidate finalResult
        if (!finalResult || (evaluation.feasibilityRating + evaluation.youngModulusGpa) > (finalResult.feasibilityRating + parseFloat(finalResult.mechanicalProperties.youngModulus))) {
          finalResult = {
            materialName: proposal.prototypeName,
            molecularStructure: proposal.nanoscaleDistribution,
            healingMechanism: proposal.repairStimulus,
            mechanicalProperties: {
              youngModulus: `${evaluation.youngModulusGpa} GPa (Meta: ${targetModulusNum} GPa)`,
              tensileStrength: `${evaluation.tensileStrengthMpa} MPa`,
              recoveryRatio: `${evaluation.recoveryRatioPercent}%`,
              healingSpeed: `${evaluation.healingSpeedNms} nm/s (Meta: ${targetSpeedNum} nm/s)`
            },
            feasibilityRating: evaluation.feasibilityRating,
            quantumCoherenceEstimate: `${evaluation.quantumCoherencePs} ps de coherencia elástica predicha.`,
            researchNextSteps: [
              "Reevaluar el espaciado de dopantes con un solucionador DFT riguroso.",
              "Optimizar concentración para evitar aglomeración molecular.",
              "Alinear campos fonónicos con barreras de vacancia para potenciar túnel cuántico."
            ]
          };
        }
      }
    }

    // Now append highly detailed production-ready technology integration blueprint and recommendations
    const blueprintPrompt = `
      Basado en el resultado de este bucle autónomo de optimización de material, escribe una guía técnica y recomendaciones profesionales de producción real.
      Describe qué stack tecnológico de vanguardia (por ejemplo, Google DeepMind GNoME, simuladores cuánticos DFT como VASP o Quantum ESPRESSO, laboratorios de síntesis robótica autónomos como A-Lab de Berkeley) se usaría hoy en día para llevar esta formulación híbrida cuántica a la producción física real.
      Escribe en un tono extremadamente profesional, científico, senior, europeo y alemán: conciso, riguroso, estructurado y enfocado en la viabilidad pragmática.
    `;

    const blueprintResponse = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: blueprintPrompt,
      config: {
        systemInstruction: 'Actúas como un Director de Investigación de Materiales Avanzados europeo de un instituto como Max Planck, combinando pragmatismo germánico y física de vanguardia.'
      }
    });

    return res.json({
      success,
      history,
      finalMaterial: finalResult,
      productionBlueprint: blueprintResponse.text || 'No se pudo generar la guía de producción.'
    });

  } catch (error: any) {
    console.error('Error in Loop Engineer execution:', error);
    return res.status(500).json({
      error: 'LOOP_ENGINEER_FAILED',
      message: error.message || 'Error durante la iteración autónoma del Loop Engineer.'
    });
  }
});

// Setup Vite or Static assets depending on environment
async function initServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

initServer().catch(err => {
  console.error('Failed to start server:', err);
});
