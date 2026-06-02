export type Role = 'cliente' | 'admin';
export type MachineType = 'Pro' | 'Master';

export interface Profile {
  id: string;
  nome: string;
  email: string;
  role: Role;
}

export interface CalculationResults {
  flangeBlade?: string;
  innerHole?: string;
  overcut: string;
  maxCut0: string;
  maxCut45: string;
  forwardSpeed: string;
  rotationSpeed: string;
  discToWater: string;
}
