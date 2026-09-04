import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import TestimonialManager from "./_components/testimonial-manager";
import { listTestimonials } from "@/repositories/testimonial.repository";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Testimonials Management",
  description:
    "Review and approve public testimonial submissions for Pokhara College of Management before they appear on the website.",
  robots: { index: false, follow: false },
};

export default async function TestimonialsPage() {
  await connection();
  const { items } = await listTestimonials({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Testimonials" subtitle="Content · Testimonials" />
      <TestimonialManager initialData={items} />
    </>
  );
}
