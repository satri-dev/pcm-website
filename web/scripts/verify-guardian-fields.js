// Script to verify guardian fields in admission page
const { MongoClient } = require('mongodb');

async function verifyGuardianFields() {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('page_content');

    const admissionPage = await collection.findOne({ slug: 'admission' });

    if (!admissionPage) {
      console.log('❌ Admission page not found');
      return;
    }

    const fields = admissionPage.content?.applicationForm?.personalInfoFields || [];
    
    console.log('\n📋 Current Personal Info Fields:');
    console.log('================================');
    
    fields
      .sort((a, b) => a.order - b.order)
      .forEach(field => {
        const guardianMark = field.id.includes('guardian') || 
                            field.id.includes('father') || 
                            field.id.includes('mother') ? '🔹' : '  ';
        console.log(`${guardianMark} ${field.order}. ${field.label} (${field.id})`);
      });
    
    const guardianFields = fields.filter(f => 
      f.id.includes('guardian') || f.id.includes('father') || f.id.includes('mother')
    );
    
    console.log('\n✅ Guardian-related fields:', guardianFields.length);
    console.log('   Total fields:', fields.length);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

verifyGuardianFields();
