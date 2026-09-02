// src/types/campus-map-page-settings.ts
// Configurable page chrome for the public /about/campus-map page: SEO, hero,
// explore section head, location split section, and CTA band. The map
// landmarks themselves come from the campus_map collection
// (src/app/admin/campus/campus-map) and are fetched separately — they are NOT
// part of these settings.
// Stored in the site_settings collection under key "campus_map_page".

export interface CampusMapPageSettings {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Explore section head
  exploreEyebrow: string;
  exploreTitle: string;
  exploreSubtitle: string;
  facilitiesButtonLabel: string;
  facilitiesButtonHref: string;

  // Location split
  locationEyebrow: string;
  locationTitle: string;
  locationParagraph: string;
  locationChecklist: string[];
  locationImage: string;
  locationImageAlt: string;
  locationBadgeValue: string;
  locationBadgeLabel: string;
  directionsButtonLabel: string;
  directionsButtonHref: string;

  // CTA Band
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const CAMPUS_MAP_PAGE_SETTINGS_KEY = "campus_map_page";

export const CAMPUS_MAP_PAGE_SETTINGS_DEFAULTS: CampusMapPageSettings = {
  seoTitle: "Campus Map | Pokhara College of Management",
  seoDescription:
    "Interactive campus map of Pokhara College of Management at Nadipur — find the main building, library, IT labs, seminar hall, sports ground and more.",
  seoKeywords: [
    "PCM campus map",
    "Pokhara College of Management Nadipur",
    "PCM landmark map",
    "PCM campus directions",
  ],
  ogImage: "/assets/img/about-2.jpg",

  heroTitle: "Campus Map",
  heroSubtitle:
    "Find your way around the PCM campus — tap a marker to see what's nearby.",

  exploreEyebrow: "Getting around",
  exploreTitle: "Explore the Nadipur campus",
  exploreSubtitle:
    "Click a marker on the map or a place in the list to learn more about each spot.",
  facilitiesButtonLabel: "Browse facilities",
  facilitiesButtonHref: "/about/facility",

  locationEyebrow: "Location",
  locationTitle: "Easy to reach, hard to leave",
  locationParagraph:
    "The PCM campus sits on Gyan Marg at Nadipur — a short ride from Pokhara's Lakeside and Buses Park, with easy access from every part of the city.",
  locationChecklist: [
    "10 minutes from Lakeside by vehicle",
    "Close to Pokhara Buses Park and public transport",
    "Safe neighbourhood with parking nearby",
  ],
  locationImage: "/assets/img/about-2.jpg",
  locationImageAlt: "PCM campus at Nadipur, Pokhara",
  locationBadgeValue: "PU",
  locationBadgeLabel: "Affiliated",
  directionsButtonLabel: "Get Directions",
  directionsButtonHref:
    "https://maps.google.com/?q=Pokhara+College+of+Management+Nadipur",

  ctaTitle: "Come visit us at Nadipur",
  ctaText:
    "Drop by the campus for a tour, or talk to our admissions team about joining the 2083 intake.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryHref: "/contact",
};
