export type RegionType = 'CCR' | 'RCR' | 'OCR' | 'ALL';
export type PropertyCategory = 'HDB' | 'Condo' | 'Landed';

export type SelectedTab = 'overview' | 'trends' | 'yields' | 'schools' | 'pipeline' | 'forum';

export type MetricFilter = 
  | 'price_psf' 
  | 'rental_yield' 
  | 'price_to_income' 
  | 'mortgage_vs_rent' 
  | 'school_proximity' 
  | 'pipeline';

export interface CondoProject {
  id: string;
  name: string;
  district: string;
  psf: number;
  yoyChange: number;
  yield: number;
  lat: number;
  lng: number;
  hotspot?: boolean;
  completionYear?: number;
  tenure: 'Freehold' | '99-year' | '999-year';
}

export interface SchoolInfo {
  name: string;
  distanceKm: number;
  tier: 'GEP / Top 10' | 'Top 30' | 'Popular Regional';
  within1km: boolean;
}

export interface PipelineProjectInfo {
  name: string;
  developer: string;
  units: number;
  expectedEst: string;
  status: 'Preview' | 'Under Construction' | 'Newly Launched';
}

export interface DistrictData {
  id: string; // e.g. 'D09'
  code: string;
  name: string; // e.g. 'Orchard, River Valley, Grange'
  region: 'CCR' | 'RCR' | 'OCR';
  lat: number;
  lng: number;
  medianPsf: number;
  yoyGrowth: number;
  rentalYield: number;
  affordabilityIndex: number; // e.g. 14.2x
  mortgageVsRent: number; // e.g. +12%
  topTierSchoolsCount: number;
  schools: SchoolInfo[];
  pipelineProjects: PipelineProjectInfo[];
  keyCondos: CondoProject[];
  historicalPsf: { year: string; psf: number; rentPsf: number }[];
  description: string;
}

export interface SavedSearch {
  id: string;
  title: string;
  date: string;
  metric: MetricFilter;
  category: PropertyCategory;
  region: RegionType;
}
