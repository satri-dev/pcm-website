export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: "Pokhara College of Management",
    alternateName: "PCM",
    url: "https://www.pcm.edu.np/",
    logo: "https://www.pcm.edu.np/images/pcm-logo.svg",
    image: "https://www.pcm.edu.np/images/pcm-logo.svg",
    description: "Pokhara College of Management — affordable, quality management and IT education in Pokhara. BBA, BBA-Finance and BCSIT degrees affiliated to Pokhara University.",
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
    url: "https://www.pcm.edu.np/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.pcm.edu.np/search?q={search_term_string}",
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
    url: "https://www.pcm.edu.np/",
    logo: "https://www.pcm.edu.np/images/pcm-logo.svg",
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
          description: "4-year undergraduate program in IT and computer systems",
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

export function BreadcrumbSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.pcm.edu.np/",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
