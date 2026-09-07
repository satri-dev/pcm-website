import { getPageContent } from "@/lib/data/page-content";
import AdmissionPageEditor from "./_components/admission-page-editor";
import type { AdmissionPageContent } from "@/types/page-content";

export const metadata = {
  title: "Admission Page Editor | PCM Admin",
};

// Default content structure
const DEFAULT_ADMISSION_CONTENT: AdmissionPageContent = {
  hero: {
    title: "Admission Information",
    subtitle: "Applying to PCM is quick and simple — online or in person. Here's everything you need for the 2083 intake.",
    breadcrumbText: "Admission",
  },
  admissionProcess: {
    eyebrow: "How it works",
    heading: "The admission process",
    steps: [
      {
        number: "1",
        title: "Submit your application",
        description: "Apply online in minutes, or download the prospectus and drop your form at the admissions office in Nadipur.",
      },
      {
        number: "2",
        title: "Prepare your documents",
        description: "Gather your certificates, transcripts and photographs from the checklist below and keep the originals ready for verification.",
      },
      {
        number: "3",
        title: "Sit the entrance exam",
        description: "Appear for the Pokhara University entrance examination on the scheduled date. Bring your admit card and a valid ID.",
      },
      {
        number: "4",
        title: "Selection & interview",
        description: "Selection is merit-based on your entrance result and academic record, followed by a brief counselling interview.",
      },
      {
        number: "5",
        title: "Confirm your enrolment",
        description: "Complete registration, submit your migration certificate and secure your seat. Welcome to the PCM family!",
      },
    ],
  },
  applyOptions: {
    eyebrow: "Apply for admission",
    heading: "Two easy ways to apply",
    description: "Applying to Pokhara College of Management is quick and simple. Submit your application online, or if you prefer, download the prospectus/form as a PDF and drop it at our admissions office.",
    bannerImage: "/images/admission-open-2026.png",
    onlineOption: {
      title: "Apply online",
      description: "The fastest route — complete the form from anywhere and get a confirmation instantly.",
      buttonText: "Apply Online Now",
    },
    offlineOption: {
      title: "Apply offline",
      description: "Download the prospectus, fill it in, and submit it at our Nadipur campus.",
      buttonText: "Download Form",
    },
  },
  requiredDocuments: {
    heading: "Required documents",
    documents: [
      "SEE Mark-sheet & Character Certificate",
      "SEE Transfer Certificate",
      "10+2 / Equivalent Mark-sheet & Transcript",
      "10+2 / Equivalent Character Certificate",
      "Migration Certificate (original required for registration)",
      "Passport-size photographs (2 copies)",
      "Citizenship / Birth Certificate",
    ],
    scheduleBox: {
      heading: "Entrance schedule",
      examInfo: "Exam: Ashar 29, 2083 — 8:00 AM",
      deadlineInfo: "Form deadline: Ashar 26, 2083",
    },
  },
  applicationForm: {
    eyebrow: "Online Admission",
    heading: "Start your application",
    stepLabels: ["Personal Info.", "Contact Info.", "Academic Info.", "Document", "Declaration", "Payment"],
    personalInfoFields: [
      {
        id: "programme",
        label: "Programme",
        fieldType: "dropdown",
        required: true,
        options: [
          { value: "bba", label: "BBA (Bachelor in Business Administration)" },
          { value: "bba-finance", label: "BBA-Finance" },
          { value: "bcsit", label: "BCSIT (B.Sc. Computer Science & IT)" },
        ],
        order: 1,
      },
      {
        id: "shift",
        label: "Shift",
        fieldType: "dropdown",
        required: true,
        options: [
          { value: "morning", label: "Morning" },
          { value: "day", label: "Day" },
        ],
        order: 2,
      },
      {
        id: "full_name",
        label: "Student's Full Name",
        fieldType: "text",
        placeholder: "Enter full name as on document",
        required: true,
        order: 3,
      },
      {
        id: "gender",
        label: "Gender",
        fieldType: "radio",
        required: true,
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
        order: 4,
      },
      {
        id: "dob",
        label: "Date of Birth",
        fieldType: "date",
        required: true,
        order: 5,
      },
      {
        id: "nationality",
        label: "Nationality",
        fieldType: "text",
        placeholder: "Nepali",
        required: false,
        order: 6,
      },
      {
        id: "phone",
        label: "Phone Number",
        fieldType: "phone",
        placeholder: "e.g. 98XXXXXXXX",
        required: false,
        order: 7,
      },
      {
        id: "email",
        label: "Email Address",
        fieldType: "email",
        placeholder: "example@domain.com",
        required: false,
        order: 8,
      },
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
    ],
    programOptions: [
      { value: "bba", label: "BBA (Bachelor in Business Administration)" },
      { value: "bba-finance", label: "BBA-Finance" },
      { value: "bcsit", label: "BCSIT (B.Sc. Computer Science & IT)" },
    ],
    shiftOptions: [
      { value: "morning", label: "Morning" },
      { value: "day", label: "Day" },
    ],
    nationalityDefault: "Nepali",
    genderOptions: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
    contactInfoFields: [
      {
        id: "permanent_province",
        label: "Province (Permanent)",
        fieldType: "text",
        placeholder: "Enter province",
        required: true,
        order: 1,
      },
      {
        id: "permanent_district",
        label: "District (Permanent)",
        fieldType: "text",
        placeholder: "Enter district",
        required: true,
        order: 2,
      },
      {
        id: "permanent_city",
        label: "City / Municipality (Permanent)",
        fieldType: "text",
        placeholder: "Enter city or municipality",
        required: true,
        order: 3,
      },
      {
        id: "permanent_ward",
        label: "Ward No. (Permanent)",
        fieldType: "number",
        placeholder: "e.g. 5",
        required: true,
        order: 4,
      },
      {
        id: "same_address",
        label: "Temporary address same as permanent",
        fieldType: "checkbox",
        required: false,
        order: 5,
      },
      {
        id: "temporary_province",
        label: "Province (Temporary)",
        fieldType: "text",
        placeholder: "Enter province",
        required: false,
        order: 6,
      },
      {
        id: "temporary_district",
        label: "District (Temporary)",
        fieldType: "text",
        placeholder: "Enter district",
        required: false,
        order: 7,
      },
      {
        id: "temporary_city",
        label: "City / Municipality (Temporary)",
        fieldType: "text",
        placeholder: "Enter city or municipality",
        required: false,
        order: 8,
      },
      {
        id: "temporary_ward",
        label: "Ward No. (Temporary)",
        fieldType: "number",
        placeholder: "e.g. 5",
        required: false,
        order: 9,
      },
    ],
    academicInfoFields: [
      // SEE / SLC Fields
      {
        id: "see_bod",
        label: "Board of Education (SEE/SLC)",
        fieldType: "dropdown",
        required: true,
        options: [
          { value: "neb", label: "NEB (National Examination Board)" },
          { value: "hseb", label: "HSEB (Higher Secondary Education Board)" },
          { value: "cbse", label: "CBSE (India)" },
          { value: "other", label: "Other" },
        ],
        order: 1,
      },
      {
        id: "see_school",
        label: "School Name (SEE/SLC)",
        fieldType: "text",
        placeholder: "Enter school name",
        required: true,
        order: 2,
      },
      {
        id: "see_address",
        label: "School Location (SEE/SLC)",
        fieldType: "text",
        placeholder: "Enter school location",
        required: true,
        order: 3,
      },
      {
        id: "see_gpa",
        label: "GPA (SEE/SLC)",
        fieldType: "text",
        placeholder: "e.g. 3.65",
        required: true,
        order: 4,
      },
      {
        id: "see_year",
        label: "Year (SEE/SLC)",
        fieldType: "text",
        placeholder: "e.g. 2079 BS",
        required: true,
        order: 5,
      },
      {
        id: "see_full_mark",
        label: "Full Marks (SEE/SLC)",
        fieldType: "text",
        placeholder: "e.g. 800",
        required: true,
        order: 6,
      },
      {
        id: "see_mark_obtained",
        label: "Marks Obtained (SEE/SLC)",
        fieldType: "text",
        placeholder: "Obtained marks",
        required: true,
        order: 7,
      },
      {
        id: "see_percentage_obtained",
        label: "Percentage (SEE/SLC)",
        fieldType: "text",
        placeholder: "Percentage (%)",
        required: true,
        order: 8,
      },
      // +2 / Intermediate Fields
      {
        id: "intermediate_bod",
        label: "Board of Education (+2/Intermediate)",
        fieldType: "dropdown",
        required: true,
        options: [
          { value: "neb", label: "NEB (National Examination Board)" },
          { value: "hseb", label: "HSEB (Higher Secondary Education Board)" },
          { value: "cbse", label: "CBSE (India)" },
          { value: "other", label: "Other" },
        ],
        order: 9,
      },
      {
        id: "intermediate_school",
        label: "College Name (+2/Intermediate)",
        fieldType: "text",
        placeholder: "Enter college name",
        required: true,
        order: 10,
      },
      {
        id: "intermediate_address",
        label: "College Location (+2/Intermediate)",
        fieldType: "text",
        placeholder: "Enter college location",
        required: true,
        order: 11,
      },
      {
        id: "intermediate_gpa",
        label: "GPA (+2/Intermediate)",
        fieldType: "text",
        placeholder: "e.g. 3.25",
        required: true,
        order: 12,
      },
      {
        id: "intermediate_year",
        label: "Year (+2/Intermediate)",
        fieldType: "text",
        placeholder: "e.g. 2081 BS",
        required: true,
        order: 13,
      },
      {
        id: "intermediate_full_mark",
        label: "Full Marks (+2/Intermediate)",
        fieldType: "text",
        placeholder: "e.g. 600",
        required: true,
        order: 14,
      },
      {
        id: "intermediate_mark_obtained",
        label: "Marks Obtained (+2/Intermediate)",
        fieldType: "text",
        placeholder: "Obtained marks",
        required: true,
        order: 15,
      },
      {
        id: "intermediate_percentage_obtained",
        label: "Percentage (+2/Intermediate)",
        fieldType: "text",
        placeholder: "Percentage (%)",
        required: true,
        order: 16,
      },
    ],
    documentStep: {
      heading: "Document Upload",
      description: "Upload your required documents",
      documentLabels: [
        "SEE / SLC Mark-sheet",
        "SEE / SLC Character Certificate",
        "+2 / Intermediate Mark-sheet",
        "+2 / Intermediate Character Certificate",
      ],
    },
    declarationStep: {
      heading: "Declaration & Consent",
      description: "Review and confirm your application",
      declarationHeading: "Declaration",
      declarationText: "I hereby declare that all the information provided in this application form is true and correct to the best of my knowledge. I understand that if any information is found to be false or misleading, my admission may be cancelled. I agree to abide by the rules and regulations of Pokhara College of Management.",
      checkboxLabel: "I have read and agree to the declaration above",
    },
  },
  bankDetails: {
    heading: "Bank Voucher Details",
    bankName: "Prabhu Bank Limited",
    accountName: "Pokhara College Of Management Pvt Ltd",
    accountNumber: "0560153103200019",
    branch: "Newroad, Pokhara, Nepal",
    admissionFee: "Rs. 1,000",
  },
  successMessage: {
    heading: "Application submitted successfully!",
    message: "Thank you for submitting your application to Pokhara College of Management. We've received your form and will review it shortly.",
    reference: "Your application reference number is:",
  },
  needHelp: {
    heading: "Need help?",
    description: "For any queries or technical assistance with the application, contact the Admission Desk at",
    email: "info@pcm.edu.np",
    phone: "(061) 544761, 570124",
  },
  cta: {
    eyebrow: "Enter to Learn — Go Forth to Serve",
    heading: "A step towards your future",
    description: "Applications for the 2083 intake are open across all three programs. Take the first step today.",
    primaryButtonText: "Apply Now",
    primaryButtonLink: "#apply-form",
    secondaryButtonText: "More Info",
    secondaryButtonLink: "/about",
  },
  seo: {
    title: "Admission Process & Application | Pokhara College of Management",
    description: "Admission process, required documents and application form for BBA, BBA-Finance and BCSIT at Pokhara College of Management.",
    keywords: ["pcm admission", "pokhara college admission", "bba admission", "bcsit admission", "pcm application"],
    ogImage: "https://www.pcm.edu.np/assets/img/admission-open-2026.png",
  },
};

export default async function AdmissionPageEditorPage() {
  const pageData = await getPageContent("admission");

  // Deep merge existing content with defaults
  const existingContent = (pageData?.content || {}) as Partial<AdmissionPageContent>;

  const content: AdmissionPageContent = {
    hero: {
      title: existingContent.hero?.title || DEFAULT_ADMISSION_CONTENT.hero.title,
      subtitle: existingContent.hero?.subtitle || DEFAULT_ADMISSION_CONTENT.hero.subtitle,
      breadcrumbText: existingContent.hero?.breadcrumbText || DEFAULT_ADMISSION_CONTENT.hero.breadcrumbText,
    },
    admissionProcess: {
      eyebrow: existingContent.admissionProcess?.eyebrow || DEFAULT_ADMISSION_CONTENT.admissionProcess.eyebrow,
      heading: existingContent.admissionProcess?.heading || DEFAULT_ADMISSION_CONTENT.admissionProcess.heading,
      steps: existingContent.admissionProcess?.steps || DEFAULT_ADMISSION_CONTENT.admissionProcess.steps,
    },
    applyOptions: {
      eyebrow: existingContent.applyOptions?.eyebrow || DEFAULT_ADMISSION_CONTENT.applyOptions.eyebrow,
      heading: existingContent.applyOptions?.heading || DEFAULT_ADMISSION_CONTENT.applyOptions.heading,
      description: existingContent.applyOptions?.description || DEFAULT_ADMISSION_CONTENT.applyOptions.description,
      bannerImage: existingContent.applyOptions?.bannerImage || DEFAULT_ADMISSION_CONTENT.applyOptions.bannerImage,
      onlineOption: {
        title: existingContent.applyOptions?.onlineOption?.title || DEFAULT_ADMISSION_CONTENT.applyOptions.onlineOption.title,
        description: existingContent.applyOptions?.onlineOption?.description || DEFAULT_ADMISSION_CONTENT.applyOptions.onlineOption.description,
        buttonText: existingContent.applyOptions?.onlineOption?.buttonText || DEFAULT_ADMISSION_CONTENT.applyOptions.onlineOption.buttonText,
      },
      offlineOption: {
        title: existingContent.applyOptions?.offlineOption?.title || DEFAULT_ADMISSION_CONTENT.applyOptions.offlineOption.title,
        description: existingContent.applyOptions?.offlineOption?.description || DEFAULT_ADMISSION_CONTENT.applyOptions.offlineOption.description,
        buttonText: existingContent.applyOptions?.offlineOption?.buttonText || DEFAULT_ADMISSION_CONTENT.applyOptions.offlineOption.buttonText,
      },
    },
    requiredDocuments: {
      heading: existingContent.requiredDocuments?.heading || DEFAULT_ADMISSION_CONTENT.requiredDocuments.heading,
      documents: existingContent.requiredDocuments?.documents || DEFAULT_ADMISSION_CONTENT.requiredDocuments.documents,
      scheduleBox: {
        heading: existingContent.requiredDocuments?.scheduleBox?.heading || DEFAULT_ADMISSION_CONTENT.requiredDocuments.scheduleBox.heading,
        examInfo: existingContent.requiredDocuments?.scheduleBox?.examInfo || DEFAULT_ADMISSION_CONTENT.requiredDocuments.scheduleBox.examInfo,
        deadlineInfo: existingContent.requiredDocuments?.scheduleBox?.deadlineInfo || DEFAULT_ADMISSION_CONTENT.requiredDocuments.scheduleBox.deadlineInfo,
      },
    },
    applicationForm: {
      eyebrow: existingContent.applicationForm?.eyebrow || DEFAULT_ADMISSION_CONTENT.applicationForm.eyebrow,
      heading: existingContent.applicationForm?.heading || DEFAULT_ADMISSION_CONTENT.applicationForm.heading,
      stepLabels: existingContent.applicationForm?.stepLabels || DEFAULT_ADMISSION_CONTENT.applicationForm.stepLabels,
      personalInfoFields: existingContent.applicationForm?.personalInfoFields || DEFAULT_ADMISSION_CONTENT.applicationForm.personalInfoFields,
      programOptions: existingContent.applicationForm?.programOptions || DEFAULT_ADMISSION_CONTENT.applicationForm.programOptions,
      shiftOptions: existingContent.applicationForm?.shiftOptions || DEFAULT_ADMISSION_CONTENT.applicationForm.shiftOptions,
      nationalityDefault: existingContent.applicationForm?.nationalityDefault || DEFAULT_ADMISSION_CONTENT.applicationForm.nationalityDefault,
      genderOptions: existingContent.applicationForm?.genderOptions || DEFAULT_ADMISSION_CONTENT.applicationForm.genderOptions,
      contactInfoFields: existingContent.applicationForm?.contactInfoFields || DEFAULT_ADMISSION_CONTENT.applicationForm.contactInfoFields,
      academicInfoFields: existingContent.applicationForm?.academicInfoFields || DEFAULT_ADMISSION_CONTENT.applicationForm.academicInfoFields,
      documentStep: {
        heading: existingContent.applicationForm?.documentStep?.heading || DEFAULT_ADMISSION_CONTENT.applicationForm.documentStep.heading,
        description: existingContent.applicationForm?.documentStep?.description || DEFAULT_ADMISSION_CONTENT.applicationForm.documentStep.description,
        documentLabels: existingContent.applicationForm?.documentStep?.documentLabels || DEFAULT_ADMISSION_CONTENT.applicationForm.documentStep.documentLabels,
      },
      declarationStep: {
        heading: existingContent.applicationForm?.declarationStep?.heading || DEFAULT_ADMISSION_CONTENT.applicationForm.declarationStep.heading,
        description: existingContent.applicationForm?.declarationStep?.description || DEFAULT_ADMISSION_CONTENT.applicationForm.declarationStep.description,
        declarationHeading: existingContent.applicationForm?.declarationStep?.declarationHeading || DEFAULT_ADMISSION_CONTENT.applicationForm.declarationStep.declarationHeading,
        declarationText: existingContent.applicationForm?.declarationStep?.declarationText || DEFAULT_ADMISSION_CONTENT.applicationForm.declarationStep.declarationText,
        checkboxLabel: existingContent.applicationForm?.declarationStep?.checkboxLabel || DEFAULT_ADMISSION_CONTENT.applicationForm.declarationStep.checkboxLabel,
      },
    },
    bankDetails: {
      heading: existingContent.bankDetails?.heading || DEFAULT_ADMISSION_CONTENT.bankDetails.heading,
      bankName: existingContent.bankDetails?.bankName || DEFAULT_ADMISSION_CONTENT.bankDetails.bankName,
      accountName: existingContent.bankDetails?.accountName || DEFAULT_ADMISSION_CONTENT.bankDetails.accountName,
      accountNumber: existingContent.bankDetails?.accountNumber || DEFAULT_ADMISSION_CONTENT.bankDetails.accountNumber,
      branch: existingContent.bankDetails?.branch || DEFAULT_ADMISSION_CONTENT.bankDetails.branch,
      admissionFee: existingContent.bankDetails?.admissionFee || DEFAULT_ADMISSION_CONTENT.bankDetails.admissionFee,
    },
    successMessage: {
      heading: existingContent.successMessage?.heading || DEFAULT_ADMISSION_CONTENT.successMessage.heading,
      message: existingContent.successMessage?.message || DEFAULT_ADMISSION_CONTENT.successMessage.message,
      reference: existingContent.successMessage?.reference || DEFAULT_ADMISSION_CONTENT.successMessage.reference,
    },
    needHelp: {
      heading: existingContent.needHelp?.heading || DEFAULT_ADMISSION_CONTENT.needHelp.heading,
      description: existingContent.needHelp?.description || DEFAULT_ADMISSION_CONTENT.needHelp.description,
      email: existingContent.needHelp?.email || DEFAULT_ADMISSION_CONTENT.needHelp.email,
      phone: existingContent.needHelp?.phone || DEFAULT_ADMISSION_CONTENT.needHelp.phone,
    },
    cta: {
      eyebrow: existingContent.cta?.eyebrow || DEFAULT_ADMISSION_CONTENT.cta.eyebrow,
      heading: existingContent.cta?.heading || DEFAULT_ADMISSION_CONTENT.cta.heading,
      description: existingContent.cta?.description || DEFAULT_ADMISSION_CONTENT.cta.description,
      primaryButtonText: existingContent.cta?.primaryButtonText || DEFAULT_ADMISSION_CONTENT.cta.primaryButtonText,
      primaryButtonLink: existingContent.cta?.primaryButtonLink || DEFAULT_ADMISSION_CONTENT.cta.primaryButtonLink,
      secondaryButtonText: existingContent.cta?.secondaryButtonText || DEFAULT_ADMISSION_CONTENT.cta.secondaryButtonText,
      secondaryButtonLink: existingContent.cta?.secondaryButtonLink || DEFAULT_ADMISSION_CONTENT.cta.secondaryButtonLink,
    },
    seo: {
      title: existingContent.seo?.title || DEFAULT_ADMISSION_CONTENT.seo.title,
      description: existingContent.seo?.description || DEFAULT_ADMISSION_CONTENT.seo.description,
      keywords: existingContent.seo?.keywords || DEFAULT_ADMISSION_CONTENT.seo.keywords,
      ogImage: existingContent.seo?.ogImage || DEFAULT_ADMISSION_CONTENT.seo.ogImage,
    },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admission Page Editor</h1>
        <p className="mt-1 text-sm text-gray-600">
          Edit all admission page content including hero, process steps, apply options, required documents, application form fields, bank details, and SEO.
        </p>
      </div>

      <AdmissionPageEditor initialContent={content} />
    </div>
  );
}
