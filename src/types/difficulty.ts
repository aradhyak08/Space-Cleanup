 type DifficultyId = 'cadet' | 'pilot' | 'ace' | 'void_legend';

export interface DifficultyConfig {
  id: DifficultyId;
  name: string;
  badgeColor: string;
  badgeBg: string;
  tagline: string;
  description: string;
  hullPlates: number;
  shieldRechargeRate: number; 
  gemShieldBonus: number;
  hazardSpeedMult: number;
  hazardDensityMult: number;
  minPlanetsRequired: number;
  minGemsRequired: number;
  scoreMultiplier: number;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyId, DifficultyConfig> = {
  cadet: {
    id: 'cadet',
    name: 'CADET',
    badgeColor: '#39ff14',
    badgeBg: 'rgba(57, 255, 20, 0.15)',
    tagline: 'Casual Reconnaissance',
    description: '4 Hull Plates, relaxed hazard speeds, +15 Shield per gem. Survey any 4 celestial bodies to unlock the Warp Gateway.',
    hullPlates: 4,
    shieldRechargeRate: 1.5,
    gemShieldBonus: 15,
    hazardSpeedMult: 0.75,
    hazardDensityMult: 0.75,
    minPlanetsRequired: 4,
    minGemsRequired: 0,
    scoreMultiplier: 1.0,
  },
  pilot: {
    id: 'pilot',
    name: 'PILOT',
    badgeColor: '#00f0ff',
    badgeBg: 'rgba(0, 240, 255, 0.15)',
    tagline: 'Standard Solar Mission',
    description: '3 Hull Plates, balanced solar hazards. Survey 6 planets to power up the Warp Gateway at the system rim.',
    hullPlates: 3,
    shieldRechargeRate: 1.0,
    gemShieldBonus: 10,
    hazardSpeedMult: 1.0,
    hazardDensityMult: 1.0,
    minPlanetsRequired: 6,
    minGemsRequired: 0,
    scoreMultiplier: 1.5,
  },
  ace: {
    id: 'ace',
    name: 'ACE',
    badgeColor: '#ffaa00',
    badgeBg: 'rgba(255, 170, 0, 0.15)',
    tagline: 'Deep Space Hazard Gauntlet',
    description: '2 Hull Plates, accelerated asteroid drifts & comets. Survey all 9 planets and collect 5+ Cosmic Gems.',
    hullPlates: 2,
    shieldRechargeRate: 0.8,
    gemShieldBonus: 8,
    hazardSpeedMult: 1.35,
    hazardDensityMult: 1.25,
    minPlanetsRequired: 9,
    minGemsRequired: 5,
    scoreMultiplier: 2.2,
  },
  void_legend: {
    id: 'void_legend',
    name: 'VOID LEGEND',
    badgeColor: '#ff2a55',
    badgeBg: 'rgba(255, 42, 85, 0.2)',
    tagline: 'Brutal Odyssey: 1 Plate Only',
    description: '1 Hull Plate, extreme storm hazards. Survey all 9 planets and gather 15+ Cosmic Gems to escape the system.',
    hullPlates: 1,
    shieldRechargeRate: 0.6,
    gemShieldBonus: 6,
    hazardSpeedMult: 1.65,
    hazardDensityMult: 1.5,
    minPlanetsRequired: 9,
    minGemsRequired: 15,
    scoreMultiplier: 3.5,
  },
};