import p1 from "@/assets/club/p1.jpg.asset.json";
import p5 from "@/assets/club/p5.jpg.asset.json";
import p6 from "@/assets/club/p6.jpg.asset.json";
import p7 from "@/assets/club/p7.jpg.asset.json";
import p8 from "@/assets/club/p8.jpg.asset.json";
import p9 from "@/assets/club/p9.jpg.asset.json";
import p10 from "@/assets/club/p10.jpg.asset.json";
import p11 from "@/assets/club/p11.jpg.asset.json";
import p12 from "@/assets/club/p12.jpg.asset.json";
import p13 from "@/assets/club/p13.jpg.asset.json";
import p14 from "@/assets/club/p14.jpg.asset.json";
import p15 from "@/assets/club/p15.jpg.asset.json";
import p16 from "@/assets/club/p16.jpg.asset.json";

export const CLUB = {
  college: "Smt. B. Seetha Polytechnic",
  campus: "Vishnupur, Bhimavaram",
  society: "Shri Vishnu Educational Society",
  centre: "Vishnu Student Success Centre",
  name: "Code & Creative Club",
  academicYear: "2025-2026",
  tagline: "You dream it, we'll create it",
  posterUrl: p1.url,
  mission:
    "To engage students in national and international hackathons, coding events and appathons, thereby enhancing their technical skills and problem-solving capabilities. The club makes the college environment more creative and interesting, and builds a platform that motivates students to take part in technical activities marked by creativity, originality and innovative ideas.",
  goal:
    "The Code and Creative Club aims to inspire students to develop coding and creative skills through collaboration, hands-on projects and innovation, preparing them for future tech careers.",
  objectives: [
    "Increase coding literacy across every branch",
    "Create logical thinking among the students",
    "Develop skills that lead to campus placements",
    "Remove code phobia",
    "Incubate an environment for skilled developers",
  ],
  activities: [
    "Workshop on the basics of coding",
    "Make a simple animation",
    "Build an interactive website",
    "Make a simple game",
    "Coding awareness programs",
    "Techfests and hackathon programs",
  ],
} as const;

export const CALENDAR = [
  { no: 1, event: "Career Guidance", date: "05-07-2025", day: "Monday" },
  { no: 2, event: "Cyber Shield O", date: "29-08-2025 & 30-08-2025", day: "Friday & Saturday" },
  { no: 3, event: "Engineer's Day", date: "22-09-2025", day: "Monday" },
  { no: 4, event: "Skill Hour on Latest Technologies", date: "17-09-2025", day: "Wednesday" },
  { no: 5, event: "DBMS Basic Development Program (MongoDB)", date: "15-10-2025", day: "Wednesday" },
] as const;

export type ClubEvent = {
  slug: string;
  title: string;
  kind: string;
  date: string;
  time: string;
  venue: string;
  audience: string;
  resourcePersons: string[];
  highlights: string[];
  summary: string[];
  poster: string;
  photos: { url: string; alt: string }[];
};

export const EVENTS: ClubEvent[] = [
  {
    slug: "career-guidance",
    title: "Career Guidance",
    kind: "One day workshop",
    date: "05 July 2025",
    time: "10:00 AM – 1:30 PM",
    venue: "Colloquium",
    audience: "II year Computer Science & Engineering students",
    resourcePersons: ["T. Sai Veera Narendra — Software Engineer, Lloyd (Banking Sector)"],
    highlights: [
      "Exploring career options",
      "Career planning strategies",
      "Developing skills for the job market",
    ],
    summary: [
      "The Career Guidance program was conducted on 05-07-2025 from 10:00 AM to 1:30 PM for the II year students of the Computer Science and Engineering department. The half-day session was organised by the department with the objective of guiding students toward a successful career in the IT field.",
      "Mr. T. Sai Veera Narendra, Software Engineer, delivered an informative and motivating session on the future of IT, explaining career opportunities, emerging technologies and the skills required to succeed in the software industry.",
      "Students participated actively and gained valuable insights into career planning and future opportunities in the IT sector.",
    ],
    poster: p5.url,
    photos: [{ url: p6.url, alt: "Career Guidance session in the college colloquium" }],
  },
  {
    slug: "cyber-shield",
    title: "Cyber Shield O",
    kind: "Two day workshop",
    date: "29 & 30 August 2025",
    time: "9:00 AM – 12:30 PM",
    venue: "Colloquium",
    audience: "II year students",
    resourcePersons: [
      "M. Prasad — Associate Professor",
      "B. V. Prasanthi — Assistant Professor",
    ],
    highlights: [
      "Fundamentals of cybersecurity",
      "Common cyber attacks",
      "Preventive measures",
      "Ethical behaviour online",
    ],
    summary: [
      "The Cyber Shield seminar was conducted on 29th and 30th August 2025 at the Colloquium to build students' awareness of cybersecurity fundamentals, common cyber attacks and the importance of ethical behaviour in the digital world.",
      "Participants learned basic cybersecurity concepts, different types of cyber attacks and preventive measures to stay safe online, with an emphasis on being a responsible and ethical user of technology.",
      "The session was delivered by M. Prasad and B. V. Prasanthi, who shared practical examples that improved students' understanding of cyber safety practices.",
    ],
    poster: p7.url,
    photos: [{ url: p8.url, alt: "Cyber Shield cybersecurity seminar in progress" }],
  },
  {
    slug: "engineers-day",
    title: "Engineer's Day 2025",
    kind: "Technical event — organised by DCME department",
    date: "22 September 2025",
    time: "9:00 AM – 4:30 PM",
    venue: "Seminar Hall",
    audience: "II year CME students",
    resourcePersons: [
      "B. Vijaya Kumari — HOD, DCME (Secretary)",
      "K. D. M. Mahima — Lecturer, DCME (Coordinator)",
    ],
    highlights: ["Quiz", "Poster presentations", "Web development"],
    summary: [
      "The Engineers' Day event was conducted for II year CME students and included a quiz, poster presentations and website development activities.",
      "Students presented posters on different engineering topics — artificial intelligence, AR/VR and cloud computing — and built simple websites, improving their creativity, technical knowledge and presentation skills.",
      "The event encouraged students to share ideas, work as a team and gain practical experience.",
    ],
    poster: p9.url,
    photos: [
      { url: p10.url, alt: "Students presenting web development projects on Engineer's Day" },
      { url: p11.url, alt: "Students presenting technology posters on Engineer's Day" },
    ],
  },
  {
    slug: "skill-hour",
    title: "Skill Hour on Latest Technologies",
    kind: "Skill hour",
    date: "17 September 2025",
    time: "1:00 PM – 3:30 PM",
    venue: "Colloquium",
    audience: "Diploma students of the DCME department",
    resourcePersons: ["Mrs. Vijaya Kumari — HOD, DCME (Secretary)"],
    highlights: [
      "Overview of emerging technologies",
      "Real-world applications",
      "Skill enhancement for careers",
      "Current industry requirements",
    ],
    summary: [
      "The Skill Hour on Latest Technologies created awareness among students about emerging trends in computer engineering, explained in a simple and effective manner.",
      "The session covered modern technological developments, real-time applications and the importance of skill enhancement for future careers.",
      "Students gained useful knowledge about current industry requirements and career opportunities, improving their technical awareness and confidence.",
    ],
    poster: p14.url,
    photos: [
      { url: p15.url, alt: "Resource person presenting during the Skill Hour session" },
      { url: p16.url, alt: "Students attending the Skill Hour on Latest Technologies" },
    ],
  },
  {
    slug: "mongodb",
    title: "Introduction to MongoDB",
    kind: "DBMS basic development program",
    date: "15 October 2025",
    time: "9:00 AM – 12:30 PM",
    venue: "Seminar Hall",
    audience: "Diploma students of the DCME department",
    resourcePersons: ["Mrs. Vijaya Kumari — HOD, DCME (Secretary)"],
    highlights: [
      "Introduction to database management systems",
      "Features of MongoDB & document-based storage",
      "CRUD operations in MongoDB",
      "Real-world applications of MongoDB",
    ],
    summary: [
      "The Introduction to MongoDB program familiarised students with modern database technologies and NoSQL concepts, focusing on MongoDB, which is widely used to handle large volumes of data.",
      "Faculty explained the basics of database management systems and introduced MongoDB simply and effectively.",
      "Topics such as features of MongoDB, document-based storage, collections and basic CRUD operations were discussed clearly, making them easy for students to understand.",
    ],
    poster: p12.url,
    photos: [{ url: p13.url, alt: "Faculty explaining MongoDB read operations in the seminar hall" }],
  },
];

export type Member = {
  role: string;
  name: string;
  pin: string;
  email: string;
  phone: string;
};

export const PRESIDENT: Member = {
  role: "President",
  name: "K. Adithya Sri Krishna",
  pin: "24093-CM-100",
  email: "kadaliadithya123@gmail.com",
  phone: "9705945589",
};

export const MEMBERS: Member[] = [
  {
    role: "Vice President",
    name: "G. Manohar",
    pin: "24093-CM-070",
    email: "garapatimanohar4074@gmail.com",
    phone: "9573643625",
  },
  {
    role: "Treasurer",
    name: "Manchala Ganesh Vijay Kumar",
    pin: "23093-CM-083",
    email: "ganeshmanchala1437@gmail.com",
    phone: "8332084493",
  },
  {
    role: "Secretary",
    name: "Uppuganti Gayatri Naga Anusha",
    pin: "24093-CM-228",
    email: "gayatriuppuganti08@gmail.com",
    phone: "9182852690",
  },
];