export const couple = {
  partnerOne: "Abhinav",
  partnerTwo: "Mishi",
  weddingDate: "2026-11-21T19:00:00+05:30",
  displayDate: "20 & 21 November 2026",
  rsvpBy: "1 November 2026",
  city: "Agra, Uttar Pradesh",
  tagline: "Some stories are written in the stars. Ours led us here.",
  googleAlbumUrl: "https://photos.google.com/",
  appleAlbumUrl: "https://www.icloud.com/photos/",
};

export const story = [
  {
    year: "2024",
    title: "A chance hello",
    description:
      "A rainy evening, one shared umbrella, and a conversation neither of us wanted to end.",
  },
  {
    year: "2025",
    title: "Miles of memories",
    description:
      "From quiet coffee dates to loud road trips, ordinary days became our favourite adventures.",
  },
  {
    year: "2026",
    title: "The easiest yes",
    description:
      "Under a sky full of lights, we chose forever—and now we get to celebrate it with you.",
  },
];

export const events = [
  {
    name: "Mehendi Morning",
    date: "Friday · 20 November",
    time: "9:00 AM",
    venue: "Ginger Agra · Bichpuri",
    dressCode: "Light pastel colours",
    image: "/images/gallery-celebration.jpg",
    icon: "❋",
    mapUrl: "https://maps.google.com/?q=Ginger+Agra+Bichpuri",
  },
  {
    name: "Sangeet Evening",
    date: "Friday · 20 November",
    time: "6:00 PM",
    venue: "Ginger Agra · Bichpuri",
    dressCode: "Dark theme",
    image: "/images/gallery-birthday.jpg",
    icon: "◇",
    mapUrl: "https://maps.google.com/?q=Ginger+Agra+Bichpuri",
  },
  {
    name: "Afterparty",
    date: "Friday · 20 November",
    time: "10:00 PM onwards",
    venue: "Ginger Agra · Bichpuri",
    dressCode: "Dark theme",
    image: "/images/abhinav-mishi-cover.jpg",
    icon: "✦",
    mapUrl: "https://maps.google.com/?q=Ginger+Agra+Bichpuri",
  },
  {
    name: "Haldi Morning",
    date: "Saturday · 21 November",
    time: "9:00 AM",
    venue: "Ginger Agra · Bichpuri",
    dressCode: "Light multicoloured",
    image: "/images/gallery-celebration.jpg",
    icon: "☀",
    mapUrl: "https://maps.google.com/?q=Ginger+Agra+Bichpuri",
  },
  {
    name: "Wedding Ceremony",
    date: "Saturday · 21 November",
    time: "Celebrations from 7:00 PM",
    venue: "Ginger Agra · Bichpuri",
    dressCode: "Ethnic dark",
    image: "/images/our-favourite-chapter.jpg",
    scheduleNote: "Baraat at 8:00 PM",
    icon: "◉",
    mapUrl: "https://maps.google.com/?q=Ginger+Agra+Bichpuri",
  },
];

export const gallery = [
  {
    src: "/images/gallery-celebration.jpg",
    alt: "Abhinav and Mishi celebrating together among marigold decorations",
    caption: "The colours of us.",
  },
  {
    src: "/images/gallery-birthday.jpg",
    alt: "Abhinav and Mishi smiling together at a birthday celebration",
    caption: "Still choosing each other.",
  },
  {
    src: "/images/gallery-bali.jpg",
    alt: "Abhinav and Mishi jumping between the Handara Gate in Bali",
    caption: "Miles of memories.",
  },
  {
    src: "/images/gallery-polaroids.jpg",
    alt: "A hand holding favourite Polaroid photographs of Abhinav and Mishi",
    caption: "Little moments, forever kept.",
  },
];

export const quizQuestions = [
  {
    question: "Where did Abhinav and Mishi first meet?",
    options: ["At a wedding", "In a café", "At work", "On a flight"],
    answer: 1,
  },
  {
    question: "Who said “I love you” first?",
    options: ["Abhinav", "Mishi", "Both together", "They still debate it"],
    answer: 3,
  },
  {
    question: "What is their perfect date night?",
    options: ["A fancy dinner", "A long drive", "Movies at home", "All of the above"],
    answer: 3,
  },
  {
    question: "Who is most likely to own the dance floor?",
    options: ["Abhinav", "Mishi", "Their friends", "The parents"],
    answer: 1,
  },
];

export const shoeGameQuestions = [
  {
    question: "Who made the first move?",
    answer: "bride",
  },
  {
    question: "Who takes longer to get ready?",
    answer: "groom",
  },
  {
    question: "Who is more likely to plan a surprise date?",
    answer: "bride",
  },
  {
    question: "Who apologises first after an argument?",
    answer: "groom",
  },
  {
    question: "Who will be the first one on the dance floor tonight?",
    answer: "bride",
  },
] as const;
