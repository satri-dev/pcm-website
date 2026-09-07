// Quick script to test the admission API endpoint
async function testApi() {
  try {
    console.log('🔍 Testing /api/admin/pages/admission endpoint...\n');
    
    const response = await fetch('http://localhost:3000/api/admin/pages/admission');
    
    if (!response.ok) {
      console.error('❌ API returned error:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.error('❌ Unexpected response format');
      console.log(data);
      return;
    }
    
    const fields = data.data.content?.applicationForm?.personalInfoFields || [];
    
    console.log('✅ API Response received');
    console.log(`📋 Found ${fields.length} personal info fields\n`);
    
    console.log('Guardian-related fields:');
    console.log('========================');
    
    const guardianFields = fields.filter(f => 
      f.id.includes('guardian') || f.id.includes('father') || f.id.includes('mother')
    );
    
    if (guardianFields.length === 0) {
      console.log('⚠️  No guardian fields found in API response!');
      console.log('\nAll fields:');
      fields.forEach((f, i) => {
        console.log(`  ${i + 1}. ${f.label} (${f.id})`);
      });
    } else {
      guardianFields
        .sort((a, b) => a.order - b.order)
        .forEach(f => {
          console.log(`  ✓ ${f.order}. ${f.label} (${f.id})`);
        });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure your dev server is running on http://localhost:3000');
  }
}

testApi();
