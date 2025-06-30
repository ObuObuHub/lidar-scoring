'use client';

import { useState } from 'react';
import SimplifiedScoringTable from './components/SimplifiedScoringTable';
import ScoringGuide from './components/ScoringGuide';
import ScoringProfiles from './components/ScoringProfiles';
import SourceChecklist from './components/SourceChecklist';
import RandomSampling from './components/RandomSampling';
import SensitivityAnalysis from './components/SensitivityAnalysis';
import AlternativeExplanations from './components/AlternativeExplanations';
import { 
  ScoringProfile, 
  DataSources, 
  RandomSamplingRecord,
  LidarSite,
  ProfileWeights,
  SCORING_PROFILES
} from './types';

export default function Home() {
  const [selectedProfile, setSelectedProfile] = useState<ScoringProfile>('prehistoric');
  const [activeTab, setActiveTab] = useState<'scoring' | 'analysis' | 'guide'>('scoring');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Mock data for demonstration - in real app, this would come from the scoring table
  const [currentSite, setCurrentSite] = useState<LidarSite | null>(null);
  const [dataSources, setDataSources] = useState<DataSources>({
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
  });

  const [samplingRecord, setSamplingRecord] = useState<RandomSamplingRecord>({
    totalSites: 0,
    highScoringSites: 0,
    mediumScoringSites: 0,
    lowScoringSites: 0,
    emptyAreas: 0,
    complianceRatio: 100,
    lastUpdated: new Date().toISOString()
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Critical Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Important Archaeological Notice</h2>
            <div className="space-y-3 text-gray-900">
              <p>
                <strong>This tool provides probability assessments, NOT definitive identifications.</strong>
              </p>
              <p>
                High scores indicate sites that warrant further investigation through:
              </p>
              <ul className="list-disc ml-6">
                <li>Professional archaeological field survey</li>
                <li>Additional remote sensing analysis</li>
                <li>Historical research and local knowledge</li>
                <li>Systematic excavation where appropriate</li>
              </ul>
              <p className="text-red-600 font-semibold">
                Never make final determinations based solely on this scoring system.
              </p>
              <p>
                This tool is designed to prioritize areas for investigation with limited resources, 
                not to replace traditional archaeological methods.
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              I Understand - Continue to Application
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header with Warning */}
        <header className="bg-slate-900 text-white p-6 rounded-lg mb-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">LIDAR Archaeological Scoring System v3.0</h1>
              <p className="text-gray-100">Enhanced multi-criteria analysis with bias reduction</p>
            </div>
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
              <p className="text-base font-bold">Probability Tool Only</p>
            </div>
          </div>
        </header>

        {/* Main Navigation Tabs */}
        <div className="bg-white rounded-t-lg shadow-lg">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('scoring')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'scoring'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-900 hover:text-black'
              }`}
            >
              Site Scoring
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'analysis'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-900 hover:text-black'
              }`}
            >
              Analysis Tools
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'guide'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-900 hover:text-black'
              }`}
            >
              Scoring Guide
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 rounded-b-lg shadow-lg p-6">
          {activeTab === 'scoring' && (
            <div className="space-y-6">
              {/* Profile Selection */}
              <ScoringProfiles
                selectedProfile={selectedProfile}
                onProfileChange={setSelectedProfile}
              />

              {/* Source Verification */}
              <SourceChecklist
                dataSources={dataSources}
                onUpdate={setDataSources}
              />

              {/* Main Scoring Table */}
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Site Assessment</h3>
                <SimplifiedScoringTable 
                  selectedProfile={selectedProfile}
                  onSiteSelect={setCurrentSite}
                />
              </div>

              {/* Alternative Explanations */}
              <AlternativeExplanations
                explanations={[]}
                onUpdate={() => {}}
              />
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Random Sampling Tracker */}
              <RandomSampling
                samplingRecord={samplingRecord}
                onUpdate={setSamplingRecord}
                currentSiteScore={currentSite?.totalScore}
              />

              {/* Sensitivity Analysis */}
              {currentSite && (
                <SensitivityAnalysis
                  site={currentSite}
                  weights={SCORING_PROFILES[selectedProfile]}
                  onAnalysisComplete={() => {}}
                />
              )}

              {/* Bias Check Summary */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Bias Prevention Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-base font-semibold text-gray-900">Sampling Compliance</p>
                    <p className="text-xl font-bold">{samplingRecord.complianceRatio.toFixed(0)}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-base font-semibold text-gray-900">Source Verification</p>
                    <p className="text-xl font-bold">
                      {dataSources.minimumSourcesMet ? 'Met' : 'Not Met'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div>
              <ScoringGuide />
              
              {/* Additional Methodological Notes */}
              <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Methodological Framework</h3>
                <div className="space-y-4 text-gray-900">
                  <div>
                    <h4 className="font-semibold">Bias Reduction Measures:</h4>
                    <ul className="list-disc ml-6 text-base space-y-1">
                      <li>Random sampling protocol enforces evaluation of low-probability areas</li>
                      <li>Sensitivity analysis identifies single-factor dependencies</li>
                      <li>Multiple data source requirement prevents over-reliance on LIDAR</li>
                      <li>Alternative explanations must be actively considered</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Machine Learning Preparation:</h4>
                    <ul className="list-disc ml-6 text-base space-y-1">
                      <li>Class A: Clear, verified, single-period sites (ideal training data)</li>
                      <li>Class B: Clear features with some ambiguity</li>
                      <li>Class C: Unclear, multi-period, or poorly verified</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Permanent Footer Warning */}
        <div className="mt-6 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
          <p className="text-center text-yellow-800 font-semibold">
            ⚠️ Archaeological verification through field survey remains essential. 
            This tool assists prioritization only.
          </p>
        </div>
      </div>
    </div>
  );
}