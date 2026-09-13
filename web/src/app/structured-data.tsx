// Environment-driven base URL helper
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

const BASE_URL = getBaseUrl();

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: "Pokhara College of Management",
    alternateName: "PCM",
    url: `${BASE_URL}/`,
    logo: `${BASE_URL}/images/pcm-logo.svg`,
    image: `${BASE_URL}/images/pcm-logo.svg`,
    description:
      "Pokhara College of Management — affordable, quality management and IT education in Pokhara. BBA, BBA-Finance and BCSIT degrees affiliated to Pokhara University.",
    telephone: "+977-61-544761",
    email: "info@pcm.edu.np",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gyan Marg, Nadipur",
      addressLocality: "Pokhara",
      addressRegion: "Gandaki",
      postalCode: "33700",
      addressCountry: "NP",
    },
    sameAs: [
      "https://www.facebook.com/239069093193587",
      "https://www.instagram.com/",
      "https://www.linkedin.com/",
    ],
    foundingDate: "2002",
    numberOfStudents: {
      "@type": "QuantitativeValue",
      value: "500+",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pokhara College of Management",
    url: `${BASE_URL}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function EducationalOrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Pokhara College of Management",
    url: `${BASE_URL}/`,
    logo: `${BASE_URL}/images/pcm-logo.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977-61-544761",
      contactType: "Admissions",
      areaServed: "NP",
      availableLanguage: ["English", "Nepali"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gyan Marg, Nadipur",
      addressLocality: "Pokhara",
      addressRegion: "Gandaki",
      postalCode: "33700",
      addressCountry: "NP",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Academic Programs",
      itemListElement: [
        {
          "@type": "Course",
          name: "Bachelor in Business Administration (BBA)",
          description: "4-year undergraduate program in business management",
          provider: {
            "@type": "Organization",
            name: "Pokhara College of Management",
          },
        },
        {
          "@type": "Course",
          name: "Bachelor in Business Administration - Finance (BBA-Finance)",
          description: "4-year undergraduate program focused on finance",
          provider: {
            "@type": "Organization",
            name: "Pokhara College of Management",
          },
        },
        {
          "@type": "Course",
          name: "Bachelor in Computer System & Information Technology (BCSIT)",
          description:
            "4-year undergraduate program in IT and computer systems",
          provider: {
            "@type": "Organization",
            name: "Pokhara College of Management",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items?: Array<{ name: string; url: string }>;
}) {
  const defaultItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${BASE_URL}/`,
    },
  ];

  const breadcrumbItems = items
    ? items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${BASE_URL}${item.url}`,
      }))
    : defaultItems;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
