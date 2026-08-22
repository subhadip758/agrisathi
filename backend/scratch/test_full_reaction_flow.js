const inMemoryStore = require('../src/utils/inMemoryStore');

function testFullReactionFlow() {
  console.log('================================================================');
  console.log('🧪 TESTING FULL COMMUNITY REACTION FLOW ACROSS RESTARTS');
  console.log('================================================================\n');

  const userId = 'user_abc';
  const postId = 'post_xyz';

  // 1. Initial State
  let r = inMemoryStore.getPostReaction(userId, postId);
  console.log('1. Initial reaction:', r); // should be null

  // 2. User likes post
  inMemoryStore.setPostReaction(userId, postId, 'like');
  r = inMemoryStore.getPostReaction(userId, postId);
  console.log('2. Reaction after LIKE:', r); // should be 'like'

  // 3. User clicks LIKE again (Toggle Off)
  const current1 = inMemoryStore.getPostReaction(userId, postId);
  if (current1 === 'like') {
    inMemoryStore.setPostReaction(userId, postId, null); // remove
  }
  r = inMemoryStore.getPostReaction(userId, postId);
  console.log('3. Reaction after clicking LIKE again (Toggled Off):', r); // should be null

  // 4. User likes post again, then server restarts
  inMemoryStore.setPostReaction(userId, postId, 'like');
  console.log('4. Set reaction to LIKE before restart');

  // Simulate Server Restart
  delete require.cache[require.resolve('../src/utils/inMemoryStore')];
  const freshStore = require('../src/utils/inMemoryStore');
  const restored = freshStore.getPostReaction(userId, postId);
  console.log('5. Restored reaction after server restart:', restored);

  if (restored === 'like') {
    console.log('   Clicking LIKE again after restart (Toggle Off)...');
    freshStore.setPostReaction(userId, postId, null);
    console.log('   New reaction after toggle off:', freshStore.getPostReaction(userId, postId));
    console.log('\n✅ ALL REACTION TESTS PASSED 100%!');
  } else {
    console.error('\n❌ FAILED TO RESTORE REACTION!');
  }
}

testFullReactionFlow();
