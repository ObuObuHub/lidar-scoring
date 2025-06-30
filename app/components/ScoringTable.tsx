'use client';

import React, { useState, useEffect } from 'react';
import { LidarSite, LandCoverType } from '../types';

export default function ScoringTable() {
  const [sites, setSites] = useState<LidarSite[]>([]);

  const createNewSite = (id: number): LidarSite => ({
    id,
    coordinates: '',
    dataQuality: {
      pointDensity: 0,
      hillshade: false,
      lrm: false,
      svf: false,
      slope: false,
      subTotal: 0
    },
    morphology: {
      geometric: 0,
      complex: 0,
      sizeLarge: 0,
      subTotal: 0
    },
    context: {
      elevationPercentile: 0,
      subTotal: 0
    },
    water: {
      modernWater: 0,
      historicalMaps: 0,
      subTotal: 0
    },
    vegetation: {
      landCover: 'agricultural',
      anomalyScore: 0,
      subTotal: 0
    },
    archaeology: {
      sitesNearby: 0
    },
    totalScore: 0,
    probability: 'Low',
    suspectedPeriod: '',
    notes: ''
  });

  const calculateScores = (site: LidarSite): LidarSite => {
    // Data Quality Score
    let dataQualityScore = site.dataQuality.pointDensity;
    const checkboxCount = [
      site.dataQuality.hillshade,
      site.dataQuality.lrm,
      site.dataQuality.svf,
      site.dataQuality.slope
    ].filter(Boolean).length;
    if (checkboxCount >= 2) dataQualityScore += 1;
    dataQualityScore = Math.min(3, dataQualityScore);

    // Morphology Score
    const morphologyScore = site.morphology.geometric + site.morphology.complex + site.morphology.sizeLarge;

    // Context Score
    const contextScore = site.context.elevationPercentile;

    // Water Score
    const waterScore = site.water.modernWater + site.water.historicalMaps;

    // Vegetation Score
    let vegetationScore = site.vegetation.anomalyScore;
    if (site.vegetation.landCover === 'forest' && vegetationScore > 1) {
      vegetationScore = 1;
    } else if (site.vegetation.landCover === 'urban') {
      vegetationScore = 0;
    }

    // Total Score
    const totalScore = dataQualityScore + morphologyScore + contextScore + 
                      waterScore + vegetationScore + site.archaeology.sitesNearby;

    // Probability
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
          const updatedSite = { ...site, ...updates };
          return calculateScores(updatedSite);
        }
        return site;
      })
    );
  };

  const addNewSite = () => {
    const newId = sites.length + 1;
    setSites([...sites, createNewSite(newId)]);
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'Coordinates', 'Point Density', 'Hillshade', 'LRM', 'SVF', 'Slope',
      'Data Quality Total', 'Geometric', 'Complex', 'Size>150m', 'Morphology Total',
      'Elevation Percentile', 'Landscape Total', 'Modern Water', 'Historical Maps',
      'Water Total', 'Land Cover', 'Anomaly Score', 'Vegetation Total',
      'Archaeological Context', 'Total Score', 'Probability', 'Suspected Period', 'Notes'
    ];

    const rows = sites.map(site => [
      site.id,
      site.coordinates,
      site.dataQuality.pointDensity,
      site.dataQuality.hillshade ? 1 : 0,
      site.dataQuality.lrm ? 1 : 0,
      site.dataQuality.svf ? 1 : 0,
      site.dataQuality.slope ? 1 : 0,
      site.dataQuality.subTotal,
      site.morphology.geometric,
      site.morphology.complex,
      site.morphology.sizeLarge,
      site.morphology.subTotal,
      site.context.elevationPercentile,
      site.context.subTotal,
      site.water.modernWater,
      site.water.historicalMaps,
      site.water.subTotal,
      site.vegetation.landCover,
      site.vegetation.anomalyScore,
      site.vegetation.subTotal,
      site.archaeology.sitesNearby,
      site.totalScore,
      site.probability,
      site.suspectedPeriod,
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
    a.download = 'lidar_scoring_v2.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    addNewSite();
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-lg">
        <thead>
          <tr>
            <th rowSpan={2} className="border border-gray-300 bg-slate-800 text-white p-2 sticky left-0 z-20">ID</th>
            <th rowSpan={2} className="border border-gray-300 bg-slate-800 text-white p-2">Coordinates<br/>(lat, lon)</th>
            <th colSpan={6} className="border border-gray-300 bg-slate-900 text-white p-2 text-center">Data Quality (0-3)</th>
            <th colSpan={4} className="border border-gray-300 bg-slate-900 text-white p-2 text-center">Morphology (0-3)</th>
            <th colSpan={2} className="border border-gray-300 bg-slate-900 text-white p-2 text-center">Context (0-2)</th>
            <th colSpan={3} className="border border-gray-300 bg-slate-900 text-white p-2 text-center">Water (0-2)</th>
            <th colSpan={3} className="border border-gray-300 bg-slate-900 text-white p-2 text-center">Vegetation (0-2)</th>
            <th className="border border-gray-300 bg-slate-900 text-white p-2 text-center">Archaeology</th>
            <th rowSpan={2} className="border border-gray-300 bg-blue-600 text-white p-2">Total<br/>Score</th>
            <th rowSpan={2} className="border border-gray-300 bg-slate-800 text-white p-2">Probability</th>
            <th rowSpan={2} className="border border-gray-300 bg-slate-800 text-white p-2">Suspected<br/>Period</th>
            <th rowSpan={2} className="border border-gray-300 bg-slate-800 text-white p-2">Notes</th>
          </tr>
          <tr>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Point<br/>Density</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Hillshade</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">LRM</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">SVF</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Slope</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Sub-total</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Geometric</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Complex</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Size&gt;150m</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Sub-total</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Elevation<br/>Percentile</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Sub-total</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Modern<br/>&lt;500m</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Historical<br/>Maps</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Sub-total</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Land<br/>Cover</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Anomaly<br/>Score</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Sub-total</th>
            <th className="border border-gray-300 bg-slate-700 text-white p-2 text-xs">Sites<br/>&lt;2km</th>
          </tr>
        </thead>
        <tbody>
          {sites.map(site => (
            <tr key={site.id} className="even:bg-gray-50">
              <td className="border border-gray-300 p-1 text-center sticky left-0 bg-white">{site.id}</td>
              <td className="border border-gray-300 p-1">
                <input
                  type="text"
                  className="w-full p-1 text-sm"
                  placeholder="46.123, 21.456"
                  value={site.coordinates}
                  onChange={(e) => updateSite(site.id, { coordinates: e.target.value })}
                />
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="number"
                  min="0"
                  max="2"
                  className="w-12 p-1 text-center text-sm"
                  value={site.dataQuality.pointDensity}
                  onChange={(e) => updateSite(site.id, {
                    dataQuality: { ...site.dataQuality, pointDensity: parseInt(e.target.value) || 0 }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1 text-center">
                <input
                  type="checkbox"
                  checked={site.dataQuality.hillshade}
                  onChange={(e) => updateSite(site.id, {
                    dataQuality: { ...site.dataQuality, hillshade: e.target.checked }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1 text-center">
                <input
                  type="checkbox"
                  checked={site.dataQuality.lrm}
                  onChange={(e) => updateSite(site.id, {
                    dataQuality: { ...site.dataQuality, lrm: e.target.checked }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1 text-center">
                <input
                  type="checkbox"
                  checked={site.dataQuality.svf}
                  onChange={(e) => updateSite(site.id, {
                    dataQuality: { ...site.dataQuality, svf: e.target.checked }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1 text-center">
                <input
                  type="checkbox"
                  checked={site.dataQuality.slope}
                  onChange={(e) => updateSite(site.id, {
                    dataQuality: { ...site.dataQuality, slope: e.target.checked }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1 text-center font-semibold bg-gray-100">
                {site.dataQuality.subTotal}
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="number"
                  min="0"
                  max="1"
                  className="w-12 p-1 text-center text-sm"
                  value={site.morphology.geometric}
                  onChange={(e) => updateSite(site.id, {
                    morphology: { ...site.morphology, geometric: parseInt(e.target.value) || 0 }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="number"
                  min="0"
                  max="1"
                  className="w-12 p-1 text-center text-sm"
                  value={site.morphology.complex}
                  onChange={(e) => updateSite(site.id, {
                    morphology: { ...site.morphology, complex: parseInt(e.target.value) || 0 }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="number"
                  min="0"
                  max="1"
                  className="w-12 p-1 text-center text-sm"
                  value={site.morphology.sizeLarge}
                  onChange={(e) => updateSite(site.id, {
                    morphology: { ...site.morphology, sizeLarge: parseInt(e.target.value) || 0 }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1 text-center font-semibold bg-gray-100">
                {site.morphology.subTotal}
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="number"
                  min="0"
                  max="2"
                  className="w-12 p-1 text-center text-sm"
                  value={site.context.elevationPercentile}
                  onChange={(e) => updateSite(site.id, {
                    context: { ...site.context, elevationPercentile: parseInt(e.target.value) || 0 }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1 text-center font-semibold bg-gray-100">
                {site.context.subTotal}
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="number"
                  min="0"
                  max="1"
                  className="w-12 p-1 text-center text-sm"
                  value={site.water.modernWater}
                  onChange={(e) => updateSite(site.id, {
                    water: { ...site.water, modernWater: parseInt(e.target.value) || 0 }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="number"
                  min="0"
                  max="1"
                  className="w-12 p-1 text-center text-sm"
                  value={site.water.historicalMaps}
                  onChange={(e) => updateSite(site.id, {
                    water: { ...site.water, historicalMaps: parseInt(e.target.value) || 0 }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1 text-center font-semibold bg-gray-100">
                {site.water.subTotal}
              </td>
              <td className="border border-gray-300 p-1">
                <select
                  className="w-full p-1 text-sm"
                  value={site.vegetation.landCover}
                  onChange={(e) => updateSite(site.id, {
                    vegetation: { ...site.vegetation, landCover: e.target.value as LandCoverType }
                  })}
                >
                  <option value="agricultural">Agricultural</option>
                  <option value="forest">Forest</option>
                  <option value="urban">Urban/Built</option>
                </select>
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="number"
                  min="0"
                  max="2"
                  className="w-12 p-1 text-center text-sm"
                  value={site.vegetation.anomalyScore}
                  onChange={(e) => updateSite(site.id, {
                    vegetation: { ...site.vegetation, anomalyScore: parseInt(e.target.value) || 0 }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1 text-center font-semibold bg-gray-100">
                {site.vegetation.subTotal}
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="number"
                  min="0"
                  max="1"
                  className="w-12 p-1 text-center text-sm"
                  value={site.archaeology.sitesNearby}
                  onChange={(e) => updateSite(site.id, {
                    archaeology: { ...site.archaeology, sitesNearby: parseInt(e.target.value) || 0 }
                  })}
                />
              </td>
              <td className="border border-gray-300 p-1 text-center font-bold bg-blue-600 text-white">
                {site.totalScore}
              </td>
              <td className={`border border-gray-300 p-1 text-center font-bold text-white ${
                site.probability === 'Low' ? 'bg-red-500' :
                site.probability === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
              }`}>
                {site.probability}
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="text"
                  className="w-full p-1 text-sm"
                  placeholder="Bronze Age?"
                  value={site.suspectedPeriod}
                  onChange={(e) => updateSite(site.id, { suspectedPeriod: e.target.value })}
                />
              </td>
              <td className="border border-gray-300 p-1">
                <textarea
                  className="w-full p-1 text-sm min-h-[40px]"
                  placeholder="Additional notes..."
                  value={site.notes}
                  onChange={(e) => updateSite(site.id, { notes: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
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
          Export to CSV
        </button>
      </div>
    </div>
  );
}