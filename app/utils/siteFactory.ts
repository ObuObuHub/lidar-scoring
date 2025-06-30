import { 
  LidarSite, 
  DataSources, 
  AlternativeExplanation,
  ScoringProfile,
  AlternativeType 
} from '../types';

export function createNewSite(id: number, profile: ScoringProfile = 'prehistoric'): LidarSite {
  const alternativeTypes: AlternativeType[] = [
    'modern_military',
    'agricultural_earthwork',
    'drainage_system',
    'natural_formation',
    'industrial_infrastructure',
    'livestock_enclosure',
    'quarrying',
    'other'
  ];

  const emptyAlternatives: AlternativeExplanation[] = alternativeTypes.map(type => ({
    type,
    probability: 'low',
    evidence: '',
    checked: false
  }));

  const emptyDataSources: DataSources = {
    lidar: { checked: false, date: '', quality: 'fair', notes: '' },
    historicalMaps: [],
    aerialPhotos: [],
    satelliteImagery: [],
    archaeologicalDB: [],
    militaryRecords: [],
    landRecords: [],
    bibliography: [],
    minimumSourcesMet: false,
    sourceConflicts: []
  };

  return {
    id,
    coordinates: '',
    scoringProfile: profile,
    
    // Enhanced data quality
    dataQuality: {
      pointDensity: 0,
      hillshade: false,
      lrm: false,
      svf: false,
      slope: false,
      multispectral: false,
      seasonalVariation: false,
      subTotal: 0,
      confidence: 50
    },
    
    // Data sources
    dataSources: emptyDataSources,
    
    // Period-neutral morphology
    morphology: {
      shape: {
        type: 'irregular',
        description: '',
        certainty: 50
      },
      regularity: 0,
      complexity: 0,
      size: 0,
      orientation: 0,
      internalFeatures: [],
      subTotal: 0
    },
    
    // Enhanced context
    context: {
      elevationPercentile: 0,
      topographicPosition: 0,
      viewshedArea: 0,
      slopePosition: 'middle',
      naturalShelter: false,
      defensibility: 0,
      subTotal: 0
    },
    
    // Historical water
    water: {
      modernWater: 0,
      historicalWater: [],
      paleochannels: false,
      wetlandHistory: false,
      seasonalAvailability: '',
      subTotal: 0
    },
    
    // Enhanced vegetation
    vegetation: {
      landCover: 'agricultural',
      anomalyScore: 0,
      cropMarks: {
        present: false,
        season: '',
        type: '',
        confidence: 0
      },
      soilMoisture: 0,
      landUseHistory: [],
      multispectralAnomaly: false,
      subTotal: 0
    },
    
    // Archaeological context
    archaeology: {
      sitesNearby: 0,
      siteTypes: [],
      chronology: [],
      researchHistory: '',
      threats: []
    },
    
    // Results
    totalScore: 0,
    probability: 'Low',
    confidenceLevel: 3,
    mlClassification: 'C',
    
    // Documentation
    alternativeExplanations: emptyAlternatives,
    suspectedPeriod: '',
    notes: '',
    decisionRationale: '',
    nextSteps: ''
  };
}