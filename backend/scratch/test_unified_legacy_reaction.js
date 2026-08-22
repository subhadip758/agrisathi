const inMemoryStore = require('../src/utils/inMemoryStore');
const fs = require('fs');
const path = require('path');

function testUnifiedLegacyReaction() {
  console.log('================================================================');
  console.log('🧪 TESTING UNIFIED LEGACY COMMUNITY REACTION PERSISTENCE');
  console.log('================================================================\n');

  const userId = '650000000000000000000001';
  const postId = '6a88523f4992ebf33c5f8d80';

  console.log('1. Setting reaction to LIKE for default user ID:', userId);
  inMemoryStore.setPostReaction(userId, postId, 'like');
  let rx = inMemoryStore.getPostReaction(userId, postId);
  console.log('   Stored reaction:', rx);

  console.log('\n2. Simulating server restart (re-instantiating inMemoryStore)...');
  delete require.cache[require.resolve('../src/utils/inMemoryStore')];
  const freshStore = require('../src/utils/inMemoryStore');

  const restored = freshStore.getPostReaction(userId, postId);
  console.log('   Restored reaction after restart:', restored);

  const allUserRx = freshStore.getReactionsForUser(userId);
  console.log('   All user reactions for default user:', allUserRx);

  if (restored === 'like' && allUserRx[postId] === 'like') {
    console.log('\n✅ SUCCESS: Unified reaction persistence verified across restarts!');
  } else {
    console.error('\n❌ FAIL: Reaction lookup failed!');
  }

  // Cleanup
  freshStore.setPostReaction(userId, postId, null);
}

testUnifiedLegacyReaction();
