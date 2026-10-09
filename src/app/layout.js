import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import CursorFollower from "@/components/motion/CursorFollower";
import { restaurant } from "@/data/restaurant";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://jbcharcoalgrill.example"),
  title: {
    default: `${restaurant.name} | Dandenong`,
    template: `%s | ${restaurant.name}`,
  },
  description:
    "Balkan-inspired charcoal grill and whole burek in Dandenong. Cevapi, pljeskavica burgers, sausages and golden burek.",
  keywords: [
    "JB Charcoal Grill & Burek",
    "Burek Dandenong",
    "Cevapi",
    "pljeskavica",
    "Balkan food Dandenong",
    "charcoal grill Victoria",
  ],
  openGraph: {
    title: `${restaurant.name} | Dandenong`,
    description:
      "Charcoal-grilled Balkan favourites and golden, flaky burek on Stud Road, Dandenong.",
    type: "website",
    locale: "en_AU",
    siteName: restaurant.name,
    images: [
      {
        url: "/images/hero-grill.webp",
        width: 1600,
        height: 1067,
        alt: "Charcoal-grilled meats — representative imagery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: restaurant.name,
    description:
      "Charcoal-grilled Balkan favourites and whole burek in Dandenong.",
    images: ["/images/hero-grill.webp"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: restaurant.name,
  image: "/images/hero-grill.webp",
  telephone: restaurant.phone.display,
  servesCuisine: ["Balkan", "Grill", "European"],
  address: {
    "@type": "PostalAddress",
    streetAddress: restaurant.address.line1,
    addressLocality: "Dandenong",
    addressRegion: "VIC",
    postalCode: "3175",
    addressCountry: "AU",
  },
  url: "https://jbcharcoalgrill.example",
  menu: restaurant.links.uberEats,
  sameAs: [restaurant.links.maps, restaurant.links.uberEats],
  openingHoursSpecification: restaurant.hours
    .filter((h) => !h.closed)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      opens: "10:00",
      closes: "17:00",
    })),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-surface-a text-smoke antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}
