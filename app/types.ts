// Core site data structure
export interface LidarSite {
  id: number;
  coordinates: string;
  
  // Profile-based scoring
  scoringProfile: ScoringProfile;
  
  // Data quality and sources
  dataQuality: DataQuality;
  dataSources: DataSources;
  
  // Archaeological features
  morphology: Morphology;
  context: LandscapeContext;
  water: WaterAccess;
  vegetation: VegetationAnalysis;
  archaeology: ArchaeologicalContext;
  
  // Analysis results
  totalScore: number;
  probability: 'Low' | 'Medium' | 'High';
  confidenceLevel: ConfidenceLevel;
  mlClassification: MLClassification;
  
  // Documentation
  alternativeExplanations: AlternativeExplanation[];
  suspectedPeriod: string;
  notes: string;
  decisionRationale: string;
  nextSteps: string;
  
  // Validation tracking
  validationRecord?: ValidationRecord;
  sensitivityAnalysis?: SensitivityAnalysisResult;
}

// Scoring profiles for different site types
export type ScoringProfile = 
  | 'prehistoric'
  | 'roman_military' 
  | 'medieval'
  | 'modern_military'
  | 'agricultural'
  | 'industrial'
  | 'custom';

export interface ProfileWeights {
  dataQuality: number;
  morphology: number;
  elevation: number;
  waterAccess: number;
  vegetation: number;
  archaeology: number;
}

// Data quality with confidence tracking
export interface DataQuality {
  pointDensity: number;
  hillshade: boolean;
  lrm: boolean;
  svf: boolean;
  slope: boolean;
  multispectral: boolean;
  seasonalVariation: boolean;
  subTotal: number;
  confidence: number; // 0-100%
}

// Multi-source data tracking
export interface DataSources {
  lidar: SourceInfo;
  historicalMaps: HistoricalMapSource[];
  aerialPhotos: AerialPhotoSource[];
  satelliteImagery: SatelliteSource[];
  archaeologicalDB: ArchDBSource[];
  militaryRecords: MilitarySource[];
  landRecords: LandUseSource[];
  bibliography: BibliographicSource[];
  minimumSourcesMet: boolean;
  sourceConflicts: SourceConflict[];
}

export interface SourceInfo {
  checked: boolean;
  date: string;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  notes: string;
}

export interface HistoricalMapSource extends SourceInfo {
  period: string;
  scale: string;
  georeferenced: boolean;
}

export interface AerialPhotoSource extends SourceInfo {
  year: number;
  season: string;
  resolution: string;
}

export interface SatelliteSource extends SourceInfo {
  sensor: string;
  bands: string[];
}

export interface ArchDBSource extends SourceInfo {
  database: string;
  recordsFound: number;
}

export interface MilitarySource extends SourceInfo {
  period: string;
  type: string;
}

export interface LandUseSource extends SourceInfo {
  type: 'drainage' | 'infrastructure' | 'agricultural' | 'industrial';
}

export interface BibliographicSource extends SourceInfo {
  reference: string;
  relevantPages: string;
}

export interface SourceConflict {
  source1: string;
  source2: string;
  conflictType: string;
  resolution?: string;
}

// Period-neutral morphology
export interface Morphology {
  shape: MorphologicalShape;
  regularity: number; // 0-1
  complexity: number; // 0-1
  size: number; // in meters
  orientation: number; // degrees
  internalFeatures: string[];
  subTotal: number;
}

export interface MorphologicalShape {
  type: 'circular' | 'rectangular' | 'irregular' | 'linear' | 'complex';
  description: string;
  certainty: number; // 0-100%
}

// Enhanced landscape context
export interface LandscapeContext {
  elevationPercentile: number;
  topographicPosition: number; // TPI value
  viewshedArea: number; // km²
  slopePosition: 'valley' | 'lower' | 'middle' | 'upper' | 'ridge';
  naturalShelter: boolean;
  defensibility: number; // 0-10
  subTotal: number;
}

// Historical water access
export interface WaterAccess {
  modernWater: number;
  historicalWater: HistoricalWaterSource[];
  paleochannels: boolean;
  wetlandHistory: boolean;
  seasonalAvailability: string;
  subTotal: number;
}

export interface HistoricalWaterSource {
  period: string;
  type: 'river' | 'spring' | 'lake' | 'wetland';
  distance: number; // meters
  certainty: number; // 0-100%
}

// Advanced vegetation analysis
export interface VegetationAnalysis {
  landCover: LandCoverType;
  anomalyScore: number;
  cropMarks: CropMarkData;
  soilMoisture: number; // 0-100%
  landUseHistory: string[];
  multispectralAnomaly: boolean;
  subTotal: number;
}

export interface CropMarkData {
  present: boolean;
  season: string;
  type: string;
  confidence: number;
}

export type LandCoverType = 'agricultural' | 'forest' | 'urban' | 'grassland' | 'wetland';

// Archaeological context
export interface ArchaeologicalContext {
  sitesNearby: number;
  siteTypes: string[];
  chronology: string[];
  researchHistory: string;
  threats: string[];
}

// Confidence and uncertainty
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export interface ConfidenceFactors {
  dataQuality: number;
  sourceAgreement: number;
  alternativeExplanations: number;
  validationStatus: number;
}

// Alternative explanations
export interface AlternativeExplanation {
  type: AlternativeType;
  probability: 'low' | 'medium' | 'high';
  evidence: string;
  checked: boolean;
}

export type AlternativeType = 
  | 'modern_military'
  | 'agricultural_earthwork'
  | 'drainage_system'
  | 'natural_formation'
  | 'industrial_infrastructure'
  | 'livestock_enclosure'
  | 'quarrying'
  | 'other';

// ML Classification
export type MLClassification = 'A' | 'B' | 'C';

export interface MLClassificationCriteria {
  clarity: number; // 0-100%
  singlePeriod: boolean;
  verificationLevel: 'unverified' | 'remote' | 'field' | 'excavated';
  ambiguity: string[];
}

// Validation and ground-truthing
export interface ValidationRecord {
  date: string;
  method: 'remote' | 'field_visit' | 'test_pit' | 'excavation';
  result: 'confirmed' | 'rejected' | 'uncertain';
  notes: string;
  validator: string;
}

// Sensitivity analysis
export interface SensitivityAnalysisResult {
  baseScore: number;
  factorImpacts: FactorImpact[];
  dominantFactor?: string;
  confidenceRange: [number, number];
}

export interface FactorImpact {
  factor: string;
  scoreWithout: number;
  impact: number;
  percentage: number;
}

// Random sampling protocol
export interface RandomSamplingRecord {
  totalSites: number;
  highScoringSites: number;
  mediumScoringSites: number;
  lowScoringSites: number;
  emptyAreas: number;
  complianceRatio: number;
  lastUpdated: string;
}

// Scoring profile definitions
export const SCORING_PROFILES: Record<ScoringProfile, ProfileWeights> = {
  prehistoric: {
    dataQuality: 0.15,
    morphology: 0.15,
    elevation: 0.10,
    waterAccess: 0.35,
    vegetation: 0.15,
    archaeology: 0.10
  },
  roman_military: {
    dataQuality: 0.15,
    morphology: 0.25,
    elevation: 0.20,
    waterAccess: 0.15,
    vegetation: 0.10,
    archaeology: 0.15
  },
  medieval: {
    dataQuality: 0.15,
    morphology: 0.20,
    elevation: 0.25,
    waterAccess: 0.15,
    vegetation: 0.10,
    archaeology: 0.15
  },
  modern_military: {
    dataQuality: 0.20,
    morphology: 0.30,
    elevation: 0.15,
    waterAccess: 0.05,
    vegetation: 0.15,
    archaeology: 0.15
  },
  agricultural: {
    dataQuality: 0.15,
    morphology: 0.20,
    elevation: 0.05,
    waterAccess: 0.20,
    vegetation: 0.25,
    archaeology: 0.15
  },
  industrial: {
    dataQuality: 0.20,
    morphology: 0.25,
    elevation: 0.05,
    waterAccess: 0.10,
    vegetation: 0.20,
    archaeology: 0.20
  },
  custom: {
    dataQuality: 0.17,
    morphology: 0.17,
    elevation: 0.17,
    waterAccess: 0.17,
    vegetation: 0.16,
    archaeology: 0.16
  }
};