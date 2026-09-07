// Script to revalidate admission page cache
const { revalidateTag } = require('next/cache');

// Since we're running server-side, we can directly call revalidateTag
async function revalidate() {
  try {
    // Import the cache tags
    const { CACHE_TAGS } = require('../src/lib/cache-tags');
    
    console.log('🔄 Revalidating admission page cache...');
    
    // Revalidate the admission page content tag
    revalidateTag(CACHE_TAGS.pageContent('admission'));
    
    console.log('✅ Cache revalidated successfully');
    console.log('   You may need to refresh your browser');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

revalidate();
