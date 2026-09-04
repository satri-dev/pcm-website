// src/types/testimonial-page-settings.ts
// Dynamic content for the public /testimonials page.
// Stored in the site_settings collection under key "testimonials_page".

export interface TestimonialFormCopy {
  modalTitle: string;
  modalDescription: string;
  successTitle: string;
  successText: string;
  successDone: string;
  requiredName: string;
  requiredContent: string;
  submitError: string;
  nameLabel: string;
  programLabel: string;
  batchLabel: string;
  positionLabel: string;
  photoLabel: string;
  contentLabel: string;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel: string;
  uploadLabel: string;
  removePhotoLabel: string;
  noPhotoText: string;
}

export interface TestimonialPageSettings {
  // Feature toggle — disable entirely blocks the "Add Testimonial" button.
  addEnabled: boolean;

  // Hero
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;

  // "Voices of PCM" section head
  headEyebrow: string;
  headTitle: string;
  headSubtitle: string;

  // Add button + empty state
  addButtonLabel: string;
  emptyText: string;

  // Add-form copy (labels, success/error text)
  form: TestimonialFormCopy;

  // CTA band
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;

  // SEO & metadata
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;
  canonical: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export const TESTIMONIAL_PAGE_SETTINGS_KEY = "testimonials_page";

export const TESTIMONIAL_FORM_COPY_DEFAULTS: TestimonialFormCopy = {
  modalTitle: "Add Your Testimonial",
  modalDescription:
    "Share your PCM story. Your testimonial will be reviewed by our team before it appears on this page.",
  successTitle: "Thank you for sharing!",
  successText:
    "Your testimonial has been submitted and is now pending review by our team. Once approved, it will appear on this page.",
  successDone: "Done",
  requiredName: "Your name is required.",
  requiredContent: "Your testimonial message is required.",
  submitError: "Could not submit your testimonial. Please try again.",
  nameLabel: "Name",
  programLabel: "Program",
  batchLabel: "Batch",
  positionLabel: "Current Position / Role",
  photoLabel: "Profile Picture",
  contentLabel: "Your Testimonial",
  submitLabel: "Submit Testimonial",
  submittingLabel: "Submitting...",
  cancelLabel: "Cancel",
  uploadLabel: "Upload Image",
  removePhotoLabel: "Remove",
  noPhotoText: "No photo selected.",
};

export const TESTIMONIAL_PAGE_SETTINGS_DEFAULTS: TestimonialPageSettings = {
  addEnabled: true,

  heroEyebrow: "Testimonials",
  heroTitle: "Student Testimonials",
  heroSubtitle:
    "Real words from the PCM community — students, graduates and the families who trust us.",

  headEyebrow: "Voices of PCM",
  headTitle: "What our achievers say",
  headSubtitle:
    "A legacy measured in outcomes — hear it from the people who lived it.",

  addButtonLabel: "Add Your Testimonial",
  emptyText: "No testimonials yet. Be the first to share your story!",

  form: { ...TESTIMONIAL_FORM_COPY_DEFAULTS },

  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "Write your own story",
  ctaText:
    "Join a community where students grow, succeed and belong. Your journey starts here.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "See Campus Life",
  ctaSecondaryHref: "/gallery",

  seoTitle: "Student Testimonials | Pokhara College of Management",
  seoDescription:
    "What students, graduates and parents say about Pokhara College of Management — real stories from the PCM community.",
  seoKeywords: [
    "PCM testimonials",
    "Pokhara College of Management reviews",
    "student testimonials Nepal",
    "PCM student experiences",
  ],
  ogImage: "/images/hero-4.jpg",
  canonical: "/testimonials",
  robotsIndex: true,
  robotsFollow: true,
};
