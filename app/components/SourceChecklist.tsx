'use client';

import React from 'react';
import { DataSources, SourceInfo, HistoricalMapSource, AerialPhotoSource } from '../types';

interface SourceChecklistProps {
  dataSources: DataSources;
  onUpdate: (sources: DataSources) => void;
}

export default function SourceChecklist({ dataSources, onUpdate }: SourceChecklistProps) {
  const updateSource = (key: keyof DataSources, value: any) => {
    const updated = { ...dataSources, [key]: value };
    
    // Check if minimum sources are met
    const requiredSourcesChecked = [
      updated.lidar.checked,
      updated.historicalMaps.some((m: HistoricalMapSource) => m.checked),
      updated.aerialPhotos.some((p: AerialPhotoSource) => p.checked),
      updated.archaeologicalDB.some((d: any) => d.checked)
    ].filter(Boolean).length;
    
    updated.minimumSourcesMet = requiredSourcesChecked >= 3;
    
    onUpdate(updated);
  };

  const addHistoricalMap = () => {
    const newMap: HistoricalMapSource = {
      checked: false,
      date: new Date().toISOString().split('T')[0],
      quality: 'fair',
      notes: '',
      period: '',
      scale: '',
      georeferenced: false
    };
    updateSource('historicalMaps', [...dataSources.historicalMaps, newMap]);
  };

  const addAerialPhoto = () => {
    const newPhoto: AerialPhotoSource = {
      checked: false,
      date: new Date().toISOString().split('T')[0],
      quality: 'fair',
      notes: '',
      year: new Date().getFullYear(),
      season: '',
      resolution: ''
    };
    updateSource('aerialPhotos', [...dataSources.aerialPhotos, newPhoto]);
  };

  const detectConflicts = () => {
    const conflicts: any[] = [];
    
    // Example conflict detection logic
    if (dataSources.lidar.checked && dataSources.historicalMaps.length > 0) {
      dataSources.historicalMaps.forEach((map, idx) => {
        if (map.checked && map.notes.toLowerCase().includes('no feature')) {
          if (dataSources.lidar.notes.toLowerCase().includes('clear feature')) {
            conflicts.push({
              source1: 'LIDAR',
              source2: `Historical Map ${idx + 1}`,
              conflictType: 'Feature presence disagreement',
              resolution: ''
            });
          }
        }
      });
    }
    
    updateSource('sourceConflicts', conflicts);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-900">Data Source Verification</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          dataSources.minimumSourcesMet 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {dataSources.minimumSourcesMet ? 'Minimum Sources Met' : 'Insufficient Sources'}
        </div>
      </div>

      {!dataSources.minimumSourcesMet && (
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
          <p className="font-semibold">Warning: Minimum data sources not met</p>
          <p className="text-sm">At least 3 different source types must be checked before scoring.</p>
        </div>
      )}

      {/* LIDAR Source */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={dataSources.lidar.checked}
            onChange={(e) => updateSource('lidar', {
              ...dataSources.lidar,
              checked: e.target.checked
            })}
            className="mr-2"
          />
          <h4 className="font-semibold text-lg">LIDAR Data</h4>
        </div>
        
        {dataSources.lidar.checked && (
          <div className="ml-6 space-y-2">
            <div>
              <label className="text-sm font-medium">Date:</label>
              <input
                type="date"
                value={dataSources.lidar.date}
                onChange={(e) => updateSource('lidar', {
                  ...dataSources.lidar,
                  date: e.target.value
                })}
                className="ml-2 px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Quality:</label>
              <select
                value={dataSources.lidar.quality}
                onChange={(e) => updateSource('lidar', {
                  ...dataSources.lidar,
                  quality: e.target.value
                })}
                className="ml-2 px-2 py-1 border rounded"
              >
                <option value="poor">Poor</option>
                <option value="fair">Fair</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes:</label>
              <textarea
                value={dataSources.lidar.notes}
                onChange={(e) => updateSource('lidar', {
                  ...dataSources.lidar,
                  notes: e.target.value
                })}
                className="w-full mt-1 px-2 py-1 border rounded"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {/* Historical Maps */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-lg">Historical Maps</h4>
          <button
            onClick={addHistoricalMap}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Add Map
          </button>
        </div>
        
        {dataSources.historicalMaps.map((map, idx) => (
          <div key={idx} className="mb-3 p-3 bg-gray-50 rounded">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={map.checked}
                onChange={(e) => {
                  const updated = [...dataSources.historicalMaps];
                  updated[idx] = { ...map, checked: e.target.checked };
                  updateSource('historicalMaps', updated);
                }}
                className="mr-2"
              />
              <span className="font-medium">Map {idx + 1}</span>
            </div>
            
            {map.checked && (
              <div className="ml-6 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm">Period:</label>
                  <input
                    type="text"
                    placeholder="e.g., 1860s"
                    value={map.period}
                    onChange={(e) => {
                      const updated = [...dataSources.historicalMaps];
                      updated[idx] = { ...map, period: e.target.value };
                      updateSource('historicalMaps', updated);
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm">Scale:</label>
                  <input
                    type="text"
                    placeholder="e.g., 1:2500"
                    value={map.scale}
                    onChange={(e) => {
                      const updated = [...dataSources.historicalMaps];
                      updated[idx] = { ...map, scale: e.target.value };
                      updateSource('historicalMaps', updated);
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm">
                    <input
                      type="checkbox"
                      checked={map.georeferenced}
                      onChange={(e) => {
                        const updated = [...dataSources.historicalMaps];
                        updated[idx] = { ...map, georeferenced: e.target.checked };
                        updateSource('historicalMaps', updated);
                      }}
                      className="mr-1"
                    />
                    Georeferenced
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Aerial Photos */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-lg">Aerial Photography</h4>
          <button
            onClick={addAerialPhoto}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Add Photo
          </button>
        </div>
        
        {dataSources.aerialPhotos.map((photo, idx) => (
          <div key={idx} className="mb-3 p-3 bg-gray-50 rounded">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={photo.checked}
                onChange={(e) => {
                  const updated = [...dataSources.aerialPhotos];
                  updated[idx] = { ...photo, checked: e.target.checked };
                  updateSource('aerialPhotos', updated);
                }}
                className="mr-2"
              />
              <span className="font-medium">Photo Set {idx + 1}</span>
            </div>
            
            {photo.checked && (
              <div className="ml-6 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm">Year:</label>
                  <input
                    type="number"
                    value={photo.year}
                    onChange={(e) => {
                      const updated = [...dataSources.aerialPhotos];
                      updated[idx] = { ...photo, year: parseInt(e.target.value) };
                      updateSource('aerialPhotos', updated);
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm">Season:</label>
                  <select
                    value={photo.season}
                    onChange={(e) => {
                      const updated = [...dataSources.aerialPhotos];
                      updated[idx] = { ...photo, season: e.target.value };
                      updateSource('aerialPhotos', updated);
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="autumn">Autumn</option>
                    <option value="winter">Winter</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Conflict Detection */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={detectConflicts}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Check for Conflicts
        </button>
        
        {dataSources.sourceConflicts.length > 0 && (
          <span className="text-red-600 font-semibold">
            {dataSources.sourceConflicts.length} conflict(s) detected
          </span>
        )}
      </div>

      {/* Display Conflicts */}
      {dataSources.sourceConflicts.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <h5 className="font-semibold text-red-800 mb-2">Source Conflicts:</h5>
          {dataSources.sourceConflicts.map((conflict, idx) => (
            <div key={idx} className="mb-2 text-sm">
              <p className="font-medium">{conflict.source1} vs {conflict.source2}</p>
              <p className="text-red-700">{conflict.conflictType}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}