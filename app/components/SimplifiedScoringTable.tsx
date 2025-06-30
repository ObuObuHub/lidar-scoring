'use client';

import React, { useState, useEffect } from 'react';
import { LidarSite, ScoringProfile, SCORING_PROFILES } from '../types';
import { createNewSite } from '../utils/siteFactory';

interface SimplifiedScoringTableProps {
  selectedProfile?: ScoringProfile;
  onSiteSelect?: (site: LidarSite) => void;
}

export default function SimplifiedScoringTable({ 
  selectedProfile = 'prehistoric',
  onSiteSelect 
}: SimplifiedScoringTableProps) {
  const [sites, setSites] = useState<LidarSite[]>([]);

  const calculateScore = (site: LidarSite): LidarSite => {
    const weights = SCORING_PROFILES[site.scoringProfile];
    
    // Simple scoring based on available data
    const dataQualityScore = Math.min(3, 
      site.dataQuality.pointDensity + 
      ([site.dataQuality.hillshade, site.dataQuality.lrm, site.dataQuality.svf, site.dataQuality.slope]
        .filter(Boolean).length >= 2 ? 1 : 0)
    );
    
    const morphologyScore = Math.min(3, site.morphology.regularity + site.morphology.complexity);
    const contextScore = Math.min(2, site.context.elevationPercentile);
    const waterScore = Math.min(2, site.water.modernWater + site.water.historicalWater.length);
    const vegetationScore = Math.min(2, site.vegetation.anomalyScore);
    const archaeologyScore = Math.min(1, site.archaeology.sitesNearby);
    
    // Apply weights
    const weightedScore = 
      (dataQualityScore * weights.dataQuality) +
      (morphologyScore * weights.morphology) +
      (contextScore * weights.elevation) +
      (waterScore * weights.waterAccess) +
      (vegetationScore * weights.vegetation) +
      (archaeologyScore * weights.archaeology);
    
    const totalScore = weightedScore * 13; // Scale to 0-13 range
    
    let probability: 'Low' | 'Medium' | 'High' = 'Low';
    if (totalScore > 8) probability = 'High';
    else if (totalScore > 4) probability = 'Medium';
    
    return {
      ...site,
      dataQuality: { ...site.dataQuality, subTotal: dataQualityScore },
      morphology: { ...site.morphology, subTotal: morphologyScore },
      context: { ...site.context, subTotal: contextScore },
      water: { ...site.water, subTotal: waterScore },
      vegetation: { ...site.vegetation, subTotal: vegetationScore },
      totalScore,
      probability
    };
  };

  const updateSite = (id: number, updates: Partial<LidarSite>) => {
    setSites(prevSites => 
      prevSites.map(site => {
        if (site.id === id) {
          const updatedSite = { ...site, ...updates, scoringProfile: selectedProfile };
          const scoredSite = calculateScore(updatedSite);
          if (onSiteSelect) onSiteSelect(scoredSite);
          return scoredSite;
        }
        return site;
      })
    );
  };

  const addNewSite = () => {
    const newSite = createNewSite(sites.length + 1, selectedProfile);
    setSites([...sites, newSite]);
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'Coordinates', 'Profile', 'Total Score', 'Probability',
      'Data Quality', 'Morphology', 'Context', 'Water', 'Vegetation', 'Archaeology',
      'ML Class', 'Confidence Level', 'Notes'
    ];

    const rows = sites.map(site => [
      site.id,
      site.coordinates,
      site.scoringProfile,
      site.totalScore.toFixed(2),
      site.probability,
      site.dataQuality.subTotal,
      site.morphology.subTotal,
      site.context.subTotal,
      site.water.subTotal,
      site.vegetation.subTotal,
      site.archaeology.sitesNearby,
      site.mlClassification,
      site.confidenceLevel,
      site.notes
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lidar_scoring_enhanced_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (sites.length === 0) {
      addNewSite();
    }
  }, []);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="border p-2">ID</th>
              <th className="border p-2">Coordinates</th>
              <th className="border p-2">Data Quality</th>
              <th className="border p-2">Morphology</th>
              <th className="border p-2">Context</th>
              <th className="border p-2">Water</th>
              <th className="border p-2">Vegetation</th>
              <th className="border p-2">Archaeology</th>
              <th className="border p-2">Total Score</th>
              <th className="border p-2">Probability</th>
              <th className="border p-2">ML Class</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map(site => (
              <tr key={site.id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{site.id}</td>
                <td className="border p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded"
                    placeholder="lat, lon"
                    value={site.coordinates}
                    onChange={(e) => updateSite(site.id, { coordinates: e.target.value })}
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="2"
                    className="w-16 px-1 py-1 border rounded text-center"
                    value={site.dataQuality.pointDensity}
                    onChange={(e) => updateSite(site.id, {
                      dataQuality: { ...site.dataQuality, pointDensity: parseInt(e.target.value) || 0 }
                    })}
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    className="w-16 px-1 py-1 border rounded text-center"
                    value={site.morphology.regularity}
                    onChange={(e) => updateSite(site.id, {
                      morphology: { ...site.morphology, regularity: parseFloat(e.target.value) || 0 }
                    })}
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="2"
                    className="w-16 px-1 py-1 border rounded text-center"
                    value={site.context.elevationPercentile}
                    onChange={(e) => updateSite(site.id, {
                      context: { ...site.context, elevationPercentile: parseInt(e.target.value) || 0 }
                    })}
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    className="w-16 px-1 py-1 border rounded text-center"
                    value={site.water.modernWater}
                    onChange={(e) => updateSite(site.id, {
                      water: { ...site.water, modernWater: parseInt(e.target.value) || 0 }
                    })}
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="2"
                    className="w-16 px-1 py-1 border rounded text-center"
                    value={site.vegetation.anomalyScore}
                    onChange={(e) => updateSite(site.id, {
                      vegetation: { ...site.vegetation, anomalyScore: parseInt(e.target.value) || 0 }
                    })}
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    className="w-16 px-1 py-1 border rounded text-center"
                    value={site.archaeology.sitesNearby}
                    onChange={(e) => updateSite(site.id, {
                      archaeology: { ...site.archaeology, sitesNearby: parseInt(e.target.value) || 0 }
                    })}
                  />
                </td>
                <td className="border p-2 text-center font-bold bg-blue-100">
                  {site.totalScore.toFixed(1)}
                </td>
                <td className={`border p-2 text-center font-bold text-white ${
                  site.probability === 'Low' ? 'bg-red-500' :
                  site.probability === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                }`}>
                  {site.probability}
                </td>
                <td className="border p-2 text-center">
                  <select
                    value={site.mlClassification}
                    onChange={(e) => updateSite(site.id, { 
                      mlClassification: e.target.value as 'A' | 'B' | 'C' 
                    })}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => onSiteSelect && onSiteSelect(site)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex gap-2">
        <button
          onClick={addNewSite}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add New Site
        </button>
        <button
          onClick={exportToCSV}
          className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Export Enhanced CSV
        </button>
      </div>
    </div>
  );
}