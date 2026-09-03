// src/types/page-content.ts
// Schema for the page_content collection (freeform CMS blocks)

export const PAGE_CONTENT_COLLECTION = "page_content";

// Legacy page content section (for about, clubs pages using old schema)
export interface PageContentSection {
  key: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  paragraphs?: string[];
  checklist?: string[];
}

export interface PageContent {
  id: string;
  slug: string; // "programs", "about", "admissions", etc.
  content: PageContentData; // Dynamic fields per page
  createdAt: string;
  updatedAt: string;
  // Legacy flat shape (about, clubs, and the other "about/*" pages). These
  // fields are stored at the document root in Mongo (NOT nested under
  // "content") and are exposed here so the public pages and the admin
  // editor can read hero/label/sections directly.
  label?: string;
  hero?: {
    title: string;
    subtitle: string;
  };
  sections?: PageContentSection[];
}

// Union type for different page content structures
export type PageContentData = Record<string, unknown> & {
  // Legacy generic page schema (about, clubs, etc.)
  label?: string;
  hero?: {
    title: string;
    subtitle: string;
  };
  sections?: PageContentSection[];
};

export interface PageContentDocument {
  _id?: import("mongodb").ObjectId;
  slug: string;
  content?: PageContentData;
  createdAt?: Date;
  updatedAt: Date;
  // Legacy flat shape — some pages (about, clubs, "about/*") store
  // label/hero/sections at the document root instead of under "content".
  label?: string;
  hero?: {
    title: string;
    subtitle: string;
  };
  sections?: PageContentSection[];
}

// Programs page specific content schema
export interface ProgramsPageContent {
  hero: {
    title: string;
    subtitle: string;
  };
  intro: {
    heading: string;
    body: string;
  };
  comparisonTable: {
    heading: string;
    columns: string[]; // e.g., ["Program", "Focus", "Duration", "Credits", "Ideal for"]
    // Per-program comparison cell overrides (keyed by program slug). Only programs
    // in the system are shown/editable. A blank/absent field falls back to the
    // value derived from the program record.
    rows?: {
      [slug: string]: {
        focus?: string;
        duration?: string;
        credits?: string;
        idealFor?: string;
      };
    };
  };
  cta: {
    heading: string;
    body: string;
    phone: string;
  };
  coordinators?: {
    visible: boolean;
    eyebrow: string;
    heading: string;
    description: string;
    visiblePrograms: string[];
  };
  featuredProgramRefs: string[]; // Array of program slugs (NOT full program objects)
  
  // Per-program page content (keyed by slug)
  programPages?: {
    [slug: string]: {
      hero?: {
        tagline: string;
      };
      overview?: {
        title: string;
        body: string[];
      };
      concentrations?: Array<{
        title: string;
        description: string;
      }>;
      careers?: string[]; // Array of career titles
      admissionRequirements?: Array<{
        title: string;
        detail: string;
      }>;
      quickFacts?: {
        level: string;
        duration: string;
        semesters: number;
        creditHours: number;
        eligibility: string;
        affiliation: string;
        labels?: {
          heading?: string; // "Quick facts"
          level?: string; // "Level"
          duration?: string; // "Duration"
          semesters?: string; // "Semesters"
          creditHours?: string; // "Credit hours"
          eligibility?: string; // "Eligibility"
          affiliation?: string; // "Affiliation"
        };
      };
      curriculum?: Array<{
        label: string; // e.g., "Sem I"
        courses: Array<{
          code: string;
          description: string;
          credits: string;
        }>;
      }>;
      totalCredits?: string;
      curriculumSection?: {
        eyebrow: string; // e.g., "Curriculum"
        title: string; // e.g., "Program structure & syllabus"
        description: string; // e.g., "A carefully sequenced eight-semester journey..."
      };
      coordinator?: {
        name: string;
        initials: string;
        image: string;
        role: string;
        quote: string;
      };
      growthSection?: {
        title: string; // e.g., "How BBA students grow at PCM"
        items: Array<{
          title: string;
          description: string;
        }>;
      };
      callout?: {
        title: string;
        body: string;
      };
      cta?: {
        title: string;
        body: string;
        buttons?: {
          primary?: {
            text: string; // "Apply for {code}"
            url: string; // "/admission"
          };
          secondary?: {
            text: string; // "Ask a question"
            url: string; // "/contact"
          };
        };
      };
    };
  };
}

// Field schema defining which fields are editable vs locked
export const PROGRAMS_PAGE_SCHEMA = {
  hero: { title: "editable", subtitle: "editable" },
  intro: { heading: "editable", body: "editable" },
  comparisonTable: { heading: "editable", columns: "editable", rows: "editable" },
  coordinators: { 
    visible: "editable", 
    eyebrow: "editable", 
    heading: "editable", 
    description: "editable",
    visiblePrograms: "editable"
  },
  cta: { heading: "editable", body: "editable", phone: "editable" },
  featuredProgramRefs: "editable", // Admin can reorder/select which programs to feature
  programPages: "editable", // Per-program page content
} as const;

// Contact page specific content schema
export interface ContactPageContent {
  hero: {
    title: string;
    subtitle: string;
  };
  contactDetails: {
    sectionHeading: string; // "We're here to help"
    sectionBody: string;
    address: {
      label: string; // "Visit us"
      value: string; // "Gyan Marg, Nadipur..."
      mapUrl?: string; // Optional Google Maps link
    };
    phone: {
      label: string; // "Call us"
      value: string; // "(061) 544761, 570124"
      tel: string; // "061544761"
    };
    email: {
      label: string; // "Email us"
      value: string; // "info@pcm.edu.np"
    };
    hours: {
      label: string; // "Opening hours"
      value: string; // "Sun–Fri: 6:00 AM – 4:00 PM • Sat: Closed"
    };
  };
  contactForm: {
    heading: string; // "Send us a message"
    fields: {
      name: { label: string; placeholder: string };
      phone: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      subject: {
        label: string;
        options: string[]; // ["Admissions enquiry", "Program information", ...]
      };
      message: { label: string; placeholder: string };
    };
    submitButtonText: string;
    successMessage: string;
    noteMessage: string;
  };
  mapEmbed: {
    title: string; // iframe title for accessibility
    embedUrl: string; // Google Maps embed URL
  };
  cta: {
    eyebrow: string;
    heading: string;
    body: string;
    buttons: {
      primary: {
        text: string;
        url: string;
      };
      secondary: {
        text: string;
        url: string;
      };
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const CONTACT_PAGE_SCHEMA = {
  hero: { title: "editable", subtitle: "editable" },
  contactDetails: {
    sectionHeading: "editable",
    sectionBody: "editable",
    address: { label: "editable", value: "editable", mapUrl: "editable" },
    phone: { label: "editable", value: "editable", tel: "editable" },
    email: { label: "editable", value: "editable" },
    hours: { label: "editable", value: "editable" },
  },
  contactForm: {
    heading: "editable",
    fields: {
      name: { label: "editable", placeholder: "editable" },
      phone: { label: "editable", placeholder: "editable" },
      email: { label: "editable", placeholder: "editable" },
      subject: { label: "editable", options: "editable" },
      message: { label: "editable", placeholder: "editable" },
    },
    submitButtonText: "editable",
    successMessage: "editable",
    noteMessage: "editable",
  },
  mapEmbed: { title: "editable", embedUrl: "editable" },
  cta: {
    eyebrow: "editable",
    heading: "editable",
    body: "editable",
    buttons: {
      primary: { text: "editable", url: "editable" },
      secondary: { text: "editable", url: "editable" },
    },
  },
  seo: {
    title: "editable",
    description: "editable",
    keywords: "editable",
  },
} as const;

// Admission page specific content schema
export interface AdmissionPageContent {
  hero: {
    title: string;
    subtitle: string;
    breadcrumbText: string;
  };
  admissionProcess: {
    eyebrow: string; // "How it works"
    heading: string; // "The admission process"
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  };
  applyOptions: {
    eyebrow: string; // "Apply for admission"
    heading: string; // "Two easy ways to apply"
    description: string;
    bannerImage: string; // Cloudinary URL
    onlineOption: {
      title: string;
      description: string;
      buttonText: string;
    };
    offlineOption: {
      title: string;
      description: string;
      buttonText: string;
    };
  };
  requiredDocuments: {
    heading: string; // "Required documents"
    documents: string[];
    scheduleBox: {
      heading: string; // "Entrance schedule"
      examInfo: string; // "Exam: Ashar 29, 2083 — 8:00 AM"
      deadlineInfo: string; // "Form deadline: Ashar 26, 2083"
    };
  };
  applicationForm: {
    eyebrow: string; // "Online Admission"
    heading: string; // "Start your application"
    stepLabels: string[]; // ["Personal Info.", "Contact Info.", ...]
    // Step 1: Personal Info - Dynamic Fields
    personalInfoFields: Array<{
      id: string; // unique identifier
      label: string; // Field label
      fieldType: "text" | "textarea" | "number" | "email" | "phone" | "date" | "dropdown" | "checkbox" | "radio" | "file" | "image";
      placeholder?: string;
      required: boolean;
      options?: Array<{ value: string; label: string }>; // For dropdown, radio, checkbox
      helpText?: string;
      order: number; // Display order
    }>;
    // Legacy fields (kept for backward compatibility, but use personalInfoFields instead)
    programOptions: Array<{
      value: string;
      label: string;
    }>;
    shiftOptions: Array<{
      value: string;
      label: string;
    }>;
    nationalityDefault: string;
    genderOptions: Array<{
      value: string;
      label: string;
    }>;
    // Step 2: Contact Info - Dynamic Fields
    contactInfoFields: Array<{
      id: string;
      label: string;
      fieldType: "text" | "textarea" | "number" | "email" | "phone" | "date" | "dropdown" | "checkbox" | "radio" | "file" | "image";
      placeholder?: string;
      required: boolean;
      options?: Array<{ value: string; label: string }>;
      helpText?: string;
      order: number;
    }>;
    // Step 3: Academic Info - Dynamic Fields
    academicInfoFields: Array<{
      id: string;
      label: string;
      fieldType: "text" | "textarea" | "number" | "email" | "phone" | "date" | "dropdown" | "checkbox" | "radio" | "file" | "image";
      placeholder?: string;
      required: boolean;
      options?: Array<{ value: string; label: string }>;
      helpText?: string;
      order: number;
    }>;
    // Step 4: Document Upload
    documentStep: {
      heading: string; // "Document Upload"
      description: string; // "Upload your required documents"
      documentLabels: string[]; // ["SEE / SLC Mark-sheet", "SEE / SLC Character Certificate", ...]
    };
    // Step 5: Declaration & Consent
    declarationStep: {
      heading: string; // "Declaration & Consent"
      description: string; // "Review and confirm your application"
      declarationHeading: string; // "Declaration"
      declarationText: string; // The full declaration text
      checkboxLabel: string; // "I have read and agree to the declaration above"
    };
  };
  bankDetails: {
    heading: string; // "Bank Voucher Details"
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    admissionFee: string;
  };
  successMessage: {
    heading: string;
    message: string;
    reference: string;
  };
  needHelp: {
    heading: string;
    description: string;
    email: string;
    phone: string;
  };
  cta: {
    eyebrow: string;
    heading: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const ADMISSION_PAGE_SCHEMA = {
  hero: { 
    title: "editable", 
    subtitle: "editable", 
    breadcrumbText: "editable" 
  },
  admissionProcess: {
    eyebrow: "editable",
    heading: "editable",
    steps: "editable",
  },
  applyOptions: {
    eyebrow: "editable",
    heading: "editable",
    description: "editable",
    bannerImage: "editable",
    onlineOption: {
      title: "editable",
      description: "editable",
      buttonText: "editable",
    },
    offlineOption: {
      title: "editable",
      description: "editable",
      buttonText: "editable",
    },
  },
  requiredDocuments: {
    heading: "editable",
    documents: "editable",
    scheduleBox: {
      heading: "editable",
      examInfo: "editable",
      deadlineInfo: "editable",
    },
  },
  applicationForm: {
    eyebrow: "editable",
    heading: "editable",
    stepLabels: "editable",
    personalInfoFields: "editable",
    programOptions: "editable",
    shiftOptions: "editable",
    nationalityDefault: "editable",
    genderOptions: "editable",
    contactInfoFields: "editable",
    academicInfoFields: "editable",
    documentStep: {
      heading: "editable",
      description: "editable",
      documentLabels: "editable",
    },
    declarationStep: {
      heading: "editable",
      description: "editable",
      declarationHeading: "editable",
      declarationText: "editable",
      checkboxLabel: "editable",
    },
  },
  bankDetails: {
    heading: "editable",
    bankName: "editable",
    accountName: "editable",
    accountNumber: "editable",
    branch: "editable",
    admissionFee: "editable",
  },
  successMessage: {
    heading: "editable",
    message: "editable",
    reference: "editable",
  },
  seo: {
    title: "editable",
    description: "editable",
    keywords: "editable",
    ogImage: "editable",
  },
} as const;

// Helper to validate that only editable fields are being updated
export function filterEditableFields(
  input: Record<string, unknown>,
  schema: typeof PROGRAMS_PAGE_SCHEMA
): Record<string, unknown> {
  const allowed: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(input)) {
    const fieldSchema = schema[key as keyof typeof schema];
    
    if (!fieldSchema) continue; // Unknown field, skip
    
    if (fieldSchema === "editable") {
      allowed[key] = value;
    } else if (typeof fieldSchema === "object") {
      // Nested object, filter recursively
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        const nested: Record<string, unknown> = {};
        for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
          if (fieldSchema[nestedKey as keyof typeof fieldSchema] === "editable") {
            nested[nestedKey] = nestedValue;
          }
        }
        if (Object.keys(nested).length > 0) {
          allowed[key] = nested;
        }
      }
    }
    // If fieldSchema === "locked", skip entirely
  }
  
  return allowed;
}
