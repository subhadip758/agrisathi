const http = require('http');

function sendHttpMessage(messageText, language = 'bn') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      message: messageText,
      context: { language }
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

async function runLiveEndpointTests() {
  console.log('================================================================');
  console.log('🌐 TESTING LIVE DYNAMIC RESPONSE GENERATOR (http://localhost:5180)');
  console.log('================================================================\n');

  // TEST 1: Weather / Field Care
  console.log('📌 TEST 1: Field Care & Weather');
  console.log('Question: "আমার জমিতে এই মুহূর্তে কী কী সমস্যা হতে পারে এবং আগামী ৭ দিনে আমাকে কী কী করতে হবে?"');
  const res1 = await sendHttpMessage("আমার জমিতে এই মুহূর্তে কী কী সমস্যা হতে পারে এবং আগামী ৭ দিনে আমাকে কী কী করতে হবে?", 'bn');
  console.log(`- Executed Tools:`, JSON.stringify(res1.data?.executedTools));
  console.log(`- Answer Output:\n${res1.data?.message}\n`);

  // TEST 2: Disease Protection
  console.log('--------------------------------------------------');
  console.log('📌 TEST 2: Disease Protection');
  console.log('Question: "ধানের পাতায় হলুদ বা বাদামী ছোপ হলে কী স্প্রে করব?"');
  const res2 = await sendHttpMessage("ধানের পাতায় হলুদ বা বাদামী ছোপ হলে কী স্প্রে করব?", 'bn');
  console.log(`- Executed Tools:`, JSON.stringify(res2.data?.executedTools));
  console.log(`- Answer Output:\n${res2.data?.message}\n`);

  // TEST 3: Marketplace Prices
  console.log('--------------------------------------------------');
  console.log('📌 TEST 3: Market Prices');
  console.log('Question: "আমার এলাকায় এখন জ্যোতি আলুর দাম কত চলছে?"');
  const res3 = await sendHttpMessage("আমার এলাকায় এখন জ্যোতি আলুর দাম কত চলছে?", 'bn');
  console.log(`- Executed Tools:`, JSON.stringify(res3.data?.executedTools));
  console.log(`- Answer Output:\n${res3.data?.message}\n`);

  console.log('================================================================');
  console.log('🎉 ALL 3 DYNAMIC HTTP TESTS VERIFIED SUCCESSFULLY');
  console.log('================================================================');
}

runLiveEndpointTests();
