import { CalculationResults, MachineType } from '../types';

export const CLIENT_ENGINE_NAMES: Record<string, string> = {
  'MTB16 4B (BT40) (A) - 22HP': 'Spindle A - 22hp',
  'SBE.M 107E/4 (A) - 22,5HP': 'Motor A - 22,5hp',
  'ME105 4D (B) - 24HP': 'Motor B - 24hp',
  'EFL20 (C) - 27,5HP': 'Motor C - 27,5hp',
  'MTB24 6A (ISO50) (B) - 39HP': 'Spindle B - 39hp',
  'ME125-4L 4P (D) - 55HP': 'Motor D - 41hp',
};

export const materials = ['Mármore', 'Travertino', 'Granito', 'Cerâmica'];

export function getThicknesses() {
  return Array.from({ length: 105 }, (_, index) => `${10 + index * 5} mm`);
}

export function getDiameters(machine: MachineType) {
  if (machine === 'Pro') {
    return ['300 mm', '350 mm', '400 mm', '450 mm', '500 mm', '625 mm', '650 mm', '725 mm', '800 mm', '900 mm'];
  }

  return ['350 mm', '400 mm', '450 mm', '500 mm', '625 mm', '725 mm', '800 mm', '900 mm', '1000 mm', '1100 mm', '1200 mm', '1250 mm'];
}

export function getEngines(machine: MachineType) {
  if (machine === 'Pro') {
    return [
      'SBE.M 107E/4 (A) - 22,5HP',
      'ME105 4D (B) - 24HP',
      'EFL20 (C) - 27,5HP',
      'MTB16 4B (BT40) (A) - 22HP',
    ];
  }

  return ['ME125-4L 4P (D) - 55HP', 'MTB24 6A (ISO50) (B) - 39HP'];
}

export function defaultsForMachine(machine: MachineType) {
  if (machine === 'Pro') {
    return {
      enginePower: 'MTB16 4B (BT40) (A) - 22HP',
      diameter: '500 mm',
    };
  }

  return {
    enginePower: 'MTB24 6A (ISO50) (B) - 39HP',
    diameter: '725 mm',
  };
}

export function calculateParameters(enginePower: string, materialType: string, diameter: string, thickness: string, includeAdminFields = false): CalculationResults {
  const discDiameter = parseFloat(diameter) || 500;
  const stoneThickness = parseFloat(thickness) || 40;
  let flange = 230;
  let innerHole = 60;
  let rpmConstant = 764000;

  if (enginePower === 'SBE.M 107E/4 (A) - 22,5HP') {
    flange = 103;
    rpmConstant = 537250;
  } else if (enginePower === 'ME105 4D (B) - 24HP') {
    flange = 150;
    rpmConstant = 600000;
  } else if (enginePower === 'EFL20 (C) - 27,5HP') {
    flange = 180;
    rpmConstant = 680000;
  } else if (enginePower === 'ME125-4L 4P (D) - 55HP') {
    flange = 250;
    rpmConstant = 850000;
  } else if (enginePower === 'MTB24 6A (ISO50) (B) - 39HP') {
    flange = 280;
    innerHole = 80;
    rpmConstant = 920000;
  }

  const overcut = Math.sqrt((discDiameter * stoneThickness) - Math.pow(stoneThickness, 2));
  const maxCut0 = (discDiameter - flange) / 2;
  let maxCut45 = maxCut0 * 0.5926;

  if (enginePower === 'MTB16 4B (BT40) (A) - 22HP' && discDiameter === 500) {
    maxCut45 = 80;
  }

  let forwardSpeed = 2.0;
  if (materialType === 'Granito') forwardSpeed = 1.2;
  if (materialType === 'Cerâmica') forwardSpeed = 2.5;
  if (materialType === 'Travertino') forwardSpeed = 2.2;

  const result: CalculationResults = {
    overcut: overcut > 0 ? `${Math.round(overcut)} mm` : '0 mm',
    maxCut0: maxCut0 > 0 ? `${Math.round(maxCut0)} mm` : '0 mm',
    maxCut45: maxCut45 > 0 ? `${Math.round(maxCut45)} mm` : '0 mm',
    forwardSpeed: `${forwardSpeed.toFixed(1).replace('.', ',')} m/min`,
    rotationSpeed: `${Math.round(rpmConstant / discDiameter)} rpm`,
    discToWater: discDiameter > 450 ? '40 l/min' : '35 l/min',
  };

  if (includeAdminFields) {
    result.flangeBlade = `${flange} mm`;
    result.innerHole = `${innerHole} mm`;
  }

  return result;
}
