'use client';

import React, { useEffect, useState } from 'react';
import { RandomSamplingRecord } from '../types';

interface RandomSamplingProps {
  samplingRecord: RandomSamplingRecord;
  onUpdate: (record: RandomSamplingRecord) => void;
  currentSiteScore?: number;
}

export default function RandomSampling({ 
  samplingRecord, 
  onUpdate,
  currentSiteScore 
}: RandomSamplingProps) {
  const [showWarning, setShowWarning] = useState(false);
  
  const targetRatio = {
    high: 10,
    medium: 2,
    low: 1,
    empty: 1
  };

  useEffect(() => {
    // Check compliance
    const { highScoringSites, mediumScoringSites, lowScoringSites, emptyAreas } = samplingRecord;
    const totalTargeted = highScoringSites + mediumScoringSites + lowScoringSites + emptyAreas;
    
    if (totalTargeted > 0) {
      const actualRatio = highScoringSites / Math.max(1, mediumScoringSites + lowScoringSites + emptyAreas);
      const targetRatioValue = targetRatio.high / (targetRatio.medium + targetRatio.low + targetRatio.empty);
      const compliance = Math.min(actualRatio / targetRatioValue, 1) * 100;
      
      if (compliance < 70 && highScoringSites > 5) {
        setShowWarning(true);
      }
      
      onUpdate({
        ...samplingRecord,
        complianceRatio: compliance,
        lastUpdated: new Date().toISOString()
      });
    }
  }, [samplingRecord.highScoringSites, samplingRecord.mediumScoringSites, 
      samplingRecord.lowScoringSites, samplingRecord.emptyAreas]);

  const incrementCategory = (category: 'high' | 'medium' | 'low' | 'empty') => {
    const updated = { ...samplingRecord };
    
    switch (category) {
      case 'high':
        updated.highScoringSites++;
        break;
      case 'medium':
        updated.mediumScoringSites++;
        break;
      case 'low':
        updated.lowScoringSites++;
        break;
      case 'empty':
        updated.emptyAreas++;
        break;
    }
    
    updated.totalSites++;
    onUpdate(updated);
  };

  const getRecommendation = () => {
    const { highScoringSites, mediumScoringSites, lowScoringSites, emptyAreas } = samplingRecord;
    
    // Calculate what should be sampled next
    const currentTotal = mediumScoringSites + lowScoringSites + emptyAreas;
    const expectedTotal = Math.floor(highScoringSites / targetRatio.high) * 
                         (targetRatio.medium + targetRatio.low + targetRatio.empty);
    
    if (currentTotal < expectedTotal) {
      const deficit = expectedTotal - currentTotal;
      const mediumDeficit = Math.floor(deficit * targetRatio.medium / (targetRatio.medium + targetRatio.low + targetRatio.empty));
      const lowDeficit = Math.floor(deficit * targetRatio.low / (targetRatio.medium + targetRatio.low + targetRatio.empty));
      const emptyDeficit = deficit - mediumDeficit - lowDeficit;
      
      return {
        medium: Math.max(0, mediumDeficit),
        low: Math.max(0, lowDeficit),
        empty: Math.max(0, emptyDeficit)
      };
    }
    
    return { medium: 0, low: 0, empty: 0 };
  };

  const recommendation = getRecommendation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Random Sampling Protocol</h3>
      
      {/* Compliance Status */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Sampling Compliance</p>
          <p className="text-2xl font-bold text-slate-900">
            {samplingRecord.complianceRatio.toFixed(0)}%
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
          samplingRecord.complianceRatio >= 80 
            ? 'bg-green-100 text-green-800' 
            : samplingRecord.complianceRatio >= 60
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {samplingRecord.complianceRatio >= 80 ? 'Good' : 
           samplingRecord.complianceRatio >= 60 ? 'Fair' : 'Poor'}
        </div>
      </div>

      {/* Warning Message */}
      {showWarning && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500">
          <p className="text-sm font-semibold text-red-800">Bias Warning!</p>
          <p className="text-sm text-red-700">
            You're focusing too much on high-scoring sites. Sample more medium, low, and empty areas.
          </p>
        </div>
      )}

      {/* Sampling Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium text-gray-600">High Score Sites</p>
          <p className="text-xl font-bold text-green-600">{samplingRecord.highScoringSites}</p>
          <button
            onClick={() => incrementCategory('high')}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Add Site
          </button>
        </div>
        
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium text-gray-600">Medium Score Sites</p>
          <p className="text-xl font-bold text-yellow-600">{samplingRecord.mediumScoringSites}</p>
          <button
            onClick={() => incrementCategory('medium')}
            className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
          >
            Add Site
          </button>
        </div>
        
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium text-gray-600">Low Score Sites</p>
          <p className="text-xl font-bold text-orange-600">{samplingRecord.lowScoringSites}</p>
          <button
            onClick={() => incrementCategory('low')}
            className="mt-2 px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
          >
            Add Site
          </button>
        </div>
        
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium text-gray-600">Empty Areas</p>
          <p className="text-xl font-bold text-gray-600">{samplingRecord.emptyAreas}</p>
          <button
            onClick={() => incrementCategory('empty')}
            className="mt-2 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Add Area
          </button>
        </div>
      </div>

      {/* Target Ratio Display */}
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h4 className="font-semibold text-blue-900 mb-2">Target Sampling Ratio</h4>
        <p className="text-sm text-blue-800">
          For every 10 high-scoring sites, evaluate:
        </p>
        <ul className="mt-2 text-sm text-blue-700 ml-4">
          <li>• 2 medium-scoring sites</li>
          <li>• 1 low-scoring site</li>
          <li>• 1 empty area (no visible features)</li>
        </ul>
      </div>

      {/* Recommendations */}
      {(recommendation.medium > 0 || recommendation.low > 0 || recommendation.empty > 0) && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">Recommended Next Samples</h4>
          <p className="text-sm text-yellow-800 mb-2">
            To maintain unbiased sampling, evaluate:
          </p>
          <ul className="text-sm text-yellow-700 ml-4">
            {recommendation.medium > 0 && (
              <li>• {recommendation.medium} medium-scoring site{recommendation.medium > 1 ? 's' : ''}</li>
            )}
            {recommendation.low > 0 && (
              <li>• {recommendation.low} low-scoring site{recommendation.low > 1 ? 's' : ''}</li>
            )}
            {recommendation.empty > 0 && (
              <li>• {recommendation.empty} empty area{recommendation.empty > 1 ? 's' : ''}</li>
            )}
          </ul>
        </div>
      )}

      {/* Current Site Classification Helper */}
      {currentSiteScore !== undefined && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm font-medium text-gray-700">
            Current site score: {currentSiteScore} - 
            <span className="font-bold ml-1">
              {currentSiteScore > 8 ? 'High' : 
               currentSiteScore > 4 ? 'Medium' : 'Low'}
            </span>
          </p>
        </div>
      )}

      {/* Export Stats */}
      <div className="mt-4 text-xs text-gray-500">
        Total sites evaluated: {samplingRecord.totalSites} | 
        Last updated: {new Date(samplingRecord.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}