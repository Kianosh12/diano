export enum QualityLevel {
  ECONOMY = 'ECONOMY',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM'
}

export enum ProjectType {
  NEW_BUILD = 'NEW_BUILD',
  RENOVATION = 'RENOVATION'
}

export enum KitchenType {
  NORMAL = 'NORMAL',
  HIGH_CONSUMPTION = 'HIGH_CONSUMPTION'
}

export enum CityType {
  METROPOLIS = 'METROPOLIS', // Tehran, Mashhad, etc.
  TOWN = 'TOWN'
}

export interface UserInputs {
  area: number;
  bedrooms: number;
  bathrooms: number;
  kitchenType: KitchenType;
  hasParking: boolean;
  projectType: ProjectType;
  cityType: CityType;
  quality: QualityLevel;
}

export interface MaterialItem {
  name: string;
  unit: string;
  quantity: number;
  unitPriceLow: number;
  unitPriceHigh: number;
}

export interface EstimateResult {
  totalPoints: {
    lighting: number;
    sockets: number;
    switches: number;
  };
  materials: MaterialItem[];
  costs: {
    materialsLow: number;
    materialsHigh: number;
    laborLow: number;
    laborHigh: number;
    totalLow: number;
    totalHigh: number;
  };
  timeEstimateDays: number;
  warnings: string[];
}