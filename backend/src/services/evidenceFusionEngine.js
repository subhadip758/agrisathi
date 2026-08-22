const diseaseKnowledgeBase = require('./diseaseKnowledgeBase');

/**
 * Multimodal Evidence Fusion Engine for AgriSathi
 * Fuses:
 * 1. Computer Vision Evidence (40% heuristic weight)
 * 2. 7-14 Day Weather Epidemiological Support (20% heuristic weight)
 * 3. Crop Growth Stage & Organ Alignment (15% heuristic weight)
 * 4. Soil Health & Deficiency Correlation (10% heuristic weight)
 * 5. Water Quality & Salinity Stress (5% heuristic weight)
 * 6. Irrigation Behavior & Leaf Wetness (10% heuristic weight)
 *
 * NOTE ON METHODOLOGY:
 * The fusion weights above are explicit engineering heuristics designed to integrate
 * multi-modal agricultural signals. They represent expert-system rules rather than
 * statistically calibrated probabilities.
 */
class EvidenceFusionEngine {
  /**
   * Calculate Weather Suitability Score (0.0 to 1.0)
   */
  evaluateWeatherSupport(diseaseRule, weatherContext) {
    if (!weatherContext || !weatherContext.current) {
      return { score: 0.5, level: 'Neutral', reason: 'Weather data unavailable.' };
    }

    const current = weatherContext.current || {};
    const insights = weatherContext.insights || {};
    const req = diseaseRule.weather || {};

    const temp = current.temperature || 25;
    const rh = current.humidity || 65;
    const recentRain = (insights.recent5DayRain || 0) + (current.rainfall || 0);

    let score = 0.5;
    const reasons = [];

    if (temp >= req.optTempMin && temp <= req.optTempMax) {
      score += 0.25;
      reasons.push(`Current temperature (${temp}°C) is in optimal infection window (${req.optTempMin}–${req.optTempMax}°C).`);
    } else if (temp < req.minTemp || temp > req.maxTemp) {
      score -= 0.25;
      reasons.push(`Temperature (${temp}°C) is outside disease activity range.`);
    }

    if (rh >= req.minRH) {
      score += 0.25;
      reasons.push(`High relative humidity (${rh}%) supports spore germination.`);
    } else {
      score -= 0.20;
      reasons.push(`Air humidity (${rh}%) is drier than required threshold (${req.minRH}%).`);
    }

    if (recentRain >= req.minRainfall) {
      score += 0.25;
      reasons.push(`Recent 5-day rainfall (${recentRain}mm) provides required leaf wetness.`);
    } else if (req.minRainfall && req.minRainfall > 0) {
      score -= 0.15;
      reasons.push(`Lack of rainfall (${recentRain}mm) does not provide required leaf wetness.`);
    }

    score = Math.max(0.0, Math.min(1.0, score));
    const level = score >= 0.75 ? 'High' : score >= 0.50 ? 'Medium' : 'Low';

    return {
      score: Number(score.toFixed(2)),
      level,
      reason: reasons.join(' ') || 'Weather conditions neutral for disease.'
    };
  }

  evaluateSoilSupport(diseaseRule, soilData) {
    if (!soilData) {
      return { score: 0.5, level: 'Unavailable', isAvailable: false, reason: 'Soil analysis data unavailable.' };
    }

    const req = diseaseRule.soil || {};
    let score = 0.6;
    const reasons = [];

    if (soilData.pH) {
      if (req.minpH && soilData.pH >= req.minpH && soilData.pH <= req.maxpH) {
        score += 0.2;
        reasons.push(`Soil pH (${soilData.pH}) is compatible with disease development.`);
      }
    }

    if (req.lowNitrogenRisk && soilData.nitrogen && soilData.nitrogen < 150) {
      score += 0.2;
      reasons.push(`Low nitrogen (${soilData.nitrogen} kg/ha) increases crop susceptibility.`);
    }

    return {
      score: Number(Math.min(1.0, score).toFixed(2)),
      level: score >= 0.7 ? 'High' : 'Medium',
      isAvailable: true,
      reason: reasons.join(' ') || 'Soil parameters analyzed.'
    };
  }

  evaluateWaterSupport(diseaseRule, waterData) {
    if (!waterData) {
      return { score: 0.5, level: 'Unavailable', isAvailable: false, reason: 'Water quality data unavailable.' };
    }

    const req = diseaseRule.water || {};
    let score = 0.5;

    if (waterData.ec && req.maxEC && waterData.ec > req.maxEC) {
      score += 0.3;
    }

    return {
      score: Number(Math.min(1.0, score).toFixed(2)),
      level: score >= 0.7 ? 'High' : 'Medium',
      isAvailable: true,
      reason: waterData.ec ? `Water EC is ${waterData.ec} dS/m.` : 'Water data analyzed.'
    };
  }

  evaluateIrrigationSupport(diseaseRule, irrigationData) {
    if (!irrigationData) {
      return { score: 0.5, level: 'Unavailable', isAvailable: false, reason: 'Irrigation practice data unavailable.' };
    }

    let score = 0.5;
    const method = String(irrigationData.irrigationMethod || '').toLowerCase();
    const riskType = diseaseRule.irrigation_risk;

    if (riskType === 'overhead' && (method.includes('overhead') || method.includes('sprinkler'))) {
      score += 0.35;
    } else if (method.includes('drip')) {
      score -= 0.15;
    }

    return {
      score: Number(Math.min(1.0, score).toFixed(2)),
      level: score >= 0.7 ? 'High Risk' : 'Normal',
      isAvailable: true,
      reason: `Irrigation method: ${irrigationData.irrigationMethod || 'Standard'}.`
    };
  }

  /**
   * Perform Multimodal Evidence Fusion & Differential Diagnosis with Strict Gates
   */
  fuseEvidence(visionData, weatherContext, soilData, waterData, irrigationData, cropContext = {}) {
    const visualCandidates = visionData.visual_candidates || [];
    const affectedOrgan = visionData.affected_part?.organ || 'leaf';
    const selectedCrop = String(cropContext.cropType || visionData.crop?.name || 'Wheat').trim();
    const detectedCrop = String(visionData.crop?.detectedCrop || visionData.crop?.name || selectedCrop).trim();
    const currentStage = String(cropContext.growthStage || 'vegetative').toLowerCase();

    // ── GATE 1: STAGE A PLANT EVIDENCE GATE ────────────────────────────────────
    if (visionData.quality_status === 'non_plant_or_irrelevant' || visionData.is_non_plant || visionData.plant_evidence?.status === 'INVALID') {
      return {
        plant_evidence: visionData.plant_evidence || {
          status: 'INVALID',
          plant_confidence: 0,
          leaf_confidence: 0,
          plant_area_ratio: 0.0,
          leaf_area_ratio: 0.0,
          localized: false,
          quality_status: 'POOR'
        },
        diagnosis_pipeline_executed: false,
        primaryCondition: 'Non-Plant / Irrelevant Photo',
        top_diagnosis: {
          disease: null,
          final_score: 0.0,
          explanation: 'No suitable plant/leaf evidence was detected for agricultural disease diagnosis.'
        },
        cropCompatibility: {
          isCompatible: false,
          status: 'NOT_A_PLANT',
          message: 'No suitable plant/leaf evidence was detected for agricultural disease diagnosis.'
        },
        calibrated_confidence: 0,
        uncertainty_status: 'rejected',
        uncertainty_message: 'No suitable plant/leaf evidence was detected for agricultural disease diagnosis.',
        disease_candidates: [],
        treatmentOptions: null,
        chemicalSolutions: [],
        organicSolutions: [],
        treatment: []
      };
    }

    // (Crop mismatch check disabled to trust user crop selection)

    // ── GATE 3: NUTRIENT DEFICIENCY PRIORITY ────────────────────────────────
    // If soil N < 120 kg/ha or K < 100 kg/ha, prioritize Nutrient Deficiency over pathogen
    const soilN = soilData?.nitrogen || soilData?.n;
    const soilK = soilData?.potassium || soilData?.k;

    if (soilN !== undefined && soilN < 120) {
      return {
        primaryCondition: 'Nutrient Deficiency (Nitrogen Deficiency)',
        top_diagnosis: {
          disease: 'Nitrogen Deficiency (N Deficiency)',
          final_score: 0.88,
          explanation: `Soil nitrogen level (${soilN} kg/ha) is critically below recommended crop threshold (<120 kg/ha), causing generalized foliar chlorosis and yellowing.`
        },
        cropCompatibility: { isCompatible: true, status: 'MATCHED' },
        calibrated_confidence: 88,
        uncertainty_status: 'confident',
        disease_candidates: [{ disease: 'Nitrogen Deficiency', final_confidence: 88 }]
      };
    }

    if (soilK !== undefined && soilK < 100) {
      return {
        primaryCondition: 'Nutrient Deficiency (Potassium Deficiency)',
        top_diagnosis: {
          disease: 'Potassium Deficiency (K Deficiency)',
          final_score: 0.86,
          explanation: `Soil potassium level (${soilK} kg/ha) is below required crop threshold (<100 kg/ha), leading to leaf margin scorch and chlorosis.`
        },
        cropCompatibility: { isCompatible: true, status: 'MATCHED' },
        calibrated_confidence: 86,
        uncertainty_status: 'confident',
        disease_candidates: [{ disease: 'Potassium Deficiency', final_confidence: 86 }]
      };
    }

    // ── GATE 4: WATER STRESS / DROUGHT PRIORITY ─────────────────────────────
    const soilMoisture = soilData?.soilMoisture || soilData?.moisture;
    const recentRain = weatherContext?.insights?.recent5DayRain || 0;

    if (soilMoisture !== undefined && soilMoisture < 25 && recentRain < 5) {
      return {
        primaryCondition: 'Water Stress / Drought Stress',
        top_diagnosis: {
          disease: 'Drought Stress / Soil Moisture Deficit',
          final_score: 0.85,
          explanation: `Soil moisture level (${soilMoisture}%) is severely depleted with zero recent rainfall (${recentRain}mm), causing wilting and moisture deficit stress.`
        },
        cropCompatibility: { isCompatible: true, status: 'MATCHED' },
        calibrated_confidence: 85,
        uncertainty_status: 'confident',
        disease_candidates: [{ disease: 'Drought Stress', final_confidence: 85 }]
      };
    }

    // ── GATE 5: UNKNOWN / UNCERTAIN DISEASE GATE ────────────────────────────
    const topProb = visualCandidates[0]?.probability || 0;
    if (topProb < 0.50 && visionData.uncertainty_status === 'uncertain') {
      return {
        primaryCondition: 'Unknown Abnormality',
        top_diagnosis: {
          disease: 'Plant Abnormality (Exact Cause Uncertain)',
          final_score: 0.45,
          explanation: 'Plant abnormality detected, but the exact cause cannot be reliably identified from the available evidence.'
        },
        cropCompatibility: { isCompatible: true, status: 'MATCHED' },
        calibrated_confidence: 45,
        uncertainty_status: 'uncertain',
        uncertainty_message: 'Plant abnormality detected, but the exact cause cannot be reliably identified from the available evidence.',
        disease_candidates: visualCandidates.map(c => ({ disease: c.disease, final_confidence: Math.round(c.probability * 100) }))
      };
    }

    // ── GENERAL PATHOGEN / HEALTHY FUSION ───────────────────────────────────
    const missingData = [];
    let availableSourcesCount = 2; // Image & Weather

    if (!soilData) missingData.push({ source: 'Soil Analysis', impact: 'Reduces confidence on nutrient vs disease differentiation' });
    else availableSourcesCount++;

    if (!waterData) missingData.push({ source: 'Water Quality Analysis', impact: 'Reduces salinity stress attribution' });
    else availableSourcesCount++;

    if (!irrigationData) missingData.push({ source: 'Irrigation Behavior', impact: 'Reduces overhead wetness risk evaluation' });
    else availableSourcesCount++;

    const evaluatedCandidates = visualCandidates.map(candidate => {
      const rule = diseaseKnowledgeBase.getDiseaseRule(candidate.disease);

      const visualScore = candidate.probability || 0.5;
      const weatherEval = this.evaluateWeatherSupport(rule, weatherContext);

      let stageScore = 0.5;
      if (rule.vulnerable_stages && rule.vulnerable_stages.includes(currentStage)) {
        stageScore = 1.0;
      }

      let organContradictionPenalty = 0.0;
      if (rule.organ && rule.organ !== affectedOrgan && rule.contradiction_organs?.includes(affectedOrgan)) {
        organContradictionPenalty = 0.40;
      }

      const soilEval = this.evaluateSoilSupport(rule, soilData);
      const waterEval = this.evaluateWaterSupport(rule, waterData);
      const irrigationEval = this.evaluateIrrigationSupport(rule, irrigationData);

      // Engineering Heuristic Weighting (40% visual, 20% weather, 15% stage, 10% soil, 5% water, 10% irrigation)
      const rawFusedScore =
        (visualScore * 0.40) +
        (weatherEval.score * 0.20) +
        (stageScore * 0.15) +
        (soilEval.score * 0.10) +
        (waterEval.score * 0.05) +
        (irrigationEval.score * 0.10) -
        organContradictionPenalty;

      const normalizedScore = Number(Math.max(0.05, Math.min(0.98, rawFusedScore)).toFixed(2));

      return {
        disease: candidate.disease,
        visual_score: visualScore,
        weather_score: weatherEval.score,
        soil_score: soilEval.score,
        water_score: waterEval.score,
        irrigation_score: irrigationEval.score,
        crop_context_score: stageScore,
        contradiction_penalty: organContradictionPenalty,
        final_score: normalizedScore,
        rule,
        weatherEval,
        soilEval,
        waterEval,
        irrigationEval
      };
    });

    evaluatedCandidates.sort((a, b) => b.final_score - a.final_score);

    const topDiagnosis = evaluatedCandidates[0] || {
      disease: `Healthy ${selectedCrop} Crop`,
      final_score: 0.90,
      rule: diseaseKnowledgeBase.getDiseaseRule('Healthy')
    };

    const isHealthy = topDiagnosis.disease.toLowerCase().includes('healthy');
    const primaryCond = isHealthy ? 'Healthy Plant' : 'Pathogen Disease';

    const completenessFactor = (0.60 + (0.40 * (availableSourcesCount / 5)));
    const calibratedConfidence = Math.round(topDiagnosis.final_score * 100 * completenessFactor);

    return {
      primaryCondition: primaryCond,
      cropCompatibility: { isCompatible: true, status: 'MATCHED' },
      crop: visionData.crop,
      affected_part: visionData.affected_part,
      symptoms: visionData.symptoms,
      disease_candidates: evaluatedCandidates.map(c => ({
        disease: c.disease,
        visual_score: c.visual_score,
        weather_score: c.weather_score,
        final_confidence: Math.round(c.final_score * 100)
      })),
      top_diagnosis: topDiagnosis,
      calibrated_confidence: calibratedConfidence,
      data_completeness: {
        total_sources: 5,
        available_sources: availableSourcesCount,
        missing_data: missingData
      }
    };
  }
}

module.exports = new EvidenceFusionEngine();
