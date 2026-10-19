"use strict";
/**
 * Mock data layer. In a real product every array here is backed by the
 * REST endpoints documented in docs/04-screen-specifications.md.
 * No namespaces-as-modules framework is used on purpose: these mockups
 * must run by double-clicking an .html file (file://), so everything is
 * plain global scripts loaded in order (see the <script> tags in each page).
 */
var MentorApp;
(function (MentorApp) {
    MentorApp.subjects = [
        "English", "Spanish", "French", "German",
        "Programming", "Mathematics", "Guitar", "Piano",
        "Business", "Exam Prep",
    ];
    MentorApp.tutors = [
        {
            id: "t-ana-ruiz", name: "Ana Ruiz", avatarEmoji: "🧑‍🏫",
            headline: "Certified Spanish teacher · 7 yrs experience · Conversational focus",
            subjects: ["Spanish"], languages: ["Spanish (native)", "English (fluent)"],
            pricePerHour: 18, rating: 4.9, reviewCount: 312, lessonsCompleted: 2140,
            badge: "Super tutor",
            bio: "I help adult learners build real conversational confidence through topics they actually care about — travel, work, pop culture. DELE examiner certified.",
            nextAvailable: "Today, 18:00",
        },
        {
            id: "t-james-oliver", name: "James Oliver", avatarEmoji: "👨‍💻",
            headline: "Senior software engineer teaching practical web development",
            subjects: ["Programming"], languages: ["English (native)"],
            pricePerHour: 32, rating: 4.8, reviewCount: 98, lessonsCompleted: 540,
            badge: "Rising star",
            bio: "10 years building production web apps. I teach JavaScript/TypeScript, React and backend fundamentals with real project-based lessons.",
            nextAvailable: "Tomorrow, 09:00",
        },
        {
            id: "t-lena-wolff", name: "Lena Wolff", avatarEmoji: "📘",
            headline: "German tutor specializing in exam prep (Goethe, TestDaF)",
            subjects: ["German", "Exam Prep"], languages: ["German (native)", "English (fluent)"],
            pricePerHour: 22, rating: 4.95, reviewCount: 203, lessonsCompleted: 1310,
            badge: "Super tutor",
            bio: "Former Goethe-Institut examiner. Structured study plans tailored to your exam date and current level.",
            nextAvailable: "Today, 20:30",
        },
        {
            id: "t-marco-conti", name: "Marco Conti", avatarEmoji: "🎸",
            headline: "Guitar teacher — rock, blues and fingerstyle for all levels",
            subjects: ["Guitar"], languages: ["Italian (native)", "English (fluent)"],
            pricePerHour: 15, rating: 4.7, reviewCount: 76, lessonsCompleted: 410,
            bio: "Professional touring musician for 12 years, now teaching online. Lessons built around songs you want to play.",
            nextAvailable: "Fri, 17:00",
        },
        {
            id: "t-priya-shah", name: "Priya Shah", avatarEmoji: "📈",
            headline: "Business English coach for professionals and interviews",
            subjects: ["English", "Business"], languages: ["English (native)", "Hindi (native)"],
            pricePerHour: 26, rating: 4.85, reviewCount: 154, lessonsCompleted: 890,
            bio: "I coach non-native professionals preparing for interviews, presentations, and day-to-day work communication.",
            nextAvailable: "Today, 21:00",
        },
        {
            id: "t-noah-bernard", name: "Noah Bernard", avatarEmoji: "🥐",
            headline: "French tutor, friendly and patient, beginner specialist",
            subjects: ["French"], languages: ["French (native)", "English (fluent)"],
            pricePerHour: 16, rating: 5.0, reviewCount: 12, lessonsCompleted: 40,
            bio: "New to Preply-style platforms but 5 years of in-person tutoring experience. I love working with complete beginners.",
            nextAvailable: "Tomorrow, 11:00",
            isNew: true,
        },
        {
            id: "t-sara-kim", name: "Sara Kim", avatarEmoji: "➗",
            headline: "Maths tutor — algebra to calculus, SAT/ACT prep",
            subjects: ["Mathematics", "Exam Prep"], languages: ["English (fluent)", "Korean (native)"],
            pricePerHour: 20, rating: 4.9, reviewCount: 221, lessonsCompleted: 1500,
            badge: "Super tutor",
            bio: "Former high-school maths teacher, now full-time online. I make abstract concepts click with visual explanations.",
            nextAvailable: "Today, 16:00",
        },
        {
            id: "t-leo-martins", name: "Leo Martins", avatarEmoji: "🎹",
            headline: "Piano teacher for kids and adults, classical & pop",
            subjects: ["Piano"], languages: ["Portuguese (native)", "English (fluent)"],
            pricePerHour: 19, rating: 4.6, reviewCount: 61, lessonsCompleted: 300,
            bio: "Conservatory-trained pianist. Patient, structured lessons with sheet music provided for every piece.",
            nextAvailable: "Mon, 10:00",
        },
    ];
    MentorApp.reviews = [
        { id: "r1", tutorId: "t-ana-ruiz", studentName: "Michael", rating: 5, comment: "Ana makes every lesson fun and I actually look forward to practicing now.", tags: ["Patient", "Fun lessons"], date: "2026-09-02" },
        { id: "r2", tutorId: "t-ana-ruiz", studentName: "Julia", rating: 5, comment: "Super well prepared, adapts to my pace perfectly.", tags: ["Well prepared"], date: "2026-08-20" },
        { id: "r3", tutorId: "t-ana-ruiz", studentName: "Devon", rating: 4, comment: "Great tutor overall, sometimes runs a little over time (in a good way!).", tags: [], date: "2026-07-11" },
        { id: "r4", tutorId: "t-james-oliver", studentName: "Priya", rating: 5, comment: "Helped me actually ship my first React app. Explains concepts clearly.", tags: ["Well prepared"], date: "2026-09-10" },
        { id: "r5", tutorId: "t-james-oliver", studentName: "Tom", rating: 4, comment: "Solid lessons, would like a bit more structure between sessions.", tags: [], date: "2026-08-02" },
    ];
    function tutorById(id) {
        return MentorApp.tutors.find((t) => t.id === id);
    }
    MentorApp.tutorById = tutorById;
    function reviewsForTutor(tutorId) {
        return MentorApp.reviews.filter((r) => r.tutorId === tutorId);
    }
    MentorApp.reviewsForTutor = reviewsForTutor;
    function ratingDistribution(tutorId) {
        const list = reviewsForTutor(tutorId);
        const dist = [0, 0, 0, 0, 0];
        list.forEach((r) => { dist[r.rating - 1]++; });
        return dist.reverse(); // index 0 = 5 stars
    }
    MentorApp.ratingDistribution = ratingDistribution;
})(MentorApp || (MentorApp = {}));
