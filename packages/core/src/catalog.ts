export type TutorBadge = "Super tutor" | "Rising star";

export interface Tutor {
  id: string;
  name: string;
  avatarEmoji: string;
  headline: string;
  subjects: string[];
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  badge?: TutorBadge;
}

export const SUBJECTS: readonly string[] = [
  "English",
  "Spanish",
  "French",
  "German",
  "Programming",
  "Mathematics",
  "Guitar",
  "Piano",
  "Business",
  "Exam Prep",
];

/** Sample catalog from the Mentora concept prototype; replace with a repository once tutors are persisted. */
export const FEATURED_TUTORS: readonly Tutor[] = [
  {
    id: "t-ana-ruiz",
    name: "Ana Ruiz",
    avatarEmoji: "🧑‍🏫",
    headline: "Certified Spanish teacher · 7 yrs experience · Conversational focus",
    subjects: ["Spanish"],
    pricePerHour: 18,
    rating: 4.9,
    reviewCount: 312,
    badge: "Super tutor",
  },
  {
    id: "t-james-oliver",
    name: "James Oliver",
    avatarEmoji: "👨‍💻",
    headline: "Senior software engineer teaching practical web development",
    subjects: ["Programming"],
    pricePerHour: 32,
    rating: 4.8,
    reviewCount: 98,
    badge: "Rising star",
  },
  {
    id: "t-lena-wolff",
    name: "Lena Wolff",
    avatarEmoji: "📘",
    headline: "German tutor specializing in exam prep (Goethe, TestDaF)",
    subjects: ["German", "Exam Prep"],
    pricePerHour: 22,
    rating: 4.95,
    reviewCount: 203,
    badge: "Super tutor",
  },
  {
    id: "t-marco-conti",
    name: "Marco Conti",
    avatarEmoji: "🎸",
    headline: "Guitar teacher — rock, blues and fingerstyle for all levels",
    subjects: ["Guitar"],
    pricePerHour: 15,
    rating: 4.7,
    reviewCount: 76,
  },
  {
    id: "t-priya-shah",
    name: "Priya Shah",
    avatarEmoji: "📈",
    headline: "Business English coach for professionals and interviews",
    subjects: ["English", "Business"],
    pricePerHour: 26,
    rating: 4.85,
    reviewCount: 154,
  },
  {
    id: "t-noah-bernard",
    name: "Noah Bernard",
    avatarEmoji: "🥐",
    headline: "French tutor, friendly and patient, beginner specialist",
    subjects: ["French"],
    pricePerHour: 16,
    rating: 5,
    reviewCount: 12,
  },
];
