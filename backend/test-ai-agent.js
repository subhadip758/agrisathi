const chatbotService = require('./src/services/chatbotService');
const chatbotTools = require('./src/services/chatbotTools');

async function runAgriSathiAgentTestSuite() {
  console.log('================================================================');
  console.log('🧪 AGRISATHI AI FULL SEARCH & REASONING AGENT — E2E TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(` ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // -----------------------------------------------------------------------------
  // UNSEEN QUESTION 1: Soil + 7-Day Weather + Crop Recommendation
  // -----------------------------------------------------------------------------
  console.log('--------------------------------------------------');
  console.log('UNSEEN TEST 1: Soil + 7-Day Weather + Crop Recommendation');
  console.log('Question: "আমার soil আর আগামী ৭ দিনের weather দেখে বলো কোন crop আমার জন্য সবচেয়ে ভালো হতে পারে।"');
  console.log('--------------------------------------------------');

  try {
    const res1 = await chatbotService.processMessage('test-user-1', 'আমার soil আর আগামী ৭ দিনের weather দেখে বলো কোন crop আমার জন্য সবচেয়ে ভালো হতে পারে।', 'UNSEEN-1', { language: 'bn' });
    assert(res1.success === true, 'Response status is success');
    assert(res1.data.executedTools.includes('getSoilAnalysis'), 'Executed getSoilAnalysis tool');
    assert(res1.data.executedTools.includes('getWeatherForecast'), 'Executed getWeatherForecast tool');
    assert(res1.data.executedTools.includes('getCropRecommendation'), 'Executed getCropRecommendation tool');
    assert(/[\u0980-\u09FF]/.test(res1.data.message), 'Responded in natural Bengali');
    console.log(`📄 Response snippet:\n${res1.data.message.slice(0, 200)}...\n`);
  } catch (err) {
    assert(false, `Unseen Test 1 threw error: ${err.message}`);
  }

  // -----------------------------------------------------------------------------
  // UNSEEN QUESTION 2: Weather + Disease Alert Combination
  // -----------------------------------------------------------------------------
  console.log('--------------------------------------------------');
  console.log('UNSEEN TEST 2: Weather + Disease Outbreak Precaution');
  console.log('Question: "আমার এলাকায় আগামী কয়েকদিনের weather আর disease alert দেখে কী কী সাবধানতা নেওয়া উচিত?"');
  console.log('--------------------------------------------------');

  try {
    const res2 = await chatbotService.processMessage('test-user-1', 'আমার এলাকায় আগামী কয়েকদিনের weather আর disease alert দেখে কী কী সাবধানতা নেওয়া উচিত?', 'UNSEEN-2', { language: 'bn' });
    assert(res2.success === true, 'Response status is success');
    assert(res2.data.executedTools.includes('getWeatherForecast'), 'Executed getWeatherForecast tool');
    assert(res2.data.executedTools.includes('getDiseaseAlerts'), 'Executed getDiseaseAlerts tool');
    assert(/[\u0980-\u09FF]/.test(res2.data.message), 'Responded in natural Bengali');
    console.log(`📄 Response snippet:\n${res2.data.message.slice(0, 200)}...\n`);
  } catch (err) {
    assert(false, `Unseen Test 2 threw error: ${err.message}`);
  }

  // -----------------------------------------------------------------------------
  // UNSEEN QUESTION 3: Farmer Profile + Scheme Eligibility Assessment
  // -----------------------------------------------------------------------------
  console.log('--------------------------------------------------');
  console.log('UNSEEN TEST 3: Farmer Profile + Scheme Eligibility Assessment');
  console.log('Question: "আমার profile আর location অনুযায়ী কোন government scheme আমার জন্য relevant?"');
  console.log('--------------------------------------------------');

  try {
    const res3 = await chatbotService.processMessage('test-user-1', 'আমার profile আর location অনুযায়ী কোন government scheme আমার জন্য relevant?', 'UNSEEN-3', { language: 'bn' });
    assert(res3.success === true, 'Response status is success');
    assert(res3.data.executedTools.includes('getFarmerProfile'), 'Executed getFarmerProfile tool');
    assert(res3.data.executedTools.includes('getGovernmentSchemes'), 'Executed getGovernmentSchemes tool');
    assert(res3.data.executedTools.includes('checkSchemeEligibility'), 'Executed checkSchemeEligibility tool');
    assert(res3.data.message.includes('https://') || res3.data.message.includes('gov.in'), 'Includes official portal URLs');
    console.log(`📄 Response snippet:\n${res3.data.message.slice(0, 200)}...\n`);
  } catch (err) {
    assert(false, `Unseen Test 3 threw error: ${err.message}`);
  }

  // -----------------------------------------------------------------------------
  // UNSEEN QUESTION 4: External Web Search / Public Figure Query
  // -----------------------------------------------------------------------------
  console.log('--------------------------------------------------');
  console.log('UNSEEN TEST 4: External Live Public Figure Query');
  console.log('Question: "Who is the current agriculture minister of India?"');
  console.log('--------------------------------------------------');

  try {
    const res4 = await chatbotService.processMessage('test-user-1', 'Who is the current agriculture minister of India?', 'UNSEEN-4', { language: 'en' });
    assert(res4.success === true, 'Response status is success');
    assert(res4.data.executedTools.includes('webSearch'), 'Executed webSearch tool for external query');
    assert(res4.data.message.includes('Chouhan') || res4.data.message.includes('Minister') || res4.data.message.includes('Agriculture'), 'Answered external minister query accurately');
    console.log(`📄 Response snippet:\n${res4.data.message.slice(0, 200)}...\n`);
  } catch (err) {
    assert(false, `Unseen Test 4 threw error: ${err.message}`);
  }

  // -----------------------------------------------------------------------------
  // UNSEEN QUESTION 5: General QA / Universal Knowledge Query
  // -----------------------------------------------------------------------------
  console.log('--------------------------------------------------');
  console.log('UNSEEN TEST 5: General QA / Universal Knowledge Query');
  console.log('Question: "What is photosynthesis?"');
  console.log('--------------------------------------------------');

  try {
    const res5 = await chatbotService.processMessage('test-user-1', 'What is photosynthesis?', 'UNSEEN-5', { language: 'en' });
    assert(res5.success === true, 'Response status is success');
    assert(!res5.data.message.includes('I can only answer'), 'Did NOT refuse valid question');
    assert(res5.data.message.toLowerCase().includes('light') || res5.data.message.toLowerCase().includes('glucose') || res5.data.message.toLowerCase().includes('plant'), 'Answered general science question naturally');
    console.log(`📄 Response snippet:\n${res5.data.message.slice(0, 200)}...\n`);
  } catch (err) {
    assert(false, `Unseen Test 5 threw error: ${err.message}`);
  }

  console.log('================================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} TOTAL TESTS`);
  console.log('================================================================');

  process.exit(failed === 0 ? 0 : 1);
}

runAgriSathiAgentTestSuite();
