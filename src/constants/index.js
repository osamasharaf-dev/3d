import {
  backend,
  code,
  concepts,
  coursera,
  cp,
  creator,
  designs,
  fcc,
  hr,
  ideas,
  mobile,
  neuralnet,
  neuralnet1,
  neuralnet2,
  novalearn,
  novalearn1,
  novalearn2,
  portfolio,
  about,
  skills,
  contact,
  web,
  krypton,
  astroPixel,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "achievements",
    title: "Certifications",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Frontend Development",
    icon: web,
  },
  {
    title: "Backend Development",
    icon: mobile,
  },
  {
    title: "Database Management",
    icon: backend,
  },
  {
    title: "Cloud & DevOps",
    icon: creator,
  },
];

const achievements = [
  {
    title: ["Full-Stack Web Development"],
    company_name: "Self-Directed Learning",
    icon: fcc,
    iconBg: "#383E56",
    date: "2023 — Present",
    points: [
      "React.js & Next.js Advanced Patterns",
      "Node.js & Express.js Backend Systems",
      "Database Design with MySQL & PostgreSQL",
    ],
    credential: [null, null, null],
  },
  {
    title: ["Frontend Mastery"],
    company_name: "Online Platforms",
    icon: hr,
    iconBg: "#E6DEDD",
    date: "2022 — 2023",
    points: [
      "HTML5 & CSS3 — Advanced Certification",
      "JavaScript (ES6+) — Proficiency Badge",
      "Responsive Web Design Certification",
      "Tailwind CSS & Framer Motion",
    ],
    credential: [null, null, null, null],
  },
  {
    title: ["Backend & Databases"],
    company_name: "Technical Certification",
    icon: cp,
    iconBg: "#383E56",
    date: "2023",
    points: [
      "RESTful API Architecture & Design",
      "Authentication & Authorization Systems",
      "Database Optimization Techniques",
    ],
    credential: [null, null, null],
  },
  {
    title: ["Cloud & Deployment"],
    company_name: "DevOps Foundations",
    icon: coursera,
    iconBg: "#0056d2",
    date: "2024",
    points: [
      "Vercel & Netlify Deployment Workflows",
      "Git & GitHub Version Control — Advanced",
      "CI/CD Pipeline Fundamentals",
    ],
    credential: [null, null, null],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Osama proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Osama does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "Osama boosted our website traffic by 50% through his smart optimization. We are truly grateful!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "E-Commerce Platform",
    description:
      "A full-stack e-commerce web application with product management, shopping cart, secure payment integration, and an admin dashboard. Built with React, Node.js, and MongoDB for a seamless shopping experience.",
    tags: [
      { name: "React.js", color: "blue-text-gradient" },
      { name: "Node.js", color: "green-text-gradient" },
      { name: "MongoDB", color: "pink-text-gradient" },
      { name: "Tailwind CSS", color: "violet-text-gradient" },
      { name: "Express.js", color: "orange-text-gradient" },
    ],
    image: neuralnet,
    images: [neuralnet, neuralnet1, neuralnet2],
    source_code_link: "https://github.com/osamasharaf",
    live_demo_link: "#",
    metrics: { stars: 0, forks: 0, views: "—" },
    features: [
      "Product catalog with search, filter, and category browsing.",
      "Secure user authentication and account management.",
      "Shopping cart with real-time price calculation.",
      "Admin dashboard for inventory and order management.",
      "Responsive design optimized for all screen sizes.",
      "Integrated payment gateway for secure checkout.",
    ],
  },
  {
    name: "Task Management System",
    description:
      "A collaborative task management web application with real-time updates, team workspaces, drag-and-drop boards, and progress analytics. Built with Next.js and PostgreSQL for enterprise-grade reliability.",
    tags: [
      { name: "Next.js", color: "blue-text-gradient" },
      { name: "TypeScript", color: "green-text-gradient" },
      { name: "PostgreSQL", color: "pink-text-gradient" },
      { name: "Framer Motion", color: "violet-text-gradient" },
    ],
    image: krypton,
    images: [krypton],
    source_code_link: "https://github.com/osamasharaf",
    live_demo_link: "#",
    metrics: { stars: 0, forks: 0, views: "—" },
    features: [
      "Kanban-style drag-and-drop task boards.",
      "Team workspaces with role-based access control.",
      "Real-time notifications and task updates.",
      "Progress analytics with visual reporting.",
      "Due date tracking and priority management.",
      "Responsive, mobile-first interface.",
    ],
  },
  {
    name: "3D Portfolio Website",
    description:
      "A dynamic portfolio website with immersive 3D graphics, smooth animations, and interactive sections. Built with React, Three.js, and Framer Motion for an engaging and memorable user experience.",
    tags: [
      { name: "React.js", color: "blue-text-gradient" },
      { name: "Three.js", color: "green-text-gradient" },
      { name: "Framer Motion", color: "pink-text-gradient" },
      { name: "Tailwind CSS", color: "orange-text-gradient" },
      { name: "Spline", color: "violet-text-gradient" },
    ],
    image: portfolio,
    images: [portfolio, about, skills, contact],
    source_code_link: "https://github.com/osamasharaf",
    live_demo_link: "#",
    metrics: { stars: 0, forks: 0, views: "—" },
    features: [
      "Immersive 3D graphics with Three.js and Spline.",
      "Smooth scroll animations with Framer Motion.",
      "Interactive 3D models and environments.",
      "Responsive design across all devices.",
      "Custom elastic cursor with physics.",
      "Cinematic preloader and transitions.",
    ],
  },
  {
    name: "Real-Time Chat Application",
    description:
      "A scalable real-time chat application with private rooms, file sharing, and message history. Built with React, Node.js, Socket.io, and MongoDB to support seamless communication.",
    tags: [
      { name: "React.js", color: "blue-text-gradient" },
      { name: "Socket.io", color: "green-text-gradient" },
      { name: "Node.js", color: "pink-text-gradient" },
      { name: "MongoDB", color: "violet-text-gradient" },
    ],
    image: novalearn,
    images: [novalearn, novalearn1, novalearn2],
    source_code_link: "https://github.com/osamasharaf",
    live_demo_link: "#",
    metrics: { stars: 0, forks: 0, views: "—" },
    features: [
      "Real-time bidirectional messaging with Socket.io.",
      "Private and group chat rooms.",
      "File and image sharing capabilities.",
      "Persistent message history with MongoDB.",
      "User presence indicators (online/offline).",
      "End-to-end encryption for private conversations.",
    ],
  },
  {
    name: "Analytics Dashboard",
    description:
      "A data visualization dashboard built for businesses to track KPIs, sales, and user analytics in real time. Features interactive charts, exportable reports, and a fully responsive layout.",
    tags: [
      { name: "React.js", color: "blue-text-gradient" },
      { name: "TypeScript", color: "green-text-gradient" },
      { name: "Firebase", color: "pink-text-gradient" },
      { name: "Recharts", color: "violet-text-gradient" },
      { name: "Tailwind CSS", color: "orange-text-gradient" },
    ],
    image: astroPixel,
    images: [astroPixel],
    source_code_link: "https://github.com/osamasharaf",
    live_demo_link: "#",
    metrics: { stars: 0, forks: 0, views: "—" },
    features: [
      "Interactive charts and data visualization.",
      "Real-time KPI monitoring and alerts.",
      "Exportable PDF and CSV reports.",
      "Multi-role access control.",
      "Dark/light mode with theme persistence.",
      "Mobile-responsive dashboard layout.",
    ],
  },
  {
    name: "Restaurant Booking System",
    description:
      "A full-featured restaurant management system with online reservations, table management, menu builder, and customer notifications. Built with Next.js and PostgreSQL.",
    tags: [
      { name: "Next.js", color: "blue-text-gradient" },
      { name: "PostgreSQL", color: "green-text-gradient" },
      { name: "Tailwind CSS", color: "pink-text-gradient" },
      { name: "Framer Motion", color: "violet-text-gradient" },
    ],
    image: neuralnet1,
    images: [neuralnet1, neuralnet2],
    source_code_link: "https://github.com/osamasharaf",
    live_demo_link: "#",
    metrics: { stars: 0, forks: 0, views: "—" },
    features: [
      "Online table reservation with date/time selection.",
      "Admin panel for table and menu management.",
      "Automated email/SMS confirmation to customers.",
      "Real-time availability tracking.",
      "Customer feedback and rating system.",
      "Responsive UI for both mobile and desktop.",
    ],
  },
];

const words = [
  { text: "Ideas", imgPath: ideas, font: "Arial, sans-serif" },
  {
    text: "Concepts",
    imgPath: concepts,
    font: "'Courier New', Courier, monospace",
  },
  {
    text: "Designs",
    imgPath: designs,
    font: "'Times New Roman', Times, serif",
  },
  { text: "Code", imgPath: code, font: "'Fira Mono', monospace" },
  {
    text: "Ideas",
    imgPath: ideas,
    font: "'Comic Sans MS', cursive, sans-serif",
  },
  { text: "Concepts", imgPath: concepts, font: "'Roboto', sans-serif" },
  { text: "Designs", imgPath: designs, font: "'Georgia', serif" },
  { text: "Code", imgPath: code, font: "'Source Code Pro', monospace" },
];

export { achievements, projects, services, testimonials, words };
