import { getAboutSettings } from "@/lib/data/about-page-settings";
import { getAboutTestimonials } from "@/lib/data/testimonials";
import AboutClient from "./AboutClient";

export default async function AboutServer() {
  const [settings, testimonials] = await Promise.all([
    getAboutSettings(),
    getAboutTestimonials(),
  ]);
  return (
    <AboutClient settings={settings} testimonials={testimonials} />
  );
}
