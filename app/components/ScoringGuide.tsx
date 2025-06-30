export default function ScoringGuide() {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Scoring Guide</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">1. Data Quality (0-3 points)</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li><strong>Point Density:</strong> 0 = &lt;1pt/m², 1 = 1-4pt/m², 2 = &gt;4pt/m²</li>
            <li><strong>Visualization Products:</strong> Check each if feature is clearly visible (1 point if ≥2 checked)</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">2. Morphological Score (0-3 points)</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li><strong>Geometric Regularity:</strong> 0 = irregular/natural, 1 = clear geometric form</li>
            <li><strong>Internal Complexity:</strong> 0 = simple, 1 = complex structures visible</li>
            <li><strong>Size:</strong> 0 = &lt;150m, 1 = &gt;150m</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">3. Landscape Context (0-2 points)</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li><strong>Elevation Percentile:</strong> 0 = lowest 25%, 1 = middle 50%, 2 = highest 25% in 1km radius</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">4. Water Access (0-2 points)</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li><strong>Modern Water:</strong> 1 point if within 500m</li>
            <li><strong>Historical Maps:</strong> 1 point if historical water source within 1km</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">5. Vegetation Anomaly (0-2 points)</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li><strong>Land Cover Types:</strong> Agricultural, Forest, Urban/Built</li>
            <li><strong>Anomaly Score:</strong> Agricultural (0-2), Forest (0-1), Urban (0)</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">6. Archaeological Context (0-1 point)</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>1 point if known archaeological sites within 2km</li>
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Probability Categories</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li><span className="font-semibold text-red-600">Low:</span> 0-4 points</li>
            <li><span className="font-semibold text-orange-600">Medium:</span> 5-8 points</li>
            <li><span className="font-semibold text-green-600">High:</span> 9+ points</li>
          </ul>
        </div>
      </div>
    </div>
  );
}