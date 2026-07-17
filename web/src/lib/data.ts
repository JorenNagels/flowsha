// All site content lives here so copy can be edited without touching components.

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: '/about/', label: 'About' },
  { href: '/workshops/', label: 'Workshops' },
  { href: '/shop/', label: 'Hoop Shop' },
  { href: '/contact/', label: 'Contact' },
];

// --- Imagery (web-sized files produced by scripts/prep-images.mjs) ---
export const heroImage = '/images/gallery/hoop-09.jpg';
export const aboutImage = '/images/gallery/hoop-06.jpg';

// Per-page feature images to break up the text-heavy pages.
export const workshopImage = '/images/gallery/hoop-05.jpg';
export const workshopBannerImage = '/images/gallery/hoop-14.jpg';
export const shopImage = '/images/gallery/hoop-02.jpg';
export const contactImage = '/images/gallery/hoop-16.jpg';

export type GalleryImage = { src: string; alt: string };

export const galleryImages: GalleryImage[] = [
  {
    src: '/images/gallery/hoop-09.jpg',
    alt: 'Hooper mid-flow with two hoops in a studio glowing with colourful LED light',
  },
  {
    src: '/images/gallery/hoop-08.jpg',
    alt: 'Flowsha workshop group passing and spinning hoops together under LED lights',
  },
  {
    src: '/images/gallery/hoop-06.jpg',
    alt: 'Osha laughing with her arms open during a hula hoop workshop',
  },
  {
    src: '/images/gallery/hoop-12.jpg',
    alt: 'Circle of hoopers mid-flow under colourful studio lighting',
  },
  {
    src: '/images/gallery/hoop-07.jpg',
    alt: 'Osha smiling as she demonstrates a hoop move during a Flowsha class',
  },
  {
    src: '/images/gallery/hoop-11.jpg',
    alt: 'Group of hoopers raising their hoops overhead in a relaxed evening class',
  },
  {
    src: '/images/gallery/hoop-10.jpg',
    alt: 'Hoopers reaching out with their hoops during a LED-lit group class',
  },
  {
    src: '/images/gallery/hoop-13.jpg',
    alt: 'Workshop attendees reaching up with their hoops in a LED-lit studio',
  },
  {
    src: '/images/gallery/hoop-05.jpg',
    alt: 'Osha smiling during a relaxed, beginner-friendly Flowsha hoop class',
  },
  {
    src: '/images/gallery/hoop-14.jpg',
    alt: 'Energetic group hula hoop session in full flow',
  },
  {
    src: '/images/gallery/hoop-15.jpg',
    alt: 'Hooper framed by a spinning hula hoop in soft purple light',
  },
  {
    src: '/images/gallery/hoop-02.jpg',
    alt: 'Student passing a pair of handmade hoops during a Flowsha workshop',
  },
  {
    src: '/images/gallery/hoop-16.jpg',
    alt: 'Osha smiling with a student during a hands-on hula hoop session',
  },
  {
    src: '/images/gallery/hoop-17.jpg',
    alt: 'Hoopers exploring movement together in a colourfully lit studio',
  },
  {
    src: '/images/gallery/hoop-03.jpg',
    alt: 'Hooper smiling as he plays with a hoop in a warm, sunlit room',
  },
  {
    src: '/images/gallery/hoop-04.jpg',
    alt: 'Hooper spinning a hoop around his hand in a bright, orange-walled studio',
  },
  {
    src: '/images/gallery/hoop-18.jpg',
    alt: 'Flowsha workshop group holding their hoops up for a group photo',
  },
  {
    src: '/images/gallery/hoop-19.jpg',
    alt: 'Smiling group of hoopers gathered with their colourful hoops after a class',
  },
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

// --- Client feedback survey -------------------------------------------------
// Powers the hidden /feedback page (noindex). Copy lives here; FeedbackForm
// renders one question per step based on `kind`. Submissions are stored in
// DynamoDB via POST /feedback — see lambda/src/lib/db.ts.

export type FeedbackScaleQuestion = {
  kind: 'scale';
  key: 'difficulty' | 'supported';
  question: string;
  help?: string;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
};

export type FeedbackTextQuestion = {
  kind: 'text';
  key: 'improvements';
  question: string;
  help?: string;
  placeholder?: string;
};

export type FeedbackChoiceQuestion = {
  kind: 'single';
  key: 'source' | 'learningStyle' | 'courseInterest' | 'groupChat';
  // When set, an "Other" option reveals a free-text field stored under this key.
  otherKey?: 'sourceOther' | 'learningStyleOther';
  question: string;
  help?: string;
  options: { value: string; label: string }[];
};

export type FeedbackScheduleQuestion = {
  kind: 'schedule';
  key: 'preferredSlots';
  noteKey: 'convenienceNote';
  question: string;
  help?: string;
  days: { value: string; label: string }[];
  times: { value: string; label: string }[];
  notePlaceholder?: string;
};

export type FeedbackQuestion =
  | FeedbackScaleQuestion
  | FeedbackTextQuestion
  | FeedbackChoiceQuestion
  | FeedbackScheduleQuestion;

const feedbackDays = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

const feedbackTimes = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

export const feedbackQuestions: FeedbackQuestion[] = [
  {
    kind: 'scale',
    key: 'difficulty',
    question: 'How would you rate the difficulty level of the class you attended?',
    min: 1,
    max: 10,
    minLabel: 'Very easy',
    maxLabel: 'Very challenging',
  },
  {
    kind: 'schedule',
    key: 'preferredSlots',
    noteKey: 'convenienceNote',
    question: 'How well do the current class times fit around your week?',
    help: 'Tap any days and times that would suit you better. Pick as many as you like.',
    days: feedbackDays,
    times: feedbackTimes,
    notePlaceholder: 'Anything else about timing you’d like me to know? (optional)',
  },
  {
    kind: 'text',
    key: 'improvements',
    question: 'Is there anything you’d change, or would like more of, in the class?',
    placeholder: 'Share as much or as little as you like…',
  },
  {
    kind: 'single',
    key: 'source',
    otherKey: 'sourceOther',
    question: 'Where did you find out about this class?',
    options: [
      { value: 'instagram', label: 'Instagram' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'friend', label: 'A friend / word of mouth' },
      { value: 'event', label: 'A local event or festival' },
      { value: 'google', label: 'Google / web search' },
      { value: 'flyer', label: 'A flyer or poster' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    kind: 'single',
    key: 'learningStyle',
    otherKey: 'learningStyleOther',
    question:
      'Do you prefer learning tricks and choreography, or more flowy movement and guided exploration?',
    options: [
      { value: 'tricks', label: 'Tricks & choreography' },
      { value: 'flow', label: 'Flowy movement & guided exploration' },
      { value: 'mix', label: 'A mix of both' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    kind: 'scale',
    key: 'supported',
    question: 'How supported did you feel in the class?',
    min: 1,
    max: 10,
    minLabel: 'Not supported',
    maxLabel: 'Fully supported',
  },
  {
    kind: 'single',
    key: 'courseInterest',
    question:
      'Would you be interested in a weekly hoop course? Each week we’d focus on something new and build up to a final choreography that brings it all together.',
    options: [
      { value: 'yes', label: 'Yes, I’d love that' },
      { value: 'maybe', label: 'Maybe / tell me more' },
      { value: 'no', label: 'Not for me' },
    ],
  },
  {
    kind: 'single',
    key: 'groupChat',
    question: 'Would you like to join my hula hoop community group chat?',
    options: [
      { value: 'yes', label: 'Yes please' },
      { value: 'no', label: 'No thanks' },
    ],
  },
];

// --- Privacy policy ---------------------------------------------------------
// Plain-English notice covering the contact form and the Cloudflare Turnstile
// spam protection. Edit the copy here. NOTE: this is a practical, good-faith
// notice — not legal advice. Have it reviewed before relying on it for a
// business that takes bookings or payments. Update `updated` when you edit.
export type PrivacySection = {
  heading: string;
  body: string[];
  list?: string[];
  // Optional outbound link rendered after the section (e.g. a processor's own policy).
  link?: { before?: string; label: string; href: string; after?: string };
};

export const privacyPolicy: {
  updated: string;
  intro: string[];
  sections: PrivacySection[];
} = {
  updated: '9 June 2026',
  intro: [
    'Flowsha (“we”, “us”) is run by Osha and based in Southampton, Hampshire. This page explains what personal information we collect through this website, why we collect it, and what rights you have. For anything to do with your data, email us at hello@flowsha.co.uk.',
    'We keep this short and honest: this is a small business website. We only collect what we need to reply to you and to keep the contact form free of spam.',
  ],
  sections: [
    {
      heading: 'What we collect',
      body: ['We collect personal information in two ways:'],
      list: [
        'When you use the contact form — your name, email address, the type of enquiry, an optional preferred date, and the message you write. You choose what to put in the message.',
        'Spam protection (Cloudflare Turnstile) — to tell real visitors apart from bots, our form uses Cloudflare Turnstile, which processes your IP address and some technical signals from your browser (such as a TLS fingerprint and the user-agent string). These signals are strictly necessary to block spam and are not used to identify you or to track you across other websites.',
      ],
      link: {
        before: 'For full detail on what Turnstile collects, see ',
        label: 'Cloudflare’s Turnstile Privacy Policy',
        href: 'https://www.cloudflare.com/turnstile-privacy-policy/',
        after: '.',
      },
    },
    {
      heading: 'Why we use it, and our lawful basis',
      body: ['We use this information to:'],
      list: [
        'Read and reply to your enquiry and, where relevant, take steps to arrange a workshop, performance or hoop order (our legitimate interest in responding to you, and to take steps towards a possible agreement).',
        'Protect the contact form from spam and abuse (our legitimate interest in keeping the site secure and usable).',
      ],
    },
    {
      heading: 'Who handles it for us',
      body: [
        'We don’t sell your information or use it for advertising. We rely on a few trusted providers who process data on our behalf:',
      ],
      list: [
        'Amazon Web Services (AWS) — hosts the website and sends our enquiry emails, in their London (UK) region.',
        'Cloudflare — provides the Turnstile spam protection on the form.',
        'Zoho Mail — the mailbox where your enquiry arrives so we can reply.',
      ],
    },
    {
      heading: 'International transfers',
      body: [
        'Some of these providers may process data outside the UK. Where that happens, it is covered by appropriate safeguards (such as the UK’s International Data Transfer Agreement or Standard Contractual Clauses) so your information stays protected.',
      ],
    },
    {
      heading: 'Cookies',
      body: [
        'We don’t use advertising or analytics cookies, so there’s no cookie banner. Cloudflare Turnstile may set a strictly-necessary cookie purely to carry out its bot check — this kind of cookie doesn’t require your consent under UK rules.',
      ],
    },
    {
      heading: 'How long we keep it',
      body: [
        'We keep enquiry emails for as long as we need them to deal with your enquiry and to keep reasonable records, and then delete them. The technical signals used for spam protection are short-lived and handled by Cloudflare as part of the bot check.',
      ],
    },
    {
      heading: 'Your rights',
      body: [
        'You have the right to ask for a copy of the information we hold about you, to have it corrected or deleted, and to object to how we use it. To do any of these, just email hello@flowsha.co.uk and we’ll help.',
      ],
    },
    {
      heading: 'Complaints',
      body: [
        'If you’re unhappy with how we’ve handled your information, please tell us first so we can put it right. You also have the right to complain to the UK’s Information Commissioner’s Office (ICO) at ico.org.uk.',
      ],
    },
    {
      heading: 'Changes to this policy',
      body: [
        'If we change how we handle your information, we’ll update this page and the date shown at the top.',
      ],
    },
  ],
};
