// Test script for LIDAR Archaeological Scoring System

const SCORING_PROFILES = {
  prehistoric: {
    dataQuality: 0.15,
    morphology: 0.15,
    elevation: 0.10,
    waterAccess: 0.35,
    vegetation: 0.15,
    archaeology: 0.10
  },
  roman_military: {
    dataQuality: 0.15,
    morphology: 0.25,
    elevation: 0.20,
    waterAccess: 0.15,
    vegetation: 0.10,
    archaeology: 0.15
  }
};

function calculateScore(site, profile) {
  const weights = SCORING_PROFILES[profile];
  
  // Component scores
  const dataQualityScore = site.dataQuality;
  const morphologyScore = site.morphology;
  const contextScore = site.context;
  const waterScore = site.water;
  const vegetationScore = site.vegetation;
  const archaeologyScore = site.archaeology;
  
  // Apply weights
  const weightedScore = 
    (dataQualityScore * weights.dataQuality) +
    (morphologyScore * weights.morphology) +
    (contextScore * weights.elevation) +
    (waterScore * weights.waterAccess) +
    (vegetationScore * weights.vegetation) +
    (archaeologyScore * weights.archaeology);
  
  const totalScore = weightedScore * 13; // Scale to 0-13 range
  
  let probability = 'Low';
  if (totalScore > 8) probability = 'High';
  else if (totalScore > 4) probability = 'Medium';
  
  return { totalScore, probability, weightedScore };
}

// Test Case 1: Prehistoric settlement (high water access)
console.log('\n=== Test 1: Prehistoric Settlement ===');
const prehistoricSite = {
  dataQuality: 2,  // Good data
  morphology: 1,   // Simple features
  context: 1,      // Middle elevation
  water: 2,        // Excellent water access
  vegetation: 1,   // Some anomalies
  archaeology: 1   // Known sites nearby
};

const prehistoricResult = calculateScore(prehistoricSite, 'prehistoric');
console.log('Input scores:', prehistoricSite);
console.log('Result:', prehistoricResult);
console.log('Expected: High score due to water access weight (35%)');

// Test Case 2: Roman military site (geometric features)
console.log('\n=== Test 2: Roman Military Site ===');
const romanSite = {
  dataQuality: 2,  // Good data
  morphology: 3,   // Highly geometric
  context: 2,      // Strategic elevation
  water: 1,        // Moderate water
  vegetation: 0,   // No anomalies
  archaeology: 1   // Known sites nearby
};

const romanResult = calculateScore(romanSite, 'roman_military');
console.log('Input scores:', romanSite);
console.log('Result:', romanResult);
console.log('Expected: High score due to morphology (25%) and elevation (20%)');

// Test Case 3: Low scoring site
console.log('\n=== Test 3: Low Scoring Site ===');
const lowSite = {
  dataQuality: 1,  // Poor data
  morphology: 0,   // No clear features
  context: 0,      // Low elevation
  water: 0,        // No water access
  vegetation: 0,   // No anomalies
  archaeology: 0   // No known sites
};

const lowResult = calculateScore(lowSite, 'prehistoric');
console.log('Input scores:', lowSite);
console.log('Result:', lowResult);
console.log('Expected: Low probability');

// Test Case 4: Sensitivity Analysis
console.log('\n=== Test 4: Sensitivity Analysis ===');
const testSite = {
  dataQuality: 3,
  morphology: 0,
  context: 0,
  water: 0,
  vegetation: 0,
  archaeology: 0
};

console.log('Site with only data quality score:', testSite);
const sensitivityResult = calculateScore(testSite, 'prehistoric');
console.log('Result:', sensitivityResult);
console.log('Data quality contributes:', (3 * 0.15 * 13).toFixed(2), 'points');
console.log('This shows single-factor dominance!');

// Test random sampling compliance
console.log('\n=== Test 5: Random Sampling Compliance ===');
function checkSamplingCompliance(high, medium, low, empty) {
  const total = medium + low + empty;
  const expectedTotal = Math.floor(high / 10) * 4; // 10:2:1:1 ratio
  const compliance = total >= expectedTotal ? 100 : (total / expectedTotal * 100);
  
  return {
    high, medium, low, empty,
    expectedOthers: expectedTotal,
    actualOthers: total,
    compliance: compliance.toFixed(0) + '%',
    status: compliance >= 80 ? 'GOOD' : compliance >= 60 ? 'FAIR' : 'POOR'
  };
}

console.log('Scenario 1:', checkSamplingCompliance(20, 4, 2, 2));
console.log('Scenario 2:', checkSamplingCompliance(30, 3, 1, 0));
console.log('Scenario 3:', checkSamplingCompliance(10, 2, 1, 1));

console.log('\n=== Testing Complete ===');