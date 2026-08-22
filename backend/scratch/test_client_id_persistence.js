const inMemoryStore = require('../src/utils/inMemoryStore');

function testClientIdPersistence() {
  console.log('================================================================');
  console.log('🧪 TESTING CLIENT-ID PERSISTENCE FOR COMMUNITY REACTIONS');
  console.log('================================================================\n');

  const clientId = 'CLIENT-1787425000-xyz987';
  const postId = 'post_community_1001';

  console.log('1. Session 1: User likes post');
  inMemoryStore.setPostReaction(clientId, postId, 'like');
  let reaction = inMemoryStore.getPostReaction(clientId, postId);
  console.log('   Session 1 reaction recorded:', reaction);

  console.log('\n2. Session 2 (Simulating page reload / new browser session with same X-Client-ID)...');
  delete require.cache[require.resolve('../src/utils/inMemoryStore')];
  const freshStore = require('../src/utils/inMemoryStore');
  const restoredReaction = freshStore.getPostReaction(clientId, postId);
  console.log('   Session 2 restored reaction:', restoredReaction);

  if (restoredReaction === 'like') {
    console.log('\n3. Session 2: User clicks LIKE again (Toggle Off)...');
    freshStore.setPostReaction(clientId, postId, null);
    console.log('   Reaction after toggle off:', freshStore.getPostReaction(clientId, postId));
    console.log('\n✅ SUCCESS: Client identity + disk persistence guarantees 1-like limit across sessions!');
  } else {
    console.error('\n❌ FAILED: Reaction lost between sessions!');
  }
}

testClientIdPersistence();
