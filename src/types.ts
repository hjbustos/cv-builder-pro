export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies?: string[];
  details?: { title: string; items: string[] }[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: { month: string; year: string };
  expiryDate: { month: string; year: string };
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
}

export type SectionId = 'experience' | 'education' | 'certifications' | 'skills' | 'events';
export type TemplateId = 'geometric' | 'minimalist' | 'modern' | 'technical';
export type SortType = 'date' | 'manual';

export interface SectionConfig {
  id: SectionId;
  label: string;
  visible: boolean;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    address: string;
    country: string;
    city: string;
    email: string;
    website: string;
    phone: string;
  };
  pageSize: 'A4' | 'Letter';
  selectedTemplate: TemplateId;
  sections: SectionConfig[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: SkillGroup[];
  events: Event[];
  sortConfig: Record<SectionId, SortType>;
}
