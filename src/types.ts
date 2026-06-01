export interface CoreLayer {
  name: string;
  thickness: string;
  composition: string;
  color: string;
  description: string;
}

export type PlanetType = 'rocky' | 'gas_giant' | 'icy_giant' | 'exoplanet';

export interface CelestialBody {
  id: string;
  name: string;
  type: PlanetType;
  diameter: number; // in km
  color: string; // primary hexadecimal color
  secondaryColor?: string; // secondary details
  distanceFromSun: number; // relative scaling unit or actual in Million km
  orbitalPeriod: number; // in Earth days
  rotationPeriod: number; // in hours
  moonsCount: number;
  gravity: number; // in m/s^2
  temperature: string; // e.g., "-170°C to 430°C"
  atmosphere: string[];
  description: string;
  funFact: string;
  hasRings: boolean;
  ringColor?: string;
  coreStructure: CoreLayer[];
}

export interface TourStop {
  id: string;
  title: string;
  planetId: string;
  cameraOffset: { x: number; y: number; z: number };
  commentary: string;
}

export interface ExoplanetConfig {
  name: string;
  colorPrimary: string;
  colorSecondary: string;
  size: number; // 0.5 to 2.5 times Earth
  atmosphereDensity: number; // 0 to 1
  rotationSpeed: number; // speed scale
  orbitalPeriod: number; // orbital period in days
  ringStyle: 'none' | 'thin' | 'dense';
  starType: 'm-class' | 'g-class' | 'o-class'; // Red dwarf, yellow, blue supergiant
}
