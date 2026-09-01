import { getPageContent } from "@/lib/data/page-content";
import ContactPageEditor from "./_components/contact-page-editor";
import type { ContactPageContent } from "@/types/page-content";

export const metadata = {
  title: "Contact Page Editor | PCM Admin",
};

// Default content structure
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

export default async function ContactPageEditorPage() {
  const pageData = await getPageContent("contact");

  // Deep merge existing content with defaults using || for empty string handling
  const existingContent = (pageData?.content || {}) as Partial<ContactPageContent>;
  
  const content: ContactPageContent = {
    hero: {
      title: existingContent.hero?.title || DEFAULT_CONTACT_CONTENT.hero.title,
      subtitle: existingContent.hero?.subtitle || DEFAULT_CONTACT_CONTENT.hero.subtitle,
    },
    contactDetails: {
      sectionHeading: existingContent.contactDetails?.sectionHeading || DEFAULT_CONTACT_CONTENT.contactDetails.sectionHeading,
      sectionBody: existingContent.contactDetails?.sectionBody || DEFAULT_CONTACT_CONTENT.contactDetails.sectionBody,
      address: {
        label: existingContent.contactDetails?.address?.label || DEFAULT_CONTACT_CONTENT.contactDetails.address.label,
        value: existingContent.contactDetails?.address?.value || DEFAULT_CONTACT_CONTENT.contactDetails.address.value,
        mapUrl: existingContent.contactDetails?.address?.mapUrl || DEFAULT_CONTACT_CONTENT.contactDetails.address.mapUrl,
      },
      phone: {
        label: existingContent.contactDetails?.phone?.label || DEFAULT_CONTACT_CONTENT.contactDetails.phone.label,
        value: existingContent.contactDetails?.phone?.value || DEFAULT_CONTACT_CONTENT.contactDetails.phone.value,
        tel: existingContent.contactDetails?.phone?.tel || DEFAULT_CONTACT_CONTENT.contactDetails.phone.tel,
      },
      email: {
        label: existingContent.contactDetails?.email?.label || DEFAULT_CONTACT_CONTENT.contactDetails.email.label,
        value: existingContent.contactDetails?.email?.value || DEFAULT_CONTACT_CONTENT.contactDetails.email.value,
      },
      hours: {
        label: existingContent.contactDetails?.hours?.label || DEFAULT_CONTACT_CONTENT.contactDetails.hours.label,
        value: existingContent.contactDetails?.hours?.value || DEFAULT_CONTACT_CONTENT.contactDetails.hours.value,
      },
    },
    contactForm: {
      heading: existingContent.contactForm?.heading || DEFAULT_CONTACT_CONTENT.contactForm.heading,
      fields: {
        name: {
          label: existingContent.contactForm?.fields?.name?.label || DEFAULT_CONTACT_CONTENT.contactForm.fields.name.label,
          placeholder: existingContent.contactForm?.fields?.name?.placeholder || DEFAULT_CONTACT_CONTENT.contactForm.fields.name.placeholder,
        },
        phone: {
          label: existingContent.contactForm?.fields?.phone?.label || DEFAULT_CONTACT_CONTENT.contactForm.fields.phone.label,
          placeholder: existingContent.contactForm?.fields?.phone?.placeholder || DEFAULT_CONTACT_CONTENT.contactForm.fields.phone.placeholder,
        },
        email: {
          label: existingContent.contactForm?.fields?.email?.label || DEFAULT_CONTACT_CONTENT.contactForm.fields.email.label,
          placeholder: existingContent.contactForm?.fields?.email?.placeholder || DEFAULT_CONTACT_CONTENT.contactForm.fields.email.placeholder,
        },
        subject: {
          label: existingContent.contactForm?.fields?.subject?.label || DEFAULT_CONTACT_CONTENT.contactForm.fields.subject.label,
          options: existingContent.contactForm?.fields?.subject?.options || DEFAULT_CONTACT_CONTENT.contactForm.fields.subject.options,
        },
        message: {
          label: existingContent.contactForm?.fields?.message?.label || DEFAULT_CONTACT_CONTENT.contactForm.fields.message.label,
          placeholder: existingContent.contactForm?.fields?.message?.placeholder || DEFAULT_CONTACT_CONTENT.contactForm.fields.message.placeholder,
        },
      },
      submitButtonText: existingContent.contactForm?.submitButtonText || DEFAULT_CONTACT_CONTENT.contactForm.submitButtonText,
      successMessage: existingContent.contactForm?.successMessage || DEFAULT_CONTACT_CONTENT.contactForm.successMessage,
      noteMessage: existingContent.contactForm?.noteMessage || DEFAULT_CONTACT_CONTENT.contactForm.noteMessage,
    },
    mapEmbed: {
      title: existingContent.mapEmbed?.title || DEFAULT_CONTACT_CONTENT.mapEmbed.title,
      embedUrl: existingContent.mapEmbed?.embedUrl || DEFAULT_CONTACT_CONTENT.mapEmbed.embedUrl,
    },
    cta: {
      eyebrow: existingContent.cta?.eyebrow || DEFAULT_CONTACT_CONTENT.cta.eyebrow,
      heading: existingContent.cta?.heading || DEFAULT_CONTACT_CONTENT.cta.heading,
      body: existingContent.cta?.body || DEFAULT_CONTACT_CONTENT.cta.body,
      buttons: {
        primary: {
          text: existingContent.cta?.buttons?.primary?.text || DEFAULT_CONTACT_CONTENT.cta.buttons.primary.text,
          url: existingContent.cta?.buttons?.primary?.url || DEFAULT_CONTACT_CONTENT.cta.buttons.primary.url,
        },
        secondary: {
          text: existingContent.cta?.buttons?.secondary?.text || DEFAULT_CONTACT_CONTENT.cta.buttons.secondary.text,
          url: existingContent.cta?.buttons?.secondary?.url || DEFAULT_CONTACT_CONTENT.cta.buttons.secondary.url,
        },
      },
    },
    seo: {
      title: existingContent.seo?.title || DEFAULT_CONTACT_CONTENT.seo.title,
      description: existingContent.seo?.description || DEFAULT_CONTACT_CONTENT.seo.description,
      keywords: existingContent.seo?.keywords || DEFAULT_CONTACT_CONTENT.seo.keywords,
    },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Page Editor</h1>
        <p className="mt-1 text-sm text-gray-600">
          Edit all contact page content including hero, contact details, form fields, map embed, and CTA.
        </p>
      </div>

      <ContactPageEditor initialContent={content} />
    </div>
  );
}
