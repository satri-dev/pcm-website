import { FacebookIcon, LinkedInIcon, WhatsAppIcon } from "./icons";

const LINKS = [
  { href: "https://www.facebook.com/239069093193587", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.linkedin.com/", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "https://wa.me/97761544761", label: "WhatsApp", Icon: WhatsAppIcon },
];

export function SocialLinks() {
  return (
    <>
      {LINKS.map(({ href, label, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener" aria-label={label}>
          <Icon />
        </a>
      ))}
    </>
  );
}
