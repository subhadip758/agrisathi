const fs = require('fs');
const path = require('path');

const COMMUNITY_STORE_FILE = path.join(__dirname, '../data/communityStore.json');
const REACTIONS_STORE_FILE = path.join(__dirname, '../data/reactionsStore.json');

console.log('--- COMMUNITY STORE FILE ---');
if (fs.existsSync(COMMUNITY_STORE_FILE)) {
  const posts = JSON.parse(fs.readFileSync(COMMUNITY_STORE_FILE, 'utf8'));
  console.log('Total posts:', posts.length);
  posts.slice(0, 5).forEach(p => {
    console.log(`Post ID: ${p._id} | Title: "${p.title || p.content.slice(0, 20)}" | Likes: ${p.likesCount} | Dislikes: ${p.dislikesCount}`);
  });
} else {
  console.log('communityStore.json does not exist');
}

console.log('\n--- REACTIONS STORE FILE ---');
if (fs.existsSync(REACTIONS_STORE_FILE)) {
  const rx = JSON.parse(fs.readFileSync(REACTIONS_STORE_FILE, 'utf8'));
  console.log('Total reactions stored:', Object.keys(rx).length);
  console.log(JSON.stringify(rx, null, 2));
} else {
  console.log('reactionsStore.json does not exist');
}
