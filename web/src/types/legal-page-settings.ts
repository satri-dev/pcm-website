export interface LegalPageSection {
  heading: string;
  body: string;
}

export interface LegalPageSettings {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  lastUpdated: string;
  sections: LegalPageSection[];
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const TERMS_PAGE_SETTINGS_KEY = "terms_page";
export const PRIVACY_PAGE_SETTINGS_KEY = "privacy_page";

export const TERMS_PAGE_SETTINGS_DEFAULTS: LegalPageSettings = {
  seoTitle: "Terms & Services | Pokhara College of Management",
  seoDescription:
    "Terms and services governing the use of the Pokhara College of Management website, admissions, communications and online tools.",
  heroTitle: "Terms & Services",
  heroSubtitle:
    "Please read these terms carefully before using the Pokhara College of Management website.",
  lastUpdated: "August 2026",
  sections: [
    {
      heading: "1. Acceptance of Terms",
      body: 'By accessing this website you agree to be bound by these Terms and our <a href="/privacy" class="text-pcm-blue hover:underline">Privacy Policy</a>. If you do not agree with any part of these Terms, please do not use the website.',
    },
    {
      heading: "2. Use of the Website",
      body: "<ul><li>You may use the website for lawful, personal and educational purposes only.</li><li>You must not attempt to disrupt, overload, or gain unauthorised access to any part of the website.</li><li>You must not copy, republish or redistribute website content for commercial purposes without prior written permission.</li></ul>",
    },
    {
      heading: "3. Admissions and Applications",
      body: "Information on this website about programs, eligibility, entrance examinations, deadlines and scholarships is provided for guidance. PCM reserves the right to modify admission criteria, schedules and seat availability as required by the college and Pokhara University. Formal application is only complete once submitted through the official admission process and verified by the college.",
    },
    {
      heading: "4. Accuracy of Information",
      body: 'We strive to keep all information accurate and current. However, programs, fees, faculty and dates may change. For official confirmation of any detail, please contact the college at <a href="mailto:info@pcm.edu.np" class="text-pcm-blue hover:underline">info@pcm.edu.np</a> or call <a href="tel:061544761" class="text-pcm-blue hover:underline">(061) 544761</a>.',
    },
    {
      heading: "5. Intellectual Property",
      body: "All content on this website, including text, graphics, logos, images and software, is the property of PCM or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute or create derivative works from the content except for personal, non-commercial use.",
    },
    {
      heading: "6. Online Tools",
      body: "The GPA converter and Nepali–English converter are provided as convenience tools. Results are indicative only and should not be treated as official academic records. PCM accepts no liability for decisions made based on these tools.",
    },
    {
      heading: "7. External Links",
      body: "The website may contain links to external websites. PCM is not responsible for the content or privacy practices of external sites, and their inclusion does not imply endorsement.",
    },
    {
      heading: "8. Limitation of Liability",
      body: "To the maximum extent permitted by law, PCM shall not be liable for any direct, indirect, incidental or consequential damages arising from your use of, or inability to use, the website, its content, or any online tool.",
    },
    {
      heading: "9. Changes to These Terms",
      body: "We may update these Terms from time to time. The latest version will always be published on this page, and continued use of the website after changes means you accept the updated Terms.",
    },
    {
      heading: "10. Contact Us",
      body: 'If you have questions about these Terms, contact us at <a href="mailto:info@pcm.edu.np" class="text-pcm-blue hover:underline">info@pcm.edu.np</a>, call <a href="tel:061544761" class="text-pcm-blue hover:underline">(061) 544761</a>, or visit us at Gyan Marg, Nadipur, Pokhara-2, Kaski, Nepal.',
    },
  ],
  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "Ready to join the PCM family?",
  ctaText: "Applications for the 2083 intake are open across all three programs.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryHref: "/contact",
};

export const PRIVACY_PAGE_SETTINGS_DEFAULTS: LegalPageSettings = {
  seoTitle: "Privacy Policy | Pokhara College of Management",
  seoDescription:
    "Privacy Policy for the Pokhara College of Management website — how we collect, use and protect your personal information.",
  heroTitle: "Privacy Policy",
  heroSubtitle:
    "Your privacy matters to us. This policy explains what information we collect and how we protect it.",
  lastUpdated: "August 2026",
  sections: [
    {
      heading: "1. Information We Collect",
      body: "<ul><li><strong>Information you provide:</strong> when you contact us, apply for admission, or enquire about programs and scholarships, we may collect your name, contact details, academic background and the contents of your message.</li><li><strong>Usage information:</strong> pages visited, time on site, device and browser type, and general location may be collected automatically to help us improve the website.</li><li><strong>Cookies:</strong> we use cookies and similar technologies to remember preferences (such as dark mode) and to understand how the site is used.</li></ul>",
    },
    {
      heading: "2. How We Use Your Information",
      body: "<ul><li>To respond to your enquiries and provide admission support.</li><li>To share notices, results and important academic updates relevant to you.</li><li>To improve our programs, services and website experience.</li><li>To comply with legal and regulatory obligations.</li></ul>",
    },
    {
      heading: "3. Data Retention",
      body: "We retain personal information only for as long as necessary for the purposes described above, or as required by law. When no longer needed, records are securely deleted or anonymised.",
    },
    {
      heading: "4. How We Protect Your Data",
      body: "We take reasonable technical and organisational measures to safeguard your information against loss, misuse and unauthorised access. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
    },
    {
      heading: "5. Sharing of Information",
      body: "We do not sell or rent your personal information. We may share limited information with Pokhara University and authorised partners where necessary for admission and academic administration, or where required by law.",
    },
    {
      heading: "6. Your Rights",
      body: "You may request access to, correction of, or deletion of your personal information held by us. To make a request, contact us using the details below. We will respond within a reasonable timeframe.",
    },
    {
      heading: "7. Children's Privacy",
      body: "Our website is intended for prospective and current students and their guardians. We do not knowingly collect information from children under 13 without parental consent.",
    },
    {
      heading: "8. External Links",
      body: "Our website may link to external sites. We are not responsible for the privacy practices of those websites and encourage you to review their policies.",
    },
    {
      heading: "9. Changes to This Policy",
      body: "We may update this Privacy Policy from time to time. The latest version will always be available on this page, and significant changes will be notified through our website.",
    },
    {
      heading: "10. Contact Us",
      body: 'For any privacy-related questions or requests, contact us at <a href="mailto:info@pcm.edu.np" class="text-pcm-blue hover:underline">info@pcm.edu.np</a>, call <a href="tel:061544761" class="text-pcm-blue hover:underline">(061) 544761</a>, or write to us at Gyan Marg, Nadipur, Pokhara-2, Kaski, Nepal.',
    },
  ],
  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "Ready to join the PCM family?",
  ctaText: "Applications for the 2083 intake are open across all three programs.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryHref: "/contact",
};
