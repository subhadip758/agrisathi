const inMemoryStore = require('../src/utils/inMemoryStore');
const fs = require('fs');
const path = require('path');

function testReactionPersistence() {
  console.log('================================================================');
  console.log('🧪 TESTING COMMUNITY POST REACTION DISK PERSISTENCE');
  console.log('================================================================\n');

  const testUserId = 'test_user_999';
  const testPostId = 'test_post_888';

  console.log('1. Initial reaction check (should be null):');
  let reaction = inMemoryStore.getPostReaction(testUserId, testPostId);
  console.log('  Initial reaction:', reaction);

  console.log('\n2. Setting reaction to LIKE...');
  inMemoryStore.setPostReaction(testUserId, testPostId, 'like');
  reaction = inMemoryStore.getPostReaction(testUserId, testPostId);
  console.log('  Updated reaction:', reaction);

  console.log('\n3. Verifying reactionsStore.json on disk...');
  const reactionsFile = path.join(__dirname, '../data/reactionsStore.json');
  console.log('  File exists:', fs.existsSync(reactionsFile));
  if (fs.existsSync(reactionsFile)) {
    console.log('  Content:', fs.readFileSync(reactionsFile, 'utf8'));
  }

  console.log('\n4. Simulating Server Restart (re-loading inMemoryStore)...');
  // Re-load Reactions
  delete require.cache[require.resolve('../src/utils/inMemoryStore')];
  const freshStore = require('../src/utils/inMemoryStore');
  const restoredReaction = freshStore.getPostReaction(testUserId, testPostId);
  console.log('  Restored reaction after restart:', restoredReaction);

  if (restoredReaction === 'like') {
    console.log('\n✅ SUCCESS: Post reaction persisted across server restart!');
  } else {
    console.error('\n❌ FAIL: Reaction not persisted!');
  }

  // Cleanup test entry
  freshStore.setPostReaction(testUserId, testPostId, null);
}

testReactionPersistence();
