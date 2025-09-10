export enum Unit {
  MM = 'mm',
  CM = 'cm',
  M = 'm',
}

export interface Dimension {
  id: string;
  length: string;
  height: string;
  unit: Unit;
}
