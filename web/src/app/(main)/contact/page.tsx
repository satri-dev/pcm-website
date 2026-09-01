import type { Metadata } from "next";
import { getPageContent } from "@/lib/data/page-content";
import ContactClient from "./ContactClient";
import type { ContactPageContent } from "@/types/page-content";

// Default SEO values
const DEFAULT_SEO = {
  title: "Contact Us | Pokhara College of Management",
  description: "Contact Pokhara College of Management – address, phone, email and enquiry form.",
  keywords: ["pcm contact", "pokhara college management contact", "pcm address", "pcm phone", "pcm email"],
};

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const pageContentData = await getPageContent("contact");
  const content = (pageContentData?.content || {}) as Partial<ContactPageContent>;
  
  const seoTitle = content.seo?.title || DEFAULT_SEO.title;
  const seoDescription = content.seo?.description || DEFAULT_SEO.description;
  const seoKeywords = content.seo?.keywords || DEFAULT_SEO.keywords;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords.join(", "),
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "website",
      siteName: "Pokhara College of Management",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
    },
  };
}

// Default content values
const DEFAULT_CONTACT_CONTENT: ContactPageContent = {
  hero: {
    title: "Get in Touch",
    subtitle: "Questions about admissions, programs or a campus visit? We'd love to hear from you.",
  },
  contactDetails: {
    sectionHeading: "We're here to help",
    sectionBody: "Reach out by phone or email, or drop by our Nadipur campus during opening hours. Our admissions team is happy to walk you through programs, fees and scholarships.",
    address: {
      label: "Visit us",
      value: "Gyan Marg, Nadipur, Pokhara-2, Kaski, Nepal",
      mapUrl: "https://maps.google.com/?q=Pokhara+College+of+Management+Nadipur",
    },
    phone: {
      label: "Call us",
      value: "(061) 544761, 570124",
      tel: "061544761",
    },
    email: {
      label: "Email us",
      value: "info@pcm.edu.np",
    },
    hours: {
      label: "Opening hours",
      value: "Sun–Fri: 6:00 AM – 4:00 PM • Sat: Closed",
    },
  },
  contactForm: {
    heading: "Send us a message",
    fields: {
      name: {
        label: "Full name",
        placeholder: "Your name",
      },
      phone: {
        label: "Phone",
        placeholder: "98XXXXXXXX",
      },
      email: {
        label: "Email",
        placeholder: "you@example.com",
      },
      subject: {
        label: "Subject",
        options: [
          "Admissions enquiry",
          "Program information",
          "Scholarships",
          "Campus visit",
          "Other",
        ],
      },
      message: {
        label: "Message",
        placeholder: "How can we help?",
      },
    },
    submitButtonText: "Send message",
    successMessage: "Thanks for reaching out! We'll get back to you within one working day.",
    noteMessage: "This demo form does not transmit data. Please email info@pcm.edu.np for real enquiries.",
  },
  mapEmbed: {
    title: "PCM location map",
    embedUrl: "https://maps.google.com/maps?q=Pokhara%20College%20of%20Management%20Nadipur%20Pokhara&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  cta: {
    eyebrow: "Enter to Learn • Go Forth to Serve",
    heading: "A step towards your future",
    body: "Applications for the 2083 intake are open across all three programs. Take the first step today.",
    buttons: {
      primary: {
        text: "Apply Now",
        url: "/admission",
      },
      secondary: {
        text: "More Info",
        url: "/about",
      },
    },
  },
  seo: {
    title: "Contact Us | Pokhara College of Management",
    description: "Contact Pokhara College of Management – address, phone, email and enquiry form.",
    keywords: ["pcm contact", "pokhara college management contact", "pcm address", "pcm phone", "pcm email", "pcm nadipur"],
  },
};

export default async function ContactPage() {
  // Fetch contact page content with caching
  const pageContentData = await getPageContent("contact");

  // Extract content with defaults
  const content = (pageContentData?.content || {}) as Partial<ContactPageContent>;

  // Merge with defaults using || for empty string handling
  const contactData: ContactPageContent = {
    hero: {
      title: content.hero?.title || DEFAULT_CONTACT_CONTENT.hero.title,
      subtitle: content.hero?.subtitle || DEFAULT_CONTACT_CONTENT.hero.subtitle,
    },
    contactDetails: {
      sectionHeading: content.contactDetails?.sectionHeading || DEFAULT_CONTACT_CONTENT.contactDetails.sectionHeading,
      sectionBody: content.contactDetails?.sectionBody || DEFAULT_CONTACT_CONTENT.contactDetails.sectionBody,
      address: {
        label: content.contactDetails?.address?.label || DEFAULT_CONTACT_CONTENT.contactDetails.address.label,
        value: content.contactDetails?.address?.value || DEFAULT_CONTACT_CONTENT.contactDetails.address.value,
        mapUrl: content.contactDetails?.address?.mapUrl || DEFAULT_CONTACT_CONTENT.contactDetails.address.mapUrl,
      },
      phone: {
        label: content.contactDetails?.phone?.label || DEFAULT_CONTACT_CONTENT.contactDetails.phone.label,
        value: content.contactDetails?.phone?.value || DEFAULT_CONTACT_CONTENT.contactDetails.phone.value,
        tel: content.contactDetails?.phone?.tel || DEFAULT_CONTACT_CONTENT.contactDetails.phone.tel,
      },
      email: {
        label: content.contactDetails?.email?.label || DEFAULT_CONTACT_CONTENT.contactDetails.email.label,
        value: content.contactDetails?.email?.value || DEFAULT_CONTACT_CONTENT.contactDetails.email.value,
      },
      hours: {
        label: content.contactDetails?.hours?.label || DEFAULT_CONTACT_CONTENT.contactDetails.hours.label,
        value: content.contactDetails?.hours?.value || DEFAULT_CONTACT_CONTENT.contactDetails.hours.value,
      },
    },
    contactForm: {
      heading: content.contactForm?.heading || DEFAULT_CONTACT_CONTENT.contactForm.heading,
      fields: {
        name: {
          label: content.contactForm?.fields?.name?.label || DEFAULT_CONTACT_CONTENT.contactForm.fields.name.label,
          placeholder: content.contactForm?.fields?.name?.placeholder || DEFAULT_CONTACT_CONTENT.contactForm.fields.name.placeholder,
        },
        phone: {
          label: content.contactForm?.fields?.phone?.label || DEFAULT_CONTACT_CONTENT.contactForm.fields.phone.label,
          placeholder: content.contactForm?.fields?.phone?.placeholder || DEFAULT_CONTACT_CONTENT.contactForm.fields.phone.placeholder,
        },
        email: {
          label: content.contactForm?.fields?.email?.label || DEFAULT_CONTACT_CONTENT.contactForm.fields.email.label,
          placeholder: content.contactForm?.fields?.email?.placeholder || DEFAULT_CONTACT_CONTENT.contactForm.fields.email.placeholder,
        },
        subject: {
          label: content.contactForm?.fields?.subject?.label || DEFAULT_CONTACT_CONTENT.contactForm.fields.subject.label,
          options: content.contactForm?.fields?.subject?.options || DEFAULT_CONTACT_CONTENT.contactForm.fields.subject.options,
        },
        message: {
          label: content.contactForm?.fields?.message?.label || DEFAULT_CONTACT_CONTENT.contactForm.fields.message.label,
          placeholder: content.contactForm?.fields?.message?.placeholder || DEFAULT_CONTACT_CONTENT.contactForm.fields.message.placeholder,
        },
      },
      submitButtonText: content.contactForm?.submitButtonText || DEFAULT_CONTACT_CONTENT.contactForm.submitButtonText,
      successMessage: content.contactForm?.successMessage || DEFAULT_CONTACT_CONTENT.contactForm.successMessage,
      noteMessage: content.contactForm?.noteMessage || DEFAULT_CONTACT_CONTENT.contactForm.noteMessage,
    },
    mapEmbed: {
      title: content.mapEmbed?.title || DEFAULT_CONTACT_CONTENT.mapEmbed.title,
      embedUrl: content.mapEmbed?.embedUrl || DEFAULT_CONTACT_CONTENT.mapEmbed.embedUrl,
    },
    cta: {
      eyebrow: content.cta?.eyebrow || DEFAULT_CONTACT_CONTENT.cta.eyebrow,
      heading: content.cta?.heading || DEFAULT_CONTACT_CONTENT.cta.heading,
      body: content.cta?.body || DEFAULT_CONTACT_CONTENT.cta.body,
      buttons: {
        primary: {
          text: content.cta?.buttons?.primary?.text || DEFAULT_CONTACT_CONTENT.cta.buttons.primary.text,
          url: content.cta?.buttons?.primary?.url || DEFAULT_CONTACT_CONTENT.cta.buttons.primary.url,
        },
        secondary: {
          text: content.cta?.buttons?.secondary?.text || DEFAULT_CONTACT_CONTENT.cta.buttons.secondary.text,
          url: content.cta?.buttons?.secondary?.url || DEFAULT_CONTACT_CONTENT.cta.buttons.secondary.url,
        },
      },
    },
    seo: {
      title: content.seo?.title || DEFAULT_CONTACT_CONTENT.seo.title,
      description: content.seo?.description || DEFAULT_CONTACT_CONTENT.seo.description,
      keywords: content.seo?.keywords || DEFAULT_CONTACT_CONTENT.seo.keywords,
    },
  };

  return <ContactClient content={contactData} />;
}
