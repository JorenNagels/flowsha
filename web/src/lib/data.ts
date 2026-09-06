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
export const aboutImage = '/images/gallery/hoop-29.jpg';

// Per-page feature images to break up the text-heavy pages.
export const workshopImage = '/images/gallery/hoop-05.jpg';
export const workshopBannerImage = '/images/gallery/hoop-14.jpg';
export const shopImage = '/images/gallery/hoop-21.jpg';
export const contactImage = '/images/gallery/hoop-20.jpg';

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
  {
    src: '/images/gallery/hoop-21.jpg',
    alt: 'Osha laughing in a park with her arms outstretched, holding four colourful hula hoops',
  },
  {
    src: '/images/gallery/hoop-29.jpg',
    alt: 'Osha throwing her arms up mid-performance in golden evening light',
  },
  {
    src: '/images/gallery/hoop-25.jpg',
    alt: 'Osha performing a street hoop act, kicking a leg through a hoop for a seated crowd',
  },
  {
    src: '/images/gallery/hoop-27.jpg',
    alt: 'Performer leaping through a spinning hoop during a lively street performance',
  },
  {
    src: '/images/gallery/hoop-26.jpg',
    alt: 'Hoop performer mid-flow in warm golden light at an outdoor street event',
  },
  {
    src: '/images/gallery/hoop-28.jpg',
    alt: 'Hooper reaching a hoop towards the setting sun across an open field',
  },
  {
    src: '/images/gallery/hoop-22.jpg',
    alt: 'A stack of brightly coloured handmade Flowsha hoops resting on grass at dusk',
  },
  {
    src: '/images/gallery/hoop-24.jpg',
    alt: 'Hooper balancing mid-move with a hoop against a rustic white brick wall',
  },
  {
    src: '/images/gallery/hoop-23.jpg',
    alt: 'Smiling hooper posing with a yellow hoop against a white brick wall',
  },
  {
    src: '/images/gallery/hoop-20.jpg',
    alt: 'Osha chatting with hoopers during a relaxed studio session in warm purple light',
  },
  {
    src: '/images/gallery/hoop-30.jpg',
    alt: 'Hooper performing in front of a projected ocean wave and glowing “Flow State” visuals',
  },
  {
    src: '/images/gallery/hoop-31.jpg',
    alt: 'Flowsha flow performance against a large ocean-wave projection at an evening show',
  },
  {
    src: '/images/gallery/hoop-32.jpg',
    alt: 'Hooper dancing in white against swirling pink and magenta projected light',
  },
  {
    src: '/images/gallery/hoop-01.jpg',
    alt: 'Hooper performing in white against a wall of swirling pink projected light',
  },
  {
    src: '/images/gallery/hoop-34.jpg',
    alt: 'Aerial hoop artist performing inverted in a suspended hoop above a seated audience',
  },
  {
    src: '/images/gallery/hoop-33.jpg',
    alt: 'Aerial hoop performer suspended upside down as a colourfully lit audience watches',
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
  'Welcome! My name is Osha and I am the face behind Flowsha. In the last 6 years hooping has quickly become a way of moving through life for me. Since trying hula hooping for the first time nearly a decade ago, I slowly began exploring movement as a personal practise, using music and my own emotions to guide my expression and curiosity, and most importantly to connect with myself both physically and mentally.',
  'Attending hoop classes, events, and gatherings over the years I have seen the incredible joy that the growing hoop community has spread throughout the world and realised I wanted to be a part of sharing that excitement with others and encouraging people to play with these plastic circles that have brought so much meaning to my own life.',
  'As a former professional dancer and current aerial hoop artist and hula hoop teacher, my obsession with movement and circles never ceases to bore me. My style of teaching is relaxed and playful, utilising music and student’s curiosity to encourage them to explore what feels good and to lean into the types of tricks and movement that delights both their body and brain.',
  'Through Flowsha, I aim to create welcoming spaces where people can feel free to express themselves, experiment, and learn things they would never expect to with a hula hoop! Whether you’re picking up a hoop for the first time or exploring new ways of moving with your hoop/s, my classes are an open door to new experiences.',
  'No experience, coordination, or any pressure to be good required. Just curiosity and a willingness to play!',
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

// --- Hoop Shop ---
//
// The configurable products, option lists and price table live in
// @flowsha/shared, because the Lambda has to re-price every order from exactly
// the same numbers. Only site copy lives here.
//
// `shopCategories` (Beginner / Intermediate / Kids' / Dance / Custom /
// Accessories / Re-taping) was removed when the real shop landed. Note that
// "Kids' Hoops" is deliberately gone and must not come back: marketing a hoop
// for use by under-14s brings it under the Toys (Safety) Regulations 2011, with
// UKCA marking, EN 71 testing and a 10-year technical file attached.

/** Services that are enquiry-only — no configurator, no checkout. */
export type ShopService = { title: string; blurb: string; cta: string; href: string };

export const shopServices: ShopService[] = [
  {
    title: 'Re-taping',
    blurb:
      'Send me a tired hoop and I\u2019ll re-tape it so it looks and feels new again. Cheaper than a new hoop, and kinder to the planet.',
    cta: 'Ask about re-taping',
    href: '/contact/?type=shop',
  },
];

/** Long-form size guidance, shared by /shop/size-guide/ and the configurator. */
export const sizeGuide = {
  intro:
    'Hoop size is mostly about how fast the hoop moves. A bigger hoop turns more slowly, which gives you longer to react \u2014 that is why beginners almost always start big. A smaller hoop moves quickly and suits faster tricks once you have the basics.',
  steps: [
    {
      title: 'Stand it up next to you',
      body: 'Rest the hoop on the floor in front of you. For learning waist hooping, it should reach somewhere between your navel and the middle of your chest.',
    },
    {
      title: 'Go bigger if you are starting out',
      body: 'If you are between two sizes and you are new to hooping, take the larger one. A hoop that is slightly too big is forgiving; one that is too small is genuinely hard to keep up.',
    },
    {
      title: 'Go smaller for tricks',
      body: 'Once waist hooping feels easy, a smaller, lighter hoop opens up hand work, isolations and on-body flow.',
    },
    {
      title: 'Think about the tubing too',
      body: 'Regular 19mm tubing is heavier and slower, so it stays up more easily. Skinny 16mm is lighter and faster, and better suited to dance and trick work.',
    },
  ],
  note: 'Still unsure? Message me your height and what you would like to do with the hoop, and I will tell you what I would make you.',
} as const;

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
      { value: 'beinthesky', label: 'Be In The Sky studio' },
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
      { value: 'maybe', label: 'Maybe' },
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

// --- Waiver (PAR-Q + Informed Consent) --------------------------------------
// Powers the hidden /waiver page (noindex). The signer's typed name + the
// acceptance checkboxes form a simple electronic signature; the Lambda stamps
// an audit trail on submit. Text is verbatim from Osha's paper form.
//
// WAIVER_VERSION identifies the exact wording shown. It MUST stay in sync with
// WAIVER_VERSION in lambda/src/lib/validation.ts — bump BOTH whenever any of the
// clause text below changes, so stored records stay tied to what was signed.
export const WAIVER_VERSION = '2026-07-v1';

export const waiverContent = {
  intro:
    'Please read and complete this PAR-Q and Informed Consent form before your first class. All information you give is kept completely private and confidential under data protection legislation.',
  assumptionOfRisk:
    'I acknowledge that I am voluntarily participating in the fitness class(es) provided by the instructor. I understand that physical exercise, by its very nature, carries with it certain inherent risks, including but not limited to physical injury, strain, discomfort, and even the possibility of serious injury. I hereby assume all risks and responsibility for any such injuries or other medical incidents.',
  medicalRepresentation:
    'I am physically fit to participate in the fitness class(es) and have no medical condition that would prevent my safe participation. If I have any medical conditions or concerns, I have consulted with a healthcare provider and obtained clearance to participate and will inform my instructor if a condition may prevent me from comfortably participating in the class.',
  photoRelease:
    'I hereby grant permission to the instructor to take and use photographs and videos of me for external communications and promotional purposes on social media accounts as well as the company website. I understand I am able to withdraw my consent at any time by informing the instructor prior to the class.',
  informedConsentPoints: [
    'The aim of all classes provided by Flowsha is to improve general fitness, flexibility, mobility, creativity, hand-eye coordination, and to learn new movement skills in a friendly, relaxed environment.',
    'All information given to the instructor is kept completely private and confidential under data protection legislation.',
    'If during the session you experience any significant pain or discomfort, please notify the instructor immediately. All Flowsha classes are structured to minimise risk of injury where possible.',
    'Please ask as many questions as you need in order to further minimise risk to yourself and others in the class as well.',
  ],
  release:
    'I hereby acknowledge that I have read, understood and accurately completed this waiver, and fully understand that it is a release of liability. I confirm that I’m voluntarily engaging in an acceptable level of exercise, and that my participation involves a risk of injury. I agree to notify Flowsha of any changes to the answers above.',
} as const;

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
  updated: '22 August 2026',
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
        'When you buy a hoop — your name, email address, delivery address, what you ordered and the amount paid. Your card details go straight to Stripe and never reach us.',
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
      heading: 'Payments (Stripe)',
      body: [
        'Payments are handled by Stripe Payments UK, Ltd, acting as our processor. When you check out you are taken to a page hosted by Stripe, so your card number is entered on their systems and never touches ours or this website.',
        'Stripe passes back your name, email address, delivery address and the amount paid, so we can make and post your hoop. Stripe also uses the data to prevent fraud, which is their own legal obligation.',
        'Our lawful basis is performance of a contract — we cannot sell you a hoop without it.',
      ],
      link: {
        before: 'Stripe explains what it does with your data in its ',
        label: 'privacy policy',
        href: 'https://stripe.com/gb/privacy',
        after: '.',
      },
    },
    {
      heading: 'How long we keep order information',
      body: [
        'We keep order records for six years after the end of the tax year they fall in, because HMRC requires it of a sole trader.',
        'Order photographs and any messages you send us are deleted once they are no longer needed.',
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

// --- Legal pages for the shop -----------------------------------------------
//
// ⚠️ Written to be honest and specific, but this is NOT legal advice. Have it
// checked — Business Companion (businesscompanion.info) is the free Trading
// Standards route — before taking real money.
//
// Two positions are deliberate and should not be quietly reversed:
//
//  1. The 14-day cancellation right is applied to EVERYTHING, including
//     configured hoops. The Consumer Contracts Regulations exempt goods "made to
//     the consumer's specification", but that exemption does not cover items
//     assembled by combining standard stock options — which is exactly what a
//     dropdown configurator produces. Claiming the exemption and being wrong
//     stretches the cancellation window to twelve months.
//  2. No VAT appears anywhere. Flowsha is a sole trader below the registration
//     threshold, and showing VAT while unregistered is an offence.

export type LegalDocument = { updated: string; intro: string[]; sections: PrivacySection[] };

// ⚠️ PLACEHOLDER — a geographic postal address is legally required to be publicly
// visible, and an email address alone is not enough. Replace before launch.
export const TRADING_ADDRESS = '[TRADING ADDRESS TO BE CONFIRMED], Southampton, United Kingdom';

const LEGAL_UPDATED = '22 August 2026';

export const termsPolicy: LegalDocument = {
  updated: LEGAL_UPDATED,
  intro: [
    'These terms cover hoops bought through this website. Nothing here affects your legal rights as a consumer.',
    `Flowsha is a sole trader business run by Osha, trading from ${TRADING_ADDRESS}. You can reach us at hello@flowsha.co.uk.`,
  ],
  sections: [
    {
      heading: 'Who you are buying from',
      body: [
        `Flowsha is a sole trader, not a limited company, and is not registered for VAT. Prices shown are the final price — there is no VAT to add.`,
        `Trading address: ${TRADING_ADDRESS}. Email: hello@flowsha.co.uk.`,
      ],
    },
    {
      heading: 'How the contract is formed',
      body: [
        'Placing an order is an offer to buy. The contract is formed when you receive the order confirmation email, not when payment is taken.',
        'If something you ordered turns out to be unavailable — a one-off ready-made hoop sold in person at the same moment, for example — we will contact you and refund you in full.',
      ],
    },
    {
      heading: 'Prices and payment',
      body: [
        'Prices are in pounds sterling and include everything except delivery, which is shown separately before you pay.',
        'Payment is taken in full at the time of ordering, through Stripe. We never see or store your card details.',
        'If a price is obviously wrong (a clear mistake rather than a price you simply think is high), we will contact you before making your hoop and you can confirm or cancel.',
      ],
    },
    {
      heading: 'Making your hoop',
      body: [
        'Every hoop is made by hand to order. Expect 3–10 working days before dispatch; we will tell you if it will be longer.',
        'Because tape is applied by hand, small variations between hoops are normal and are not faults. Colours can look slightly different on your screen from how they look in daylight.',
      ],
    },
    {
      heading: 'Your rights if something is wrong',
      body: [
        'Under the Consumer Rights Act 2015 your hoop must be as described, of satisfactory quality and fit for purpose.',
        'If it is faulty you have 30 days to reject it for a full refund. After 30 days, and for six months from delivery, you can ask for a repair or replacement.',
        'This is in addition to the 14-day right to change your mind described in the cancellation policy.',
      ],
      link: {
        before: 'See the full ',
        label: 'returns and cancellations policy',
        href: '/returns/',
        after: '.',
      },
    },
    {
      heading: 'Safety',
      body: [
        'Hoops are exercise equipment for adults and older teenagers. They are not toys and are not designed or intended for use in play by children under 14.',
        'Use your hoop with space around you, away from furniture, people and pets. Fire and LED hoops are not sold through this website.',
        'Stop if anything hurts. If you have an injury or a health condition, check with your GP before starting a new form of exercise.',
      ],
    },
    {
      heading: 'Liability',
      body: [
        'We do not limit our liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot lawfully be limited.',
        'Otherwise, our liability is limited to the price you paid for the hoop. We are not liable for losses that were not foreseeable when the contract was made.',
      ],
    },
    {
      heading: 'Governing law',
      body: [
        'These terms are governed by the law of England and Wales, and disputes may be brought in the courts of England and Wales.',
      ],
    },
  ],
};

export const returnsPolicy: LegalDocument = {
  updated: LEGAL_UPDATED,
  intro: [
    'You can change your mind about a hoop for any reason within 14 days of receiving it — including hoops you configured yourself.',
    'That is on top of your separate rights if a hoop arrives faulty or not as described.',
  ],
  sections: [
    {
      heading: 'The 14-day right to cancel',
      body: [
        'You have 14 days, starting the day after your hoop is delivered, to tell us you want to cancel. You do not have to give a reason.',
        'This applies to every hoop we sell, including made-to-order ones. We have chosen not to rely on the "made to your specification" exemption, because hoops built from standard sizes, tubing and tapes are assembled from stock options rather than genuinely personalised.',
      ],
    },
    {
      heading: 'How to cancel',
      body: [
        'Email hello@flowsha.co.uk with your order number and say you are cancelling. Any clear statement will do — you do not have to use a particular form of words or the model form below.',
        'Model cancellation form: "To Flowsha, hello@flowsha.co.uk. I hereby give notice that I cancel my contract of sale of the following goods: [your order]. Ordered on: [date]. Received on: [date]. Name: [your name]. Address: [your address]. Date: [today]."',
      ],
    },
    {
      heading: 'Sending it back',
      body: [
        'Send the hoop back within 14 days of telling us you are cancelling.',
        'You pay the cost of return postage. Please get a proof of postage — until it reaches us, the hoop is your responsibility.',
        'Collapsible hoops post far more cheaply than fixed ones, which need a large, awkward parcel. Ask us before posting a fixed hoop and we will suggest the cheapest option.',
      ],
    },
    {
      heading: 'Your refund',
      body: [
        'We refund within 14 days of receiving the hoop back, to the card you paid with.',
        'The refund includes the standard delivery you originally paid. If you chose a faster or more expensive delivery option, we refund the standard rate.',
        'If the hoop has been used beyond what you would do to check it in a shop — scuffed tape, marked grip — we may reduce the refund to reflect that.',
      ],
    },
    {
      heading: 'If your hoop is faulty',
      body: [
        'Email us with a photograph and we will sort it out. If it is faulty you have 30 days to reject it for a full refund, and we pay return postage.',
        'A hoop damaged in transit counts as faulty. Tell us within a few days of delivery so we can claim from the courier.',
      ],
    },
  ],
};

export const deliveryPolicy: LegalDocument = {
  updated: LEGAL_UPDATED,
  intro: [
    'We post to the UK mainland, and you can collect for free in Southampton.',
    'Every hoop is made by hand once you order, so allow a few days before it is dispatched.',
  ],
  sections: [
    {
      heading: 'Where we deliver',
      body: [
        'UK mainland only. We do not ship internationally — hoops are large, light and awkward, which makes overseas postage disproportionately expensive.',
        'If you are outside the UK mainland and really want one, email us and we will see what is possible.',
      ],
    },
    {
      heading: 'Making and dispatch times',
      body: [
        'Made-to-order hoops take 3–10 working days to make before they are dispatched. Ready-made hoops are usually posted within 2 working days.',
        'Once posted, allow 1–3 working days for delivery. We will email you when your hoop is on its way, with a tracking number where there is one.',
      ],
    },
    {
      heading: 'Collection in Southampton',
      body: [
        'Collection is free. Choose it at checkout and we will email you to arrange a time once your hoop is ready — often at a class.',
      ],
    },
    {
      heading: 'Postage costs',
      body: [
        'The delivery charge is shown at checkout before you pay, and is included in the total.',
        'Fixed hoops cannot be folded, so they travel as a large parcel. Collapsible hoops pack down and are cheaper to send.',
      ],
    },
    {
      heading: 'If something goes wrong',
      body: [
        'If your hoop has not arrived when it should have, email hello@flowsha.co.uk and we will chase the courier.',
        'If it arrives damaged, photograph the packaging and the hoop and send them to us. We will replace or refund it.',
      ],
    },
  ],
};
