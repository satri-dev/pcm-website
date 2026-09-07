// Script to add guardian fields to admission page content in MongoDB
const { MongoClient } = require('mongodb');

const guardianFields = [
  {
    id: "guardian_type",
    label: "Guardian Type",
    fieldType: "dropdown",
    required: true,
    options: [
      { value: "father", label: "Father" },
      { value: "mother", label: "Mother" },
      { value: "other", label: "Other" },
    ],
    order: 9,
  },
  {
    id: "father_name",
    label: "Father's Name",
    fieldType: "text",
    placeholder: "Enter father's name",
    required: false,
    order: 10,
  },
  {
    id: "father_phone",
    label: "Father's Phone Number",
    fieldType: "phone",
    placeholder: "e.g. 98XXXXXXXX",
    required: false,
    order: 11,
  },
  {
    id: "mother_name",
    label: "Mother's Name",
    fieldType: "text",
    placeholder: "Enter mother's name",
    required: false,
    order: 12,
  },
  {
    id: "mother_phone",
    label: "Mother's Phone Number",
    fieldType: "phone",
    placeholder: "e.g. 98XXXXXXXX",
    required: false,
    order: 13,
  },
  {
    id: "guardian_name",
    label: "Guardian Name",
    fieldType: "text",
    placeholder: "Enter guardian's name",
    required: false,
    order: 14,
  },
  {
    id: "guardian_phone",
    label: "Guardian Phone Number",
    fieldType: "phone",
    placeholder: "e.g. 98XXXXXXXX",
    required: false,
    order: 15,
  },
  {
    id: "guardian_relationship",
    label: "Relationship with Guardian",
    fieldType: "text",
    placeholder: "e.g. Uncle, Aunt, Brother",
    required: false,
    order: 16,
  },
];

async function updateAdmissionPage() {
  // Read MongoDB URI from .env
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('page_content');

    // Find the admission page
    const admissionPage = await collection.findOne({ slug: 'admission' });

    if (!admissionPage) {
      console.log('❌ Admission page not found in database');
      return;
    }

    console.log('📄 Found admission page');

    // Get current personalInfoFields
    const currentFields = admissionPage.content?.applicationForm?.personalInfoFields || [];
    
    // Check if guardian fields already exist
    const hasGuardianFields = currentFields.some(f => f.id === 'guardian_type');
    
    if (hasGuardianFields) {
      console.log('⚠️  Guardian fields already exist, skipping...');
      return;
    }

    // Add guardian fields after email (order 8)
    const updatedFields = [
      ...currentFields,
      ...guardianFields
    ];

    // Update the document
    const result = await collection.updateOne(
      { slug: 'admission' },
      {
        $set: {
          'content.applicationForm.personalInfoFields': updatedFields,
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Successfully added guardian fields to admission page');
      console.log(`   Added ${guardianFields.length} new fields`);
    } else {
      console.log('⚠️  No changes made');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateAdmissionPage();
