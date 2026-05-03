import Papa from 'papaparse';
import { ResumeData, Experience, Education, Certification, SkillGroup, Event, SectionConfig, SectionId } from '../types';

export const exportToCSV = (data: ResumeData) => {
  const rows: any[] = [];

  // Personal Info
  rows.push({
    Type: 'PERSONAL',
    V1: data.personalInfo.fullName,
    V2: data.personalInfo.address,
    V3: data.personalInfo.country,
    V4: data.personalInfo.city,
    V5: data.personalInfo.email,
    V6: data.personalInfo.website,
    V7: data.personalInfo.phone,
    V8: data.selectedTemplate,
    V9: data.pageSize
  });

  // Sections config
  data.sections.forEach(s => {
    rows.push({
      Type: 'SECTION',
      V1: s.id,
      V2: s.label,
      V3: s.visible ? 'TRUE' : 'FALSE'
    });
  });

  // Experience
  data.experience.forEach(exp => {
    rows.push({
      Type: 'EXPERIENCE',
      V1: exp.company,
      V2: exp.position,
      V3: exp.startDate,
      V4: exp.endDate,
      V5: exp.description,
      V6: exp.technologies?.join('; ') || ''
    });
  });

  // Education
  data.education.forEach(edu => {
    rows.push({
      Type: 'EDUCATION',
      V1: edu.institution,
      V2: edu.degree,
      V3: edu.startDate,
      V4: edu.endDate,
      V5: edu.description || ''
    });
  });

  // Certifications
  data.certifications.forEach(cert => {
    rows.push({
      Type: 'CERTIFICATION',
      V1: cert.name,
      V2: cert.issuer,
      V3: cert.issueDate.month,
      V4: cert.issueDate.year,
      V5: cert.expiryDate.month,
      V6: cert.expiryDate.year,
      V7: cert.credentialId || '',
      V8: cert.credentialUrl || '',
      V9: cert.badgeUrl || ''
    });
  });

  // Skills
  data.skills.forEach(skill => {
    rows.push({
      Type: 'SKILL',
      V1: skill.title,
      V2: skill.items.join('; ')
    });
  });

  // Events
  data.events.forEach(event => {
    rows.push({
      Type: 'EVENT',
      V1: event.title,
      V2: event.date,
      V3: event.description
    });
  });

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `resume_data_${data.personalInfo.fullName.replace(/\s+/g, '_')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFromCSV = (csvString: string): ResumeData => {
  const result = Papa.parse(csvString, { header: true });
  const rows = result.data as any[];

  const newData: ResumeData = {
    personalInfo: {
      fullName: '',
      address: '',
      country: '',
      city: '',
      email: '',
      website: '',
      phone: ''
    },
    sections: [],
    experience: [],
    education: [],
    certifications: [],
    skills: [],
    events: [],
    pageSize: 'A4',
    selectedTemplate: 'geometric'
  };

  rows.forEach(row => {
    const type = row.Type;
    switch (type) {
      case 'PERSONAL':
        newData.personalInfo = {
          fullName: row.V1 || '',
          address: row.V2 || '',
          country: row.V3 || '',
          city: row.V4 || '',
          email: row.V5 || '',
          website: row.V6 || '',
          phone: row.V7 || ''
        };
        if (row.V8) {
          newData.selectedTemplate = row.V8 as any;
        }
        if (row.V9) {
          newData.pageSize = row.V9 as any;
        }
        break;
      case 'SECTION':
        newData.sections.push({
          id: row.V1 as SectionId,
          label: row.V2 || '',
          visible: row.V3 === 'TRUE'
        });
        break;
      case 'EXPERIENCE':
        newData.experience.push({
          id: Math.random().toString(36).substr(2, 9),
          company: row.V1 || '',
          position: row.V2 || '',
          startDate: row.V3 || '',
          endDate: row.V4 || '',
          description: row.V5 || '',
          technologies: row.V6 ? row.V6.split(';').map((s: string) => s.trim()) : []
        });
        break;
      case 'EDUCATION':
        newData.education.push({
          id: Math.random().toString(36).substr(2, 9),
          institution: row.V1 || '',
          degree: row.V2 || '',
          startDate: row.V3 || '',
          endDate: row.V4 || '',
          description: row.V5 || ''
        });
        break;
      case 'CERTIFICATION':
        newData.certifications.push({
          id: Math.random().toString(36).substr(2, 9),
          name: row.V1 || '',
          issuer: row.V2 || '',
          issueDate: { month: row.V3 || '', year: row.V4 || '' },
          expiryDate: { month: row.V5 || '', year: row.V6 || '' },
          credentialId: row.V7 || '',
          credentialUrl: row.V8 || '',
          badgeUrl: row.V9 || ''
        });
        break;
      case 'SKILL':
        newData.skills.push({
          id: Math.random().toString(36).substr(2, 9),
          title: row.V1 || '',
          items: row.V2 ? row.V2.split(';').map((s: string) => s.trim()) : []
        });
        break;
      case 'EVENT':
        newData.events.push({
          id: Math.random().toString(36).substr(2, 9),
          title: row.V1 || '',
          date: row.V2 || '',
          description: row.V3 || ''
        });
        break;
    }
  });

  // Fill in default sections if missing to prevent breakage
  if (newData.sections.length === 0) {
     newData.sections = [
        { id: 'experience', label: 'Experiencia Laboral', visible: true },
        { id: 'education', label: 'Educación', visible: true },
        { id: 'certifications', label: 'Licencias y Certificaciones', visible: true },
        { id: 'skills', label: 'Conocimientos Técnicos', visible: true },
        { id: 'events', label: 'Congresos y Seminarios', visible: true },
     ];
  }

  return newData;
};
