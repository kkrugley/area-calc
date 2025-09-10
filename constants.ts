import { Unit } from './types';

export const UNITS = [
  { value: Unit.MM, label: 'mm' },
  { value: Unit.CM, label: 'cm' },
  { value: Unit.M, label: 'm' },
];

// Conversion factors to millimeters (mm)
export const CONVERSION_FACTORS: Record<Unit, number> = {
  [Unit.MM]: 1,
  [Unit.CM]: 10,
  [Unit.M]: 1000,
};

export const DEFAULT_CONTINGENCY_PERCENT = 15;
