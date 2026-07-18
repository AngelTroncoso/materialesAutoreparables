export type MaterialType = 'SMA' | 'SMP';
export type QuantumMode = 'NONE' | 'TUNNELING' | 'ENTANGLEMENT';

export interface LatticeNode {
  id: number;
  originalX: number;
  originalY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isDamaged: boolean;
  displacementX: number;
  displacementY: number;
  element: 'Ti' | 'Ni' | 'O' | 'C' | 'Dopant';
}

export interface LatticeBond {
  from: number;
  to: number;
  originalDistance: number;
  broken: boolean;
  strength: number; // 0 to 1
}

export interface SimulationParams {
  materialType: MaterialType;
  quantumMode: QuantumMode;
  temperature: number; // in Kelvin, e.g., 100K - 400K
  barrierWidth: number; // in nm, e.g., 0.1 - 0.5
  barrierHeight: number; // in eV, e.g., 0.5 - 3.0
  coherenceField: number; // 0 to 100%
  activeSpecs?: {
    phononShielding: boolean;
    topologicalPinning: boolean;
    blochResonance: boolean;
    gnomeHpc: boolean;
    quantumTomography: boolean;
    picosecondLaser: boolean;
    kryoIsolation: boolean;
  };
}

export interface CustomMaterial {
  name: string;
  baseMaterial: string;
  dopant: string;
  trigger: string;
  notes: string;
}

export interface SynthesisResult {
  materialName: string;
  molecularStructure: string;
  healingMechanism: string;
  mechanicalProperties: {
    youngModulus: string;
    tensileStrength: string;
    recoveryRatio: string;
    healingSpeed: string;
  };
  feasibilityRating: number; // 1-100
  quantumCoherenceEstimate: string;
  researchNextSteps: string[];
}
