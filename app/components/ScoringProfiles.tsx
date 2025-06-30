'use client';

import React from 'react';
import { ScoringProfile, SCORING_PROFILES, ProfileWeights } from '../types';

interface ScoringProfilesProps {
  selectedProfile: ScoringProfile;
  onProfileChange: (profile: ScoringProfile) => void;
  customWeights?: ProfileWeights;
  onCustomWeightsChange?: (weights: ProfileWeights) => void;
}

export default function ScoringProfiles({ 
  selectedProfile, 
  onProfileChange,
  customWeights,
  onCustomWeightsChange 
}: ScoringProfilesProps) {
  
  const profileDescriptions: Record<ScoringProfile, string> = {
    prehistoric: 'Emphasizes water access (35%), suitable for settlements from Neolithic to Bronze Age',
    roman_military: 'Focuses on geometric morphology (25%) and strategic elevation (20%)',
    medieval: 'Prioritizes defensive positions (25% elevation) with balanced other factors',
    modern_military: 'Heavy weight on regular morphology (30%) typical of military installations',
    agricultural: 'Vegetation patterns (25%) and water access (20%) are key indicators',
    industrial: 'Infrastructure proximity via morphology (25%) and archaeological context (20%)',
    custom: 'Define your own weights for specific research questions'
  };

  const weights = selectedProfile === 'custom' && customWeights 
    ? customWeights 
    : SCORING_PROFILES[selectedProfile];

  const handleWeightChange = (factor: keyof ProfileWeights, value: number) => {
    if (selectedProfile === 'custom' && onCustomWeightsChange) {
      const newWeights = { ...weights, [factor]: value / 100 };
      onCustomWeightsChange(newWeights);
    }
  };

  const getTotalWeight = () => {
    return Object.values(weights).reduce((sum, w) => sum + w, 0);
  };

  const isWeightValid = () => {
    const total = getTotalWeight();
    return Math.abs(total - 1.0) < 0.01;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Scoring Profile</h3>
      
      {/* Profile Selection */}
      <div className="mb-6">
        <label className="block text-base font-semibold text-gray-900 mb-2">
          Select Archaeological Context:
        </label>
        <select
          value={selectedProfile}
          onChange={(e) => onProfileChange(e.target.value as ScoringProfile)}
          className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-semibold bg-white"
        >
          <option value="prehistoric">Prehistoric Settlements</option>
          <option value="roman_military">Roman Military Sites</option>
          <option value="medieval">Medieval Fortifications</option>
          <option value="modern_military">Modern Military</option>
          <option value="agricultural">Agricultural Features</option>
          <option value="industrial">Industrial Remains</option>
          <option value="custom">Custom Profile</option>
        </select>
        
        <p className="mt-2 text-base text-gray-900 font-medium">
          {profileDescriptions[selectedProfile]}
        </p>
      </div>

      {/* Weight Display */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Factor Weights:</h4>
        
        {Object.entries(weights).map(([factor, weight]) => (
          <div key={factor} className="flex items-center space-x-3">
            <div className="w-32 text-base font-semibold capitalize text-gray-900">
              {factor.replace(/([A-Z])/g, ' $1').trim()}:
            </div>
            
            {selectedProfile === 'custom' ? (
              <div className="flex items-center flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weight * 100}
                  onChange={(e) => handleWeightChange(factor as keyof ProfileWeights, Number(e.target.value))}
                  className="flex-1 mr-3"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(weight * 100)}
                  onChange={(e) => handleWeightChange(factor as keyof ProfileWeights, Number(e.target.value))}
                  className="w-16 px-2 py-1 border rounded text-center"
                />
                <span className="ml-1 text-base font-medium">%</span>
              </div>
            ) : (
              <div className="flex items-center flex-1">
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div 
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${weight * 100}%` }}
                  />
                </div>
                <span className="ml-3 text-base font-semibold text-gray-900">{Math.round(weight * 100)}%</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Profile Validation */}
      {selectedProfile === 'custom' && (
        <div className={`mt-4 p-3 rounded ${isWeightValid() ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
          <p className={`text-base font-semibold ${isWeightValid() ? 'text-green-800' : 'text-red-800'}`}>
            Total Weight: {Math.round(getTotalWeight() * 100)}%
            {!isWeightValid() && ' (must equal 100%)'}
          </p>
        </div>
      )}

      {/* Profile Comparison */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Profile Characteristics:</h4>
        <ul className="text-base text-blue-900 space-y-1">
          {selectedProfile === 'prehistoric' && (
            <>
              <li>• Heavily weighted toward water sources (historical and modern)</li>
              <li>• Less emphasis on geometric regularity</li>
              <li>• Considers seasonal resource availability</li>
            </>
          )}
          {selectedProfile === 'roman_military' && (
            <>
              <li>• Strong emphasis on geometric forms and regularity</li>
              <li>• Strategic elevation important for camps and forts</li>
              <li>• Archaeological context valuable for military roads</li>
            </>
          )}
          {selectedProfile === 'medieval' && (
            <>
              <li>• Dominant positions crucial for defense</li>
              <li>• Morphology reflects castle and fortification plans</li>
              <li>• Water access balanced with defensibility</li>
            </>
          )}
          {selectedProfile === 'modern_military' && (
            <>
              <li>• Regular patterns from standardized construction</li>
              <li>• Less dependent on water sources</li>
              <li>• Often in upland training areas</li>
            </>
          )}
          {selectedProfile === 'agricultural' && (
            <>
              <li>• Vegetation anomalies from field systems</li>
              <li>• Water management features important</li>
              <li>• Lower elevation areas preferred</li>
            </>
          )}
          {selectedProfile === 'industrial' && (
            <>
              <li>• Morphology shows extraction/processing areas</li>
              <li>• Archaeological databases often have records</li>
              <li>• Transport infrastructure proximity</li>
            </>
          )}
          {selectedProfile === 'custom' && (
            <li>• Define weights based on your specific research questions</li>
          )}
        </ul>
      </div>

      {/* Warning about period assumptions */}
      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
        <p className="text-base text-yellow-900">
          <strong>Important:</strong> Profile selection adjusts scoring weights but does NOT determine 
          site chronology. Always consider multiple periods and alternative explanations.
        </p>
      </div>
    </div>
  );
}