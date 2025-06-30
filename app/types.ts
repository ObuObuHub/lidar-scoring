export interface LidarSite {
  id: number;
  coordinates: string;
  dataQuality: {
    pointDensity: number;
    hillshade: boolean;
    lrm: boolean;
    svf: boolean;
    slope: boolean;
    subTotal: number;
  };
  morphology: {
    geometric: number;
    complex: number;
    sizeLarge: number;
    subTotal: number;
  };
  context: {
    elevationPercentile: number;
    subTotal: number;
  };
  water: {
    modernWater: number;
    historicalMaps: number;
    subTotal: number;
  };
  vegetation: {
    landCover: 'agricultural' | 'forest' | 'urban';
    anomalyScore: number;
    subTotal: number;
  };
  archaeology: {
    sitesNearby: number;
  };
  totalScore: number;
  probability: 'Low' | 'Medium' | 'High';
  suspectedPeriod: string;
  notes: string;
}

export type LandCoverType = 'agricultural' | 'forest' | 'urban';