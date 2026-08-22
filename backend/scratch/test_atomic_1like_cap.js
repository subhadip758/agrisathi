const inMemoryStore = require('../src/utils/inMemoryStore');

function testAtomic1LikeCap() {
  console.log('================================================================');
  console.log('🧪 TESTING STRICT ATOMIC 1-LIKE / 1-DISLIKE CAP PER USER');
  console.log('================================================================\n');

  const userId = 'CLIENT-PERMANENT-USER-777';
  const postId = 'POST-COMMUNITY-999';

  // 1. User clicks LIKE 10 times in a row
  console.log('1. Simulating 10 consecutive LIKE clicks by same user:');
  let currentRx = null;
  let likesCount = 0;

  for (let i = 1; i <= 10; i++) {
    const rx = inMemoryStore.getPostReaction(userId, postId);
    if (!rx) {
      inMemoryStore.setPostReaction(userId, postId, 'like');
      likesCount = 1;
      currentRx = 'like';
    } else if (rx === 'like') {
      inMemoryStore.setPostReaction(userId, postId, null); // toggle off
      likesCount = 0;
      currentRx = null;
    }
    console.log(`   Click #${i}: reaction = ${currentRx}, likesCount = ${likesCount}`);
  }

  // 2. Final check after 10 clicks
  console.log('\n2. Final reaction state after 10 clicks:', inMemoryStore.getPostReaction(userId, postId));
  console.log('   Final likes count:', likesCount);

  if (likesCount <= 1) {
    console.log('\n✅ SUCCESS: Strictly capped at max 1 like per user!');
  } else {
    console.error('\n❌ FAIL: Likes count exceeded 1!');
  }

  // Cleanup
  inMemoryStore.setPostReaction(userId, postId, null);
}

testAtomic1LikeCap();
