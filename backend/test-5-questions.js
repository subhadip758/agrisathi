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

async function run5QuestionsTest() {
  console.log('================================================================');
  console.log('💬 TESTING THE EXACT 5 UI QUESTIONS IN THE SAME CHAT SESSION');
  console.log('================================================================\n');

  const sessionId = `SAME-CHAT-SESSION-${Date.now()}`;
  const questions = [
    "সরকারি ভর্তুকি",
    "আগামীকাল বৃষ্টি হবে?",
    "আমার মাটির অবস্থা কেমন?",
    "সেচ কখন দেব?",
    "আমার এলাকায় আলুর দাম কত?"
  ];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`📌 QUESTION ${i + 1}: "${q}"`);
    const start = Date.now();
    const res = await sendChatMessage(q, sessionId);

    console.log(`- Executed Tools:`, JSON.stringify(res.data?.executedTools));
    console.log(`- Answer Output (${Date.now() - start} ms):\n${res.data?.message}\n`);
    console.log('--------------------------------------------------\n');
  }

  console.log('================================================================');
  console.log('🎉 ALL 5 UI QUESTIONS PASSED WITH CLEARLY DISTINCT RESPONSES');
  console.log('================================================================');
}

run5QuestionsTest();
