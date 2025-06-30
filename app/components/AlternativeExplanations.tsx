'use client';

import React from 'react';
import { AlternativeExplanation, AlternativeType } from '../types';

interface AlternativeExplanationsProps {
  explanations: AlternativeExplanation[];
  onUpdate: (explanations: AlternativeExplanation[]) => void;
}

export default function AlternativeExplanations({ 
  explanations, 
  onUpdate 
}: AlternativeExplanationsProps) {
  
  const alternativeTypes: { type: AlternativeType; label: string; description: string }[] = [
    {
      type: 'modern_military',
      label: 'Modern Military Activity',
      description: 'Training grounds, bunkers, trenches, impact craters'
    },
    {
      type: 'agricultural_earthwork',
      label: 'Agricultural Earthworks',
      description: 'Field boundaries, terraces, drainage ditches, livestock enclosures'
    },
    {
      type: 'drainage_system',
      label: 'Drainage Systems',
      description: 'Land improvement channels, water management features'
    },
    {
      type: 'natural_formation',
      label: 'Natural Formation',
      description: 'Geological features, erosion patterns, natural depressions'
    },
    {
      type: 'industrial_infrastructure',
      label: 'Industrial Infrastructure',
      description: 'Mining, quarrying, railways, industrial buildings'
    },
    {
      type: 'livestock_enclosure',
      label: 'Livestock Features',
      description: 'Animal pens, feeding areas, watering places'
    },
    {
      type: 'quarrying',
      label: 'Extraction Sites',
      description: 'Stone quarries, gravel pits, clay extraction'
    },
    {
      type: 'other',
      label: 'Other Explanation',
      description: 'Any other non-archaeological interpretation'
    }
  ];

  const initializeExplanations = () => {
    if (explanations.length === 0) {
      const newExplanations = alternativeTypes.map(alt => ({
        type: alt.type,
        probability: 'low' as const,
        evidence: '',
        checked: false
      }));
      onUpdate(newExplanations);
    }
  };

  React.useEffect(() => {
    initializeExplanations();
  }, []);

  const updateExplanation = (type: AlternativeType, updates: Partial<AlternativeExplanation>) => {
    const updated = explanations.map(exp => 
      exp.type === type ? { ...exp, ...updates } : exp
    );
    onUpdate(updated);
  };

  const getCheckedCount = () => explanations.filter(e => e.checked).length;
  const hasHighProbability = () => explanations.some(e => e.checked && e.probability === 'high');

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Alternative Explanations</h3>
      
      {/* Warning if high probability alternatives exist */}
      {hasHighProbability() && (
        <div className="mb-4 p-3 bg-orange-50 border-l-4 border-orange-500">
          <p className="text-sm font-semibold text-orange-800">
            High Probability Alternative Detected
          </p>
          <p className="text-sm text-orange-700">
            One or more non-archaeological explanations have high probability. 
            Consider additional investigation before classification.
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <p className="text-sm text-blue-800">
          Check all alternative explanations considered. This helps prevent misidentification 
          and documents your decision-making process.
        </p>
      </div>

      {/* Alternative options */}
      <div className="space-y-4">
        {alternativeTypes.map((altType) => {
          const explanation = explanations.find(e => e.type === altType.type);
          if (!explanation) return null;

          return (
            <div 
              key={altType.type} 
              className={`p-4 border rounded-lg ${
                explanation.checked ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={explanation.checked}
                  onChange={(e) => updateExplanation(altType.type, { checked: e.target.checked })}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <label className="font-medium text-gray-900 cursor-pointer">
                    {altType.label}
                  </label>
                  <p className="text-sm text-gray-800 mt-1">{altType.description}</p>
                  
                  {explanation.checked && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Probability:</label>
                        <div className="flex gap-2">
                          {(['low', 'medium', 'high'] as const).map(level => (
                            <label key={level} className="flex items-center">
                              <input
                                type="radio"
                                name={`probability-${altType.type}`}
                                value={level}
                                checked={explanation.probability === level}
                                onChange={() => updateExplanation(altType.type, { probability: level })}
                                className="mr-1"
                              />
                              <span className={`text-sm capitalize ${
                                level === 'high' ? 'text-red-600' :
                                level === 'medium' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {level}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Evidence/Notes:</label>
                        <textarea
                          value={explanation.evidence}
                          onChange={(e) => updateExplanation(altType.type, { evidence: e.target.value })}
                          placeholder="Describe evidence supporting this interpretation..."
                          className="w-full mt-1 px-2 py-1 border rounded text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-3 bg-gray-100 rounded">
        <p className="text-sm font-medium text-gray-700">
          {getCheckedCount()} alternative explanation{getCheckedCount() !== 1 ? 's' : ''} considered
          {getCheckedCount() === 0 && (
            <span className="text-red-600 ml-1">(Consider at least one alternative)</span>
          )}
        </p>
      </div>

      {/* Common misidentifications reference */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
          Common Misidentifications Reference
        </summary>
        <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
          <ul className="space-y-1 text-gray-700">
            <li>• <strong>Rectangular earthworks:</strong> Often WW2 training camps, not Roman</li>
            <li>• <strong>Circular features:</strong> Modern livestock rings, not prehistoric</li>
            <li>• <strong>Linear features:</strong> Field drains, not ancient roads</li>
            <li>• <strong>Mounds:</strong> Spoil heaps, not burial mounds</li>
            <li>• <strong>Depressions:</strong> Bomb craters, not archaeological pits</li>
            <li>• <strong>Geometric patterns:</strong> Modern forestry, not ancient fields</li>
          </ul>
        </div>
      </details>
    </div>
  );
}