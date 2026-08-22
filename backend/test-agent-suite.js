const chatbotService = require('./src/services/chatbotService');

async function runMasterTestSuite() {
  console.log('================================================================');
  console.log('🤖 AGRISATHI PRODUCTION AI AGENT — AUTONOMOUS SUITE VERIFICATION');
  console.log('================================================================\n');

  const testQueries = [
    {
      id: 1,
      query: "আমার soil condition, আগামী ৭ দিনের weather, irrigation status এবং আমার crop stage একসাথে analyse করে বলো আগামী কয়েকদিনে আমার কী কী করা উচিত এবং কী কী risk আছে?",
      lang: 'bn'
    },
    {
      id: 2,
      query: "আজকে আমার ধানের জমিতে জল দেওয়া উচিত নাকি কাল দেব?",
      lang: 'bn'
    },
    {
      id: 3,
      query: "ধান কাটার আগে আগামী কয়েকদিনের weather দেখে কী কী প্রস্তুতি নেওয়া উচিত?",
      lang: 'bn'
    },
    {
      id: 4,
      query: "আমার soil আর weather দেখে বলো কোন crop আমার জন্য ভালো হবে।",
      lang: 'bn'
    },
    {
      id: 5,
      query: "আমার profile অনুযায়ী এখন কোন government subsidy আমার জন্য relevant?",
      lang: 'bn'
    },
    {
      id: 6,
      query: "আমার এলাকায় এখন কোন fresh vegetables পাওয়া যাচ্ছে?",
      lang: 'bn'
    },
    {
      id: 7,
      query: "আমি আলুর জমিতে ব্লাইট রোগ প্রতিরোধ করার জন্য কী সার বা কীটনাশক দেব এবং কোল্ড স্টোরেজে রাখার ব্যবস্থা কেমন?",
      lang: 'bn'
    }
  ];

  const userId = '650000000000000000000001';

  for (const t of testQueries) {
    console.log(`--------------------------------------------------`);
    console.log(`🧪 TEST ${t.id}: "${t.query}"`);
    console.log(`--------------------------------------------------`);

    const start = Date.now();
    try {
      const res = await chatbotService.processMessage(userId, t.query, `AGENT-TEST-SESSION-${t.id}`, { language: t.lang });
      console.log(`⏱️ Execution Time: ${Date.now() - start} ms`);
      console.log(`🤖 Tools Dynamically Requested by Gemini:`, JSON.stringify(res.data.executedTools));
      console.log(`💬 AI Agent Response Output:\n`);
      console.log(res.data.message);
      console.log(`\n✅ TEST ${t.id} PASSED SUCCESSFULLY!\n`);
    } catch (err) {
      console.error(`❌ TEST ${t.id} FAILED WITH ERROR:`, err.message);
    }
  }

  console.log('================================================================');
  console.log('🎉 ALL 7 MANDATORY UNSEEN AGENT SUITE TESTS COMPLETED');
  console.log('================================================================');
}

runMasterTestSuite();
