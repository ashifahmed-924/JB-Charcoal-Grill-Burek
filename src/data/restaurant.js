export const restaurant = {
  name: "JB Charcoal Grill & Burek",
  shortName: "JB Charcoal Grill & Burek",
  tagline: "Charcoal • Burek • Balkan",
  cuisine: "Balkan-inspired charcoal grill and burek",
  address: {
    line1: "Shop 5, 30 Stud Road",
    line2: "Dandenong VIC 3175",
    country: "Australia",
    full: "Shop 5, 30 Stud Road, Dandenong VIC 3175, Australia",
  },
  phone: {
    display: "+61 3 9794 0909",
    tel: "+61397940909",
  },
  links: {
    maps: "https://www.google.com/maps/place/JB+Charcoal+Grill+%26+Burek/",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Shop+5,+30+Stud+Road,+Dandenong+VIC+3175",
    uberEats:
      "https://www.ubereats.com/au/store/jb-charcoal-grill-%26-burek/lBRYX9qfVdaReL6T6lx5Bg",
    menuReference: "https://restaurantguru.com/JB-Charcoal-Grill-Dandenong/menu",
  },
  /**
   * Replace href values with the restaurant’s live profile URLs when confirmed.
   */
  social: [
    {
      id: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/",
    },
    {
      id: "twitter",
      label: "X (Twitter)",
      href: "https://twitter.com/",
    },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://www.youtube.com/",
    },
  ],
  /**
   * Hours sourced from public listings (AGFG / Waze). Confirm before publishing.
   */
  hoursNote:
    "Hours shown from public listings and may change. Please confirm before visiting.",
  hours: [
    { day: "Monday", open: null, close: null, closed: true },
    { day: "Tuesday", open: "10:00 AM", close: "5:00 PM", closed: false },
    { day: "Wednesday", open: "10:00 AM", close: "5:00 PM", closed: false },
    { day: "Thursday", open: "10:00 AM", close: "5:00 PM", closed: false },
    { day: "Friday", open: "10:00 AM", close: "5:00 PM", closed: false },
    { day: "Saturday", open: "10:00 AM", close: "5:00 PM", closed: false },
    { day: "Sunday", open: "10:00 AM", close: "5:00 PM", closed: false },
  ],
  nav: [
    { label: "Home", href: "#top" },
    { label: "Menu", href: "#menu" },
    { label: "Our Story", href: "#story" },
    { label: "Gallery", href: "#gallery" },
    { label: "Visit", href: "#visit" },
  ],
};

export const showPrices = true;
