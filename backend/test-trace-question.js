const chatbotService = require('./src/services/chatbotService');

async function runTraceReport() {
  console.log('================================================================');
  console.log('🤖 CODE-LEVEL TRACE REPORT FOR USER QUERY:');
  console.log('"আমার soil condition, আগামী ৭ দিনের weather, irrigation status এবং আমার crop stage একসাথে analyse করে বলো আগামী কয়েকদিনে আমার কী কী করা উচিত এবং কী কী risk আছে?"');
  console.log('================================================================\n');

  const userQuery = "আমার soil condition, আগামী ৭ দিনের weather, irrigation status এবং আমার crop stage একসাথে analyse করে বলো আগামী কয়েকদিনে আমার কী কী করা উচিত এবং কী কী risk আছে?";
  const userId = '650000000000000000000001';
  const context = { language: 'bn', cropType: 'Rice' };

  console.log('STEP 1: CALLING AUTONOMOUS AI AGENT (GEMINI TOOL-CALLING LOOP)');
  const start = Date.now();
  const res = await chatbotService.processMessage(userId, userQuery, 'TRACE-SESSION-1', context);

  console.log(`- Total Agent Loop Time: ${Date.now() - start} ms`);
  console.log(`- Tools Dynamically Requested by Gemini:`, JSON.stringify(res.data.executedTools));

  console.log('\n================================================================');
  console.log('FINAL AI AGENT RESPONSE OUTPUT:');
  console.log('================================================================');
  console.log(res.data.message);
  console.log('\n================================================================');
}

runTraceReport();
