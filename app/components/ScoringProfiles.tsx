'use client';

import React from 'react';
import { ScoringProfile, SCORING_PROFILES, ProfileWeights } from '../types';

interface ScoringProfilesProps {
  selectedProfile: ScoringProfile;
  onProfileChange: (profile: ScoringProfile) => void;
}

export default function ScoringProfiles({ 
  selectedProfile, 
  onProfileChange
}: ScoringProfilesProps) {
  
  const profileDescriptions: Record<ScoringProfile, string> = {
    prehistoric: 'Emphasizes water access (35%), suitable for settlements from Neolithic to Bronze Age',
    roman_military: 'Focuses on geometric morphology (25%) and strategic elevation (20%)',
    medieval: 'Prioritizes defensive positions (25% elevation) with balanced other factors',
    modern_military: 'Heavy weight on regular morphology (30%) typical of military installations'
  };

  const weights = SCORING_PROFILES[selectedProfile];



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
            
            <div className="flex items-center flex-1">
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div 
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${weight * 100}%` }}
                />
              </div>
              <span className="ml-3 text-base font-semibold text-gray-900">{Math.round(weight * 100)}%</span>
            </div>
          </div>
        ))}
      </div>


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