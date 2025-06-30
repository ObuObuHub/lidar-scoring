import ScoringTable from './components/ScoringTable';
import ScoringGuide from './components/ScoringGuide';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="bg-slate-900 text-white p-6 rounded-lg mb-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">LIDAR Archaeological Scoring System v2.0</h1>
          <p className="text-gray-100">Based on multi-criteria analysis with improved methodology</p>
        </header>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-gray-900">
            <strong>Instructions:</strong> Enter data for each LIDAR feature. Scores are calculated automatically. 
            Maximum possible score: 13 points. Export as CSV when complete.
          </p>
        </div>

        <ScoringTable />
        <ScoringGuide />
      </div>
    </div>
  );
}