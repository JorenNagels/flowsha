// All site content lives here so copy can be edited without touching components.

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: '/about/', label: 'About' },
  { href: '/workshops/', label: 'Workshops' },
  { href: '/performances/', label: 'Performances' },
  { href: '/shop/', label: 'Hoop Shop' },
  { href: '/contact/', label: 'Contact' },
];

// --- Imagery (web-sized files produced by scripts/prep-images.mjs) ---
export const heroImage = '/images/gallery/hoop-08.jpg';
export const aboutImage = '/images/gallery/hoop-19.jpg';

export type GalleryImage = { src: string; alt: string };

export const galleryImages: GalleryImage[] = [
  {
    src: '/images/gallery/hoop-08.jpg',
    alt: 'Hooper spinning two hoops in a studio glowing with colourful LED light',
  },
  {
    src: '/images/gallery/hoop-02.jpg',
    alt: 'Flowsha workshop group practising hoop moves together',
  },
  {
    src: '/images/gallery/hoop-05.jpg',
    alt: 'Hula hoop class lit with warm pink and orange light',
  },
  {
    src: '/images/gallery/hoop-07.jpg',
    alt: 'Participant learning a hoop trick during a Flowsha workshop',
  },
  {
    src: '/images/gallery/hoop-11.jpg',
    alt: 'Circle of hoopers passing and spinning hoops in a relaxed class',
  },
  { src: '/images/gallery/hoop-12.jpg', alt: 'Hoopers mid-flow under colourful studio lighting' },
  {
    src: '/images/gallery/hoop-13.jpg',
    alt: 'Group hooping session with dancers exploring movement',
  },
  {
    src: '/images/gallery/hoop-15.jpg',
    alt: 'Workshop attendees practising hoop flow side by side',
  },
  {
    src: '/images/gallery/hoop-16.jpg',
    alt: 'Hooper framed by a hula hoop during a Flowsha class',
  },
  { src: '/images/gallery/hoop-17.jpg', alt: 'Energetic hula hoop class in full flow' },
  {
    src: '/images/gallery/hoop-18.jpg',
    alt: 'Dancers moving with hoops in a colourfully lit studio',
  },
  { src: '/images/gallery/hoop-06.jpg', alt: 'Close-up of a hooper finding their flow in class' },
];

// --- Testimonials ---
export type Testimonial = { name: string; quote: string };

export const testimonials: Testimonial[] = [
  {
    name: 'Frankie',
    quote:
      "I wasn't entirely sure what I expected from the class going into it… but it was so much fun and actually more challenging than expected, which was really cool. The class was so relaxed, and I never felt embarrassed by any mistakes at all, just lots of laughs and learning. Would recommend.",
  },
  {
    name: 'Mariah',
    quote:
      'I really enjoyed the hula hoop workshop, learning tricks and flow. Osha is a great teacher who helps you pick up things quite quickly and allows creativity through play.',
  },
  {
    name: 'Ari',
    quote:
      "Osha's introductory class to hula hoop was an amazing time. She created a space that was welcoming and friendly. I had lots of fun and enjoyed exploring my own creativity, whilst also having a routine to refer to if needed. Her passion flows in the room! Really feels like you can learn something from the very first time. Plus, the price was absolutely fair for such a comprehensive workshop. I'd really recommend this to anyone.",
  },
  {
    name: 'Hannah',
    quote:
      'I really enjoyed Osha’s hula hoop class. Osha had a lovely relaxed manner that made everyone feel comfortable and encouraged to give things a go. The session was well structured, with a good balance of hoop theory and practical activities, and the tips and guidance throughout were really helpful. I came away feeling more confident and having learned some useful new skills.',
  },
  {
    name: 'Amy',
    quote:
      'I was unsure how much hula hoop I would be able to do with no prior experience, but the workshop was just the right balance of challenging and achievable, with a clear progression from one skill to the next. Osha fostered a friendly environment that was very supportive of mistakes. I never once felt stupid for sending my hoop flying across the studio! I really loved the experience and would absolutely attend again.',
  },
  {
    name: 'Alex',
    quote:
      "Osha's hoop class was so much fun. The atmosphere was really friendly and I learnt some new things. As someone with an intermediate skill level, I found it very helpful to be shown new tricks and combos. I'm sure anyone at any level could benefit from the class. I found it inspiring.",
  },
];

// --- About (verbatim from the brand brief, split into paragraphs) ---
export const aboutParagraphs: string[] = [
  'Welcome! My name is Osha and I am the face behind Flowsha. What started as a simple curiosity during the uncertainty of the 2020 pandemic soon became a way of moving through life. After first discovering hooping at a festival, I eventually bought my own hoop and began exploring movement as a personal practice, a way to play, create, and stay connected to myself during a time of isolation.',
  'As my hoop journey grew, so did my love for movement. I spent countless hours exploring new tricks and movement styles, attending classes, connecting with other flow artists, and discovering the joy that comes from moving freely. The more I explored, the more I saw movement’s ability to bring people together, build confidence, spark creativity, and create genuine moments of joy.',
  'The thing that keeps me coming back to hooping is the feeling of flow itself. For me, flow is that sweet spot between effort and ease. It’s the experience of being fully present, having awareness of your body, responding in the moment, and allowing movement to unfold naturally. It’s playful, grounding, challenging, and deeply rewarding all at once.',
  'Through Flowsha, I aim to create welcoming spaces where people can experience that feeling for themselves and be comfortable enough to experiment, express themselves and surrender to what feels good, whilst discovering the endless possibilities that these plastic circles have to offer! Whether you’re picking up a hoop for the first time or exploring new ways to move and express yourself, my workshops are designed to be relaxed, supportive, and full of curiosity.',
  'No experience, coordination, or any pressure to be good required. Just curiosity and a willingness to play.',
];

// --- Workshops & pricing ---
export type Price = { name: string; duration: string; price: string; note?: string };

export const groupWorkshop: Price = {
  name: 'Group Workshop',
  duration: '1.5 hours',
  price: '£15',
  note: 'per person',
};

export const privateLessons: Price[] = [
  { name: 'Private Lesson', duration: '30 minutes', price: '£30' },
  { name: 'Private Lesson', duration: '1 hour', price: '£50' },
  { name: 'Private Lesson', duration: '1.5 hours', price: '£65' },
];

export type WorkshopType = { title: string; blurb: string };

export const workshopTypes: WorkshopType[] = [
  {
    title: 'Beginner Workshops',
    blurb:
      'Never picked up a hoop? Start here. We cover the basics, get the hoop spinning, and have a good laugh when it goes flying. No experience needed.',
  },
  {
    title: 'Intermediate Workshops',
    blurb:
      'Already got the basics down? We work on new tricks, transitions and combos so you’ve got more to play with.',
  },
  {
    title: 'Private Lessons',
    blurb:
      'Just you and me, working on whatever you want, whether that’s your first spin or smoothing out tricks you already know. We go at your pace.',
  },
  {
    title: 'Festival Workshops',
    blurb:
      'Drop-in sessions for festivals and events. Easy to join, and people usually stay far longer than they meant to.',
  },
  {
    title: 'Retreats & Wellness Events',
    blurb:
      'Hooping for retreats and wellness days. A slower, more meditative way to move that’s surprisingly easy to get lost in.',
  },
];

// --- Hoop Shop (static catalogue for now; ordering comes later) ---
export type ShopCategory = { title: string; blurb: string };

export const shopCategories: ShopCategory[] = [
  {
    title: 'Beginner Hoops',
    blurb:
      'Bigger and heavier, so they spin slowly and stay up more easily. A good place to start.',
  },
  {
    title: 'Intermediate Hoops',
    blurb: 'Lighter and faster, for when you want to push your tricks a bit further.',
  },
  {
    title: 'Kids’ Hoops',
    blurb: 'Light, bright and sized for smaller hands.',
  },
  {
    title: 'Dance Hoops',
    blurb: 'Balanced and smooth, made for on-body flow and dancing.',
  },
  {
    title: 'Custom Hoops',
    blurb: 'Pick the size, weight, tape and colours, and I’ll make it to suit you.',
  },
  {
    title: 'Accessories',
    blurb: 'Grip tape, spare sections, hoop bags and the bits that keep you going.',
  },
  {
    title: 'Re-taping',
    blurb: 'Send me a tired hoop and I’ll re-tape it so it looks and feels new again.',
  },
];

// --- Performances ---
export type PerformanceType = { title: string; blurb: string };

export const performanceTypes: PerformanceType[] = [
  {
    title: 'LED Hoop Shows',
    blurb: 'Glowing hoops for after dark. Good for evening events and parties.',
  },
  {
    title: 'Fire Performance',
    blurb: 'Fire hooping, for when you want something with a bit more heat to it.',
  },
  {
    title: 'Daytime Acts',
    blurb: 'Daytime sets and walkabout flow that pull a crowd and keep things lively.',
  },
];

// --- Calls to action (labels from the brand brief) ---
export const ctas = {
  bookWorkshop: { label: 'Book a workshop', href: '/workshops/' },
  shopHoops: { label: 'Shop hoops', href: '/shop/' },
  workWithMe: { label: 'Work with me', href: '/contact/' },
  performanceEnquiry: {
    label: 'Performance booking enquiries',
    href: '/contact/?type=performance',
  },
  contact: { label: 'Contact me', href: '/contact/' },
} as const;
