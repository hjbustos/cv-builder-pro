import { ResumeData } from "./types";

const generateId = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: "Elena Valderrama",
    address: "Calle de la Innovación 42",
    country: "España",
    city: "Barcelona",
    email: "e.valderrama@example.com",
    website: "https://www.linkedin.com/in/elena-valderrama-dev",
    phone: "+34 600 555 111",
  },
  pageSize: 'A4',
  selectedTemplate: 'geometric',
  sections: [
    { id: 'experience', label: 'Evolución Profesional', visible: true },
    { id: 'education', label: 'Formación Académica', visible: true },
    { id: 'certifications', label: 'Certificaciones Relevantes', visible: true },
    { id: 'skills', label: 'Stack Técnico', visible: false },
    { id: 'events', label: 'Participación en Eventos', visible: false },
  ],
  experience: [
    {
      id: generateId(),
      company: "Quantum Software Solutions",
      position: "Lead UI Engineer",
      startDate: "Enero 2021",
      endDate: "Presente",
      description: "Directora técnica del equipo de interfaz de usuario para productos SaaS.\n\n**Impacto directo:**\n- Lideré la migración de un monolito a una arquitectura de micro-frontends.\n- Sistema de diseño implementado redujo el tiempo de desarrollo en un 30%.",
      technologies: ["React", "Next.js", "Tailwind CSS", "Storybook", "TypeScript"],
    },
    {
      id: generateId(),
      company: "Innovate AI",
      position: "Full Stack Developer",
      startDate: "Junio 2018",
      endDate: "Diciembre 2020",
      description: "Desarrollo integral de aplicaciones web basadas en inteligencia artificial.\n\nResponsabilidades:\n- Diseño de APIs RESTful utilizando Node.js.\n- Optimización de consultas SQL que mejoraron el tiempo de respuesta en un 50%.",
      technologies: ["React", "Node.js", "Express", "PostgreSQL", "OpenAI API"],
    },
  ],
  education: [
    {
      id: generateId(),
      institution: "Universidad Politécnica de Cataluña",
      degree: "Grado en Ingeniería Informática",
      startDate: "2014",
      endDate: "2018",
      description: "Mención en Computación y Sistemas de Información.",
    },
    {
      id: generateId(),
      institution: "MIT Professional Education",
      degree: "Certificado en Inteligencia Artificial Aplicada",
      startDate: "2019",
      endDate: "2020",
    },
  ],
  certifications: [
    {
      id: generateId(),
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      issueDate: { month: "Marzo", year: "2022" },
      expiryDate: { month: "Marzo", year: "2025" },
      credentialId: "AWS-DEV-991122",
      credentialUrl: "https://aws.amazon.com/verification",
      badgeUrl: "https://images.credly.com/size/340x340/images/b9feab85-1a43-4f6c-99f2-4115d0545f2f/ACS_Developer_Associate_600x600.png"
    },
    {
      id: generateId(),
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera",
      issueDate: { month: "Julio", year: "2021" },
      expiryDate: { month: "", year: "Sin vencimiento" },
      credentialId: "META-FE-445566",
      badgeUrl: "https://images.credly.com/size/340x340/images/8410298d-a414-411a-9694-916c0299f061/Front_End_Professional_600x600.png"
    },
  ],
  skills: [
    {
      id: generateId(),
      title: "Frontend & Diseño",
      items: ["React", "TypeScript", "Next.js", "Figma", "Tailwind CSS", "Framer Motion"],
    },
    {
      id: generateId(),
      title: "Backend & Herramientas",
      items: ["Node.js", "PostgreSQL", "Redis", "Docker", "Git", "GitHub Actions"],
    },
  ],
  events: [
    {
      id: generateId(),
      title: "React Alicante 2023",
      date: "Septiembre 2023",
      description: "Asistente y participante en los debates sobre el futuro de las Server Actions.",
    },
    {
      id: generateId(),
      title: "JS Day Barcelona",
      date: "Mayo 2022",
      description: "Speaker sobre 'Rendimiento en el Frontend moderno'.",
    },
  ],
  sortConfig: {
    experience: 'date',
    education: 'date',
    certifications: 'date',
    skills: 'manual',
    events: 'date',
  },
};
