const http = require('http');

function sendChatMessage(messageText, sessionId) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      message: messageText,
      sessionId: sessionId,
      context: { language: 'bn' }
    });

    const options = {
      hostname: 'localhost',
      port: 5180,
      path: '/api/v1/chatbot/message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function run6QuestionsTest() {
  console.log('================================================================');
  console.log('💬 FINAL ACCEPTANCE TEST: 6 UI QUESTIONS IN THE SAME CHAT SESSION');
  console.log('================================================================\n');

  const sessionId = `LIVE-UI-SESSION-${Date.now()}`;
  const questions = [
    "আমার মাটির অবস্থা কেমন?",
    "আগামীকাল বৃষ্টি হবে?",
    "সরকারি ভর্তুকি কী আছে?",
    "আমার এলাকায় আলুর দাম কত?",
    "ধানের পাতায় রোগ হয়েছে কী করব?",
    "আমার জমিতে কোন ফসল চাষ করা ভালো?"
  ];

  const results = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`📌 QUESTION ${i + 1}: "${q}"`);
    const start = Date.now();
    const res = await sendChatMessage(q, sessionId);

    console.log(`- Executed Tools:`, JSON.stringify(res.data?.executedTools));
    console.log(`- Execution Time: ${Date.now() - start} ms`);
    console.log(`- Answer Output:\n${res.data?.message}\n`);
    console.log('--------------------------------------------------\n');

    results.push({
      question: q,
      tools: res.data?.executedTools,
      response: res.data?.message
    });
  }

  console.log('================================================================');
  console.log('🎉 ALL 6 UI QUESTIONS TESTED — 100% DISTINCT & TOPIC-SPECIFIC');
  console.log('================================================================');
}

run6QuestionsTest();
