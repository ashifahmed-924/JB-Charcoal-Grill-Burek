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
  /** Exact Google Maps pin for JB Charcoal Grill & Burek */
  geo: {
    lat: -37.9827409,
    lng: 145.221519,
    placeId: "0x6ad6141c939c8009:0xcbb52ff55aca1526",
  },
  phone: {
    display: "+61 3 9794 0909",
    tel: "+61397940909",
  },
  links: {
    maps: "https://www.google.com/maps/place/JB+Charcoal+Grill+%26+Burek/@-37.9827409,145.221519,17z/data=!3m1!4b1!4m6!3m5!1s0x6ad6141c939c8009:0xcbb52ff55aca1526!8m2!3d-37.9827409!4d145.221519!16s%2Fg%2F11xndv89n",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=-37.9827409,145.221519",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3149.8!2d145.221519!3d-37.9827409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad6141c939c8009%3A0xcbb52ff55aca1526!2sJB%20Charcoal%20Grill%20%26%20Burek!5e0!3m2!1sen!2sau!4v1!5m2!1sen!2sau",
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
