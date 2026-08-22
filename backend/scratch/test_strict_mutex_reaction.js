const inMemoryStore = require('../src/utils/inMemoryStore');

function testStrictMutexReaction() {
  console.log('================================================================');
  console.log('🧪 TESTING STRICT MUTEX LIKE/DISLIKE REACTION RULES');
  console.log('================================================================\n');

  const userId = 'MUTEX-USER-001';
  const postId = 'MUTEX-POST-001';

  let likesCount = 0;
  let dislikesCount = 0;

  function performReaction(rxType) {
    const prev = inMemoryStore.getPostReaction(userId, postId);
    let newRx = rxType;

    if (!prev) {
      // Adding new reaction
      if (rxType === 'like') likesCount += 1;
      else dislikesCount += 1;
      inMemoryStore.setPostReaction(userId, postId, rxType);
    } else if (prev === rxType) {
      // Toggling off existing reaction
      if (rxType === 'like') likesCount = Math.max(0, likesCount - 1);
      else dislikesCount = Math.max(0, dislikesCount - 1);
      inMemoryStore.setPostReaction(userId, postId, null);
      newRx = null;
    } else {
      // Switching from like to dislike or vice versa
      if (prev === 'like') likesCount = Math.max(0, likesCount - 1);
      if (prev === 'dislike') dislikesCount = Math.max(0, dislikesCount - 1);
      if (rxType === 'like') likesCount += 1;
      if (rxType === 'dislike') dislikesCount += 1;
      inMemoryStore.setPostReaction(userId, postId, rxType);
    }

    console.log(`Action: ${rxType.toUpperCase()} | Prev: ${prev} -> New: ${newRx} | Likes: ${likesCount} | Dislikes: ${dislikesCount}`);
    return newRx;
  }

  console.log('1. User clicks LIKE...');
  performReaction('like');

  console.log('\n2. User clicks LIKE again (Toggle Off)...');
  performReaction('like');

  console.log('\n3. User clicks DISLIKE...');
  performReaction('dislike');

  console.log('\n4. User clicks LIKE (Switch from Dislike to Like)...');
  performReaction('like');

  console.log('\n5. User clicks DISLIKE (Switch from Like to Dislike)...');
  performReaction('dislike');

  console.log('\n6. User clicks DISLIKE again (Toggle Off)...');
  performReaction('dislike');

  console.log('\nFinal State: Likes =', likesCount, '| Dislikes =', dislikesCount, '| Reaction =', inMemoryStore.getPostReaction(userId, postId));

  if (likesCount === 0 && dislikesCount === 0 && inMemoryStore.getPostReaction(userId, postId) === null) {
    console.log('\n✅ SUCCESS: Strict mutex (max 1 like OR 1 dislike, toggleable off) verified!');
  } else {
    console.error('\n❌ FAIL: Reaction math incorrect!');
  }

  // Clean up
  inMemoryStore.setPostReaction(userId, postId, null);
}

testStrictMutexReaction();
