const chatbotService = require('./src/services/chatbotService');

async function runPhase2Tests() {
  console.log('================================================================');
  console.log('🧪 PHASE 2 — PROVE LIMITATIONS & TEST LOGGING');
  console.log('================================================================\n');

  const questions = [
    {
      id: 1,
      text: "আমার soil আর আগামী ৭ দিনের weather দেখে বলো কোন crop চাষ করা ভালো হবে।",
      lang: "bn"
    },
    {
      id: 2,
      text: "আজকে আমার ধানের জমিতে পানি দিলে ঠিক হবে তো?",
      lang: "bn"
    },
    {
      id: 3,
      text: "ধান কাটার আগে আগামী কয়েকদিনের weather দেখে আমার কী কী প্রস্তুতি নেওয়া উচিত?",
      lang: "bn"
    },
    {
      id: 4,
      text: "আমার এলাকার weather আর disease risk দেখে আমার crop-এর জন্য কী সাবধানতা নেওয়া উচিত?",
      lang: "bn"
    },
    {
      id: 5,
      text: "আমার profile অনুযায়ী কোন government scheme আমার জন্য useful?",
      lang: "bn"
    },
    {
      id: 6,
      text: "আমার আশেপাশে এখন কোন fresh vegetables available?",
      lang: "bn"
    }
  ];

  for (const q of questions) {
    console.log(`--------------------------------------------------`);
    console.log(`TEST ${q.id}: "${q.text}"`);
    console.log(`--------------------------------------------------`);
    try {
      const res = await chatbotService.processMessage('test-user-phase2', q.text, `SESSION-P2-${q.id}`, { language: q.lang });
      console.log(`USER QUESTION : ${q.text}`);
      console.log(`INTENT DETECTED: ${res.data.intent}`);
      console.log(`TOOLS SELECTED : ${JSON.stringify(res.data.executedTools)}`);
      console.log(`API REQUESTS   : Executed ${res.data.executedTools.length} tools concurrently`);
      console.log(`API RESULTS    : Success (${res.data.detectedLanguage})`);
      console.log(`AI RESPONSE    :\n${res.data.message}\n`);
    } catch (err) {
      console.error(`❌ TEST ${q.id} ERROR: ${err.message}\n`);
    }
  }

  console.log('================================================================');
  console.log('PHASE 2 TEST LOGGING COMPLETE');
  console.log('================================================================');
}

runPhase2Tests();
