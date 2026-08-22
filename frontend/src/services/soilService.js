import api from './api';

const clamp = (val, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(val)));

function scoreNitrogen(obs) {
  let score = 40;
  const ureaMap = { 'None': 0, 'Less than 25 kg': 6, '25–50 kg': 14, '50–75 kg': 20, '75–100 kg': 24, 'More than 100 kg': 26 };
  score += ureaMap[obs.ureaUsed] ?? 0;
  if (obs.leguminousCrop === 'Yes, in last season') score += 22;
  else if (obs.leguminousCrop === 'Yes, 2–3 seasons ago') score += 10;
  if (obs.organicManure === 'Yes – Vermicompost') score += 16;
  else if (obs.organicManure === 'Yes – Compost') score += 13;
  else if (obs.organicManure === 'Yes – FYM (Farm Yard Manure)') score += 10;
  if (obs.cropRotation === 'Yes, regularly') score += 8;
  else if (obs.cropRotation === 'Sometimes') score += 4;
  if (obs.yellowingLeaves === 'Yes, young leaves are yellow') score -= 30;
  else if (obs.yellowingLeaves === 'Yes, old/lower leaves are yellow') score -= 12;
  if (obs.floodIrrigation === 'Yes, always') score -= 18;
  else if (obs.floodIrrigation === 'Sometimes') score -= 8;
  if (obs.drainage === 'Poor – water stagnates') score -= 12;
  else if (obs.drainage === 'Moderate – drains in a few hours') score -= 4;
  if (obs.waterSalinity === 'Yes, visible white crust on soil') score -= 10;
  else if (obs.waterSalinity === 'Sometimes after irrigation') score -= 5;
  if (obs.cropYield === 'Poor – much lower than expected') score -= 8;
  else if (obs.cropYield === 'Good – higher than expected') score += 6;
  return clamp(score);
}

function scorePhosphorus(obs) {
  let score = 38;
  if (obs.dapUsed === 'Yes, regularly') score += 28;
  else if (obs.dapUsed === 'Sometimes') score += 14;
  if (obs.organicManure === 'Yes – Vermicompost') score += 14;
  else if (obs.organicManure === 'Yes – Compost') score += 11;
  else if (obs.organicManure === 'Yes – FYM (Farm Yard Manure)') score += 8;
  if (obs.soilType === 'Loamy') score += 8;
  else if (obs.soilType === 'Clay') score += 4;
  else if (obs.soilType === 'Sandy') score -= 10;
  else if (obs.soilType === 'Black soil') score += 2;
  else if (obs.soilType === 'Red soil') score -= 6;
  if (obs.flowering === 'Poor flowering / fruit drop') score -= 28;
  else if (obs.flowering === 'Good flowering and fruiting') score += 8;
  if (obs.cropRotation === 'Yes, regularly') score += 6;
  else if (obs.cropRotation === 'Sometimes') score += 3;
  if (obs.floodIrrigation === 'Yes, always' && obs.soilType === 'Sandy') score -= 10;
  else if (obs.floodIrrigation === 'Yes, always') score -= 5;
  if (obs.waterSalinity === 'Yes, visible white crust on soil') score -= 10;
  else if (obs.waterSalinity === 'Sometimes after irrigation') score -= 5;
  if (obs.cropYield === 'Poor – much lower than expected') score -= 8;
  else if (obs.cropYield === 'Good – higher than expected') score += 5;
  return clamp(score);
}

function scorePotassium(obs) {
  let score = 42;
  if (obs.mopUsed === 'Yes, regularly') score += 28;
  else if (obs.mopUsed === 'Sometimes') score += 13;
  if (obs.soilType === 'Black soil') score += 22;
  else if (obs.soilType === 'Clay') score += 12;
  else if (obs.soilType === 'Loamy') score += 6;
  else if (obs.soilType === 'Red soil') score -= 8;
  else if (obs.soilType === 'Sandy') score -= 16;
  if (obs.organicManure === 'Yes – Vermicompost') score += 10;
  else if (obs.organicManure === 'Yes – FYM (Farm Yard Manure)') score += 7;
  else if (obs.organicManure === 'Yes – Compost') score += 8;
  if (obs.stemGrowth === 'Weak, plants fall over easily') score -= 26;
  else if (obs.stemGrowth === 'Strong and healthy') score += 8;
  if (obs.yearsOfCultivation === 'More than 10 years') score -= 10;
  else if (obs.yearsOfCultivation === '5–10 years') score -= 5;
  if (obs.floodIrrigation === 'Yes, always') score -= 14;
  else if (obs.floodIrrigation === 'Sometimes') score -= 6;
  if (obs.waterSalinity === 'Yes, visible white crust on soil') score -= 12;
  else if (obs.waterSalinity === 'Sometimes after irrigation') score -= 6;
  if (obs.cropYield === 'Poor – much lower than expected') score -= 8;
  else if (obs.cropYield === 'Good – higher than expected') score += 6;
  return clamp(score);
}

function levelFromScore(score) {
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

function runOfflineEngine(observations) {
  const obs = observations;
  const nScore = scoreNitrogen(obs);
  const pScore = scorePhosphorus(obs);
  const kScore = scorePotassium(obs);
  const healthScore = clamp(nScore * 0.3 + pScore * 0.25 + kScore * 0.25 + 12);
  const healthClass = healthScore >= 68 ? 'GOOD' : healthScore >= 42 ? 'MEDIUM' : 'POOR';

  return {
    _id: `SOIL-LOCAL-${Date.now()}`,
    healthScore,
    healthClass,
    summary: `Your ${obs.soilType || 'soil'} analysis complete. Score: ${healthScore}/100.`,
    nutrientLevels: {
      nitrogen: { level: levelFromScore(nScore), score: nScore },
      phosphorus: { level: levelFromScore(pScore), score: pScore },
      potassium: { level: levelFromScore(kScore), score: kScore },
    },
    soilProperties: {
      ph: { value: '6.5-7.0', category: 'Neutral' },
      texture: obs.soilType || 'Loamy',
      organicMatter: 'Medium',
      waterCapacity: 'Medium',
    },
    deficiencies: [],
    fertilizerRecommendations: [],
    cropRecommendations: { highlyRecommended: [], recommended: [], possibleWithCare: [] },
    improvementPlan: { immediate: [], shortTerm: [], longTerm: [] },
    createdAt: new Date().toISOString()
  };
}

const soilService = {
  analyzeObservation: async (observations) => {
    // 1. Try Backend API call
    try {
      const response = await api.post('/soil/analyze-observation', observations);
      const resData = response.data?.data || response.data;
      if (resData) {
        // Save to local cache as backup
        const existing = soilService.getLocalHistory();
        const updated = [resData, ...existing.filter(i => String(i._id) !== String(resData._id))];
        localStorage.setItem('agrisathi_soil_history', JSON.stringify(updated));
        return resData;
      }
    } catch (err) {
      console.warn('Backend soil API failed, using fallback engine:', err.message);
    }

    // 2. Offline fallback engine
    const localResult = runOfflineEngine(observations);
    const existing = soilService.getLocalHistory();
    const updated = [localResult, ...existing];
    localStorage.setItem('agrisathi_soil_history', JSON.stringify(updated));
    return localResult;
  },

  getSoilHistory: async () => {
    let apiData = [];
    try {
      const response = await api.get('/soil/history');
      const data = response.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        apiData = data;
        localStorage.setItem('agrisathi_soil_history', JSON.stringify(apiData));
        return apiData;
      }
    } catch (err) {
      console.warn('Error fetching soil history from API:', err.message);
    }

    return soilService.getLocalHistory();
  },

  getLocalHistory: () => {
    try {
      const raw = localStorage.getItem('agrisathi_soil_history');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  deleteSoilAnalysis: async (id) => {
    try {
      await api.delete(`/soil/${id}`);
    } catch (e) {
      console.warn('Error deleting soil from backend API:', e.message);
    }

    const local = soilService.getLocalHistory();
    const updated = local.filter(i => String(i._id) !== String(id));
    localStorage.setItem('agrisathi_soil_history', JSON.stringify(updated));
    return updated;
  }
};

export default soilService;