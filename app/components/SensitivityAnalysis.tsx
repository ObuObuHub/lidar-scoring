'use client';

import React, { useEffect, useState } from 'react';
import { SensitivityAnalysisResult, FactorImpact, LidarSite, ProfileWeights } from '../types';

interface SensitivityAnalysisProps {
  site: LidarSite;
  weights: ProfileWeights;
  onAnalysisComplete: (result: SensitivityAnalysisResult) => void;
}

export default function SensitivityAnalysis({ 
  site, 
  weights,
  onAnalysisComplete 
}: SensitivityAnalysisProps) {
  const [analysisResult, setAnalysisResult] = useState<SensitivityAnalysisResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    performAnalysis();
  }, [site, weights]);

  const calculateScore = (
    site: LidarSite, 
    weights: ProfileWeights, 
    excludeFactor?: string
  ): number => {
    const scores = {
      dataQuality: site.dataQuality.subTotal,
      morphology: site.morphology.subTotal,
      elevation: site.context.subTotal,
      waterAccess: site.water.subTotal,
      vegetation: site.vegetation.subTotal,
      archaeology: site.archaeology.sitesNearby
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([factor, weight]) => {
      if (factor !== excludeFactor) {
        totalScore += scores[factor as keyof typeof scores] * weight;
        totalWeight += weight;
      }
    });

    // Normalize if we excluded a factor
    if (excludeFactor && totalWeight > 0) {
      totalScore = totalScore / totalWeight;
    }

    return totalScore;
  };

  const performAnalysis = () => {
    const baseScore = calculateScore(site, weights);
    const factorImpacts: FactorImpact[] = [];

    // Calculate impact of each factor
    Object.keys(weights).forEach(factor => {
      const scoreWithout = calculateScore(site, weights, factor);
      const impact = baseScore - scoreWithout;
      const percentage = baseScore > 0 ? (impact / baseScore) * 100 : 0;

      factorImpacts.push({
        factor: factor.charAt(0).toUpperCase() + factor.slice(1).replace(/([A-Z])/g, ' $1'),
        scoreWithout,
        impact,
        percentage
      });
    });

    // Sort by impact
    factorImpacts.sort((a, b) => Math.abs(b.percentage) - Math.abs(a.percentage));

    // Identify dominant factor
    const dominantFactor = factorImpacts[0].percentage > 40 ? factorImpacts[0].factor : undefined;

    // Calculate confidence range based on data quality
    const dataConfidence = site.dataQuality.confidence || 50;
    const sourceAgreement = site.dataSources.sourceConflicts.length === 0 ? 100 : 50;
    const overallConfidence = (dataConfidence + sourceAgreement) / 2;
    
    const range = baseScore * (1 - overallConfidence / 100);
    const confidenceRange: [number, number] = [
      Math.max(0, baseScore - range),
      Math.min(13, baseScore + range)
    ];

    const result: SensitivityAnalysisResult = {
      baseScore,
      factorImpacts,
      dominantFactor,
      confidenceRange
    };

    setAnalysisResult(result);
    onAnalysisComplete(result);
  };

  if (!analysisResult) return null;

  const getDominantFactorWarning = () => {
    if (analysisResult.dominantFactor) {
      return (
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-sm font-semibold text-yellow-800">
            Single Factor Dominance Detected
          </p>
          <p className="text-sm text-yellow-700">
            {analysisResult.dominantFactor} accounts for over 40% of the score. 
            Consider additional evidence to validate this assessment.
          </p>
        </div>
      );
    }
    return null;
  };

  const getImpactColor = (percentage: number) => {
    const absPercentage = Math.abs(percentage);
    if (absPercentage > 30) return 'bg-red-500';
    if (absPercentage > 20) return 'bg-orange-500';
    if (absPercentage > 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-900">Sensitivity Analysis</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {getDominantFactorWarning()}

      {/* Score Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Base Score:</span>
          <span className="text-xl font-bold text-slate-900">
            {analysisResult.baseScore.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Confidence Range:</span>
          <span className="text-sm font-medium text-slate-700">
            {analysisResult.confidenceRange[0].toFixed(1)} - {analysisResult.confidenceRange[1].toFixed(1)}
          </span>
        </div>
      </div>

      {/* Factor Impact Visualization */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Factor Contributions:</h4>
        
        {analysisResult.factorImpacts.map((factor) => (
          <div key={factor.factor} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{factor.factor}</span>
              <span className="text-sm text-gray-600">
                {factor.percentage > 0 ? '+' : ''}{factor.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-full rounded-full ${getImpactColor(factor.percentage)}`}
                style={{ width: `${Math.abs(factor.percentage)}%` }}
              />
            </div>
            {showDetails && (
              <p className="text-xs text-gray-500">
                Score without: {factor.scoreWithout.toFixed(2)} 
                (Impact: {factor.impact.toFixed(2)})
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Interpretation Guide */}
      {showDetails && (
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">Interpretation:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• High percentages indicate factors that strongly influence the score</li>
            <li>• Balanced contributions (10-25% each) suggest robust assessment</li>
            <li>• Single factor dominance (&gt;40%) may indicate bias</li>
            <li>• Confidence range reflects data quality and source agreement</li>
          </ul>
        </div>
      )}

      {/* Recommendations based on analysis */}
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <p className="text-sm font-medium text-gray-700">
          Recommendation: 
          {analysisResult.dominantFactor ? (
            <span className="text-orange-700">
              {' '}Gather additional evidence to validate {analysisResult.dominantFactor.toLowerCase()} assessment
            </span>
          ) : (
            <span className="text-green-700">
              {' '}Well-balanced assessment across multiple factors
            </span>
          )}
        </p>
      </div>
    </div>
  );
}