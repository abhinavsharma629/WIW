export const couple = {
  partnerOne: "Abhinav",
  partnerTwo: "Mishi",
  weddingDate: "2026-11-21T19:00:00+05:30",
  displayDate: "20 & 21 November 2026",
  rsvpBy: "1 November 2026",
  city: "Agra, Uttar Pradesh",
  tagline: "Some stories are written in the stars. Ours led us here.",
  albumUrl: "https://photos.google.com/",
};

export const story = [
  {
    year: "2021",
    title: "A chance hello",
    description:
      "A rainy evening, one shared umbrella, and a conversation neither of us wanted to end.",
  },
  {
    year: "2023",
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
    icon: "❋",
    mapUrl: "https://maps.google.com/?q=Ginger+Agra+Bichpuri",
  },
  {
    name: "Sangeet Evening",
    date: "Friday · 20 November",
    time: "6:00 PM",
    venue: "Ginger Agra · Bichpuri",
    dressCode: "Dark theme",
    icon: "◇",
    mapUrl: "https://maps.google.com/?q=Ginger+Agra+Bichpuri",
  },
  {
    name: "Afterparty",
    date: "Friday · 20 November",
    time: "10:00 PM onwards",
    venue: "Ginger Agra · Bichpuri",
    dressCode: "Dark theme",
    icon: "✦",
    mapUrl: "https://maps.google.com/?q=Ginger+Agra+Bichpuri",
  },
  {
    name: "Haldi Morning",
    date: "Saturday · 21 November",
    time: "9:00 AM",
    venue: "Ginger Agra · Bichpuri",
    dressCode: "Light multicoloured",
    icon: "☀",
    mapUrl: "https://maps.google.com/?q=Ginger+Agra+Bichpuri",
  },
  {
    name: "Wedding Ceremony",
    date: "Saturday · 21 November",
    time: "Celebrations from 7:00 PM",
    venue: "Ginger Agra · Bichpuri",
    dressCode: "Ethnic dark",
    scheduleNote: "Baraat at 8:00 PM",
    icon: "◉",
    mapUrl: "https://maps.google.com/?q=Ginger+Agra+Bichpuri",
  },
];

export const gallery = [
  {
    src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=85",
    alt: "Couple sharing a quiet moment outdoors",
    caption: "Wherever we are, together is home.",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85",
    alt: "Wedding rings resting on flowers",
    caption: "The promise.",
  },
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
    alt: "Wedding celebration under string lights",
    caption: "A night to remember.",
  },
  {
    src: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?auto=format&fit=crop&w=1200&q=85",
    alt: "Bride and groom walking together",
    caption: "Every road led to you.",
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
