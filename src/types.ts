export interface MissionInfo {
  name: string;
  desc: string;
  status: 'ACTIVE' | 'OPERATIONAL' | 'EN ROUTE' | 'STANDBY' | 'COMPLETED' | 'HISTORIC' | 'DEVELOPMENT' | 'TESTING' | 'SCHEDULED' | 'PRE-LAUNCH' | 'CONCEPT' | 'INTERSTELLAR CRUISE' | 'PROPOSED';
}

export interface AtmosphereGas {
  name: string;
  percent: number;
  color: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  type: string;
  category: string;
  icon: string;
  tagline: string;
  iauId: string;
  dayLength: string;
  solarClock: string;
  drift: string;
  axis: string;
  axisKm: string;
  radius: string;
  radiusRatio: string;
  gravity: string;
  gravitySub?: string;
  period: string;
  velocity: string;
  eccentricity: string;
  eccentricitySub?: string;
  temp: string;
  tempRange: string;
  moons: string;
  mass: string;
  isProbe?: boolean;
  carrierFreq?: string;
  downlinkDelay?: string;
  atmosphereGases: AtmosphereGas[];
  missions: MissionInfo[];
  colorHex: string;
  sizeRatio: number;
  orbitDistance: number;
}

export interface TrajectoryData {
  id: string;
  name: string;
  agency: string;
  launchDate: string;
  destination: string;
  currentDistAU: number;
  currentDistKm: string;
  velocityKmS: number;
  lightDelay: string;
  status: 'INTERSTELLAR' | 'ACTIVE CRUISE' | 'ORBITAL INSERTION' | 'PRIMARY MISSION';
  powerStatus: string;
  signalStrength: string;
  frequency: string;
  keyInstruments: string[];
  trajectoryPoints: [number, number, number][];
}

export interface SpectralBand {
  wavelengthNm: number;
  element: string;
  description: string;
  intensity: number;
  type: 'absorption' | 'emission';
  color: string;
}

export interface OrbitalEvent {
  id: string;
  title: string;
  target: string;
  date: string;
  timeRemainingDays: number;
  type: 'CONJUNCTION' | 'ECLIPSE' | 'PERIHELION' | 'FLYBY' | 'OPPOSITION' | 'OCCULTATION';
  description: string;
  eclipticCoords: string;
  visibility: string;
}

export type ViewTab = 'orrery' | 'telemetry' | 'trajectories' | 'spectrometry' | 'events';
