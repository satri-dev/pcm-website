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
  content: PageContentData;
  createdAt: Date;
  updatedAt: Date;
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
    columns: string[]; // e.g., ["Program", "Duration", "Seats", "Status"]
  };
  cta: {
    heading: string;
    body: string;
    phone: string;
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
  comparisonTable: { heading: "editable", columns: "editable" },
  cta: { heading: "editable", body: "editable", phone: "editable" },
  featuredProgramRefs: "editable", // Admin can reorder/select which programs to feature
  programPages: "editable", // Per-program page content
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
