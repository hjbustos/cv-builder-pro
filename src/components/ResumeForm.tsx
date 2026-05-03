import React from "react";
import { ResumeData, Experience, Education, SkillGroup, Event, Certification, SectionConfig } from "../types";
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, GripVertical, Bold, Italic, List as ListIcon, ListOrdered, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const generateId = () => Math.random().toString(36).substr(2, 9);

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

interface MarkdownToolbarProps {
  textareaId: string;
  onAction: (prefix: string, suffix?: string) => void;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ onAction }) => (
  <div className="flex items-center gap-1 mb-2 p-1 bg-slate-100 rounded border border-slate-200">
    <button 
      onClick={() => onAction("**", "**")}
      className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600" 
      title="Negrita"
    >
      <Bold size={14} />
    </button>
    <button 
      onClick={() => onAction("*", "*")}
      className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600" 
      title="Cursiva"
    >
      <Italic size={14} />
    </button>
    <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
    <button 
      onClick={() => onAction("- ")}
      className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600" 
      title="Lista con viñetas"
    >
      <ListIcon size={14} />
    </button>
    <button 
      onClick={() => onAction("1. ")}
      className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600" 
      title="Lista numerada"
    >
      <ListOrdered size={14} />
    </button>
    <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
    <button 
      onClick={() => onAction("[", "](url)")}
      className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600" 
      title="Enlace"
    >
      <LinkIcon size={14} />
    </button>
  </div>
);

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumeForm: React.FC<Props> = ({ data, onChange }) => {
  const handleMarkdownAction = (expId: string, prefix: string, suffix: string = "") => {
    const textarea = document.getElementById(`desc-${expId}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    updateExperience(expId, { description: newText });

    // Restablecer el foco y la selección (con un pequeño delay para que React actualice el DOM)
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };
  const updatePersonalInfo = (field: keyof ResumeData["personalInfo"], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...data.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newSections.length) {
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      onChange({ ...data, sections: newSections });
    }
  };

  const toggleSectionVisibility = (index: number) => {
    const newSections = [...data.sections];
    newSections[index].visible = !newSections[index].visible;
    onChange({ ...data, sections: newSections });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onChange({ ...data, experience: [newExp, ...data.experience] });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onChange({
      ...data,
      experience: data.experience.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: "",
      issuer: "",
      issueDate: { month: "", year: "" },
      expiryDate: { month: "", year: "" },
    };
    onChange({ ...data, certifications: [...data.certifications, newCert] });
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const removeCertification = (id: string) => {
    onChange({ ...data, certifications: data.certifications.filter((c) => c.id !== id) });
  };

  const addSkillGroup = () => {
    const newGroup: SkillGroup = { id: generateId(), title: "", items: [""] };
    onChange({ ...data, skills: [...data.skills, newGroup] });
  };

  const updateSkillGroup = (id: string, updates: Partial<SkillGroup>) => {
    onChange({ ...data, skills: data.skills.map(s => s.id === id ? { ...s, ...updates } : s) });
  };

  const addEvent = () => {
    const newEvent: Event = { id: generateId(), title: "", date: "", description: "" };
    onChange({ ...data, events: [...data.events, newEvent] });
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    onChange({ ...data, events: data.events.map(e => e.id === id ? { ...e, ...updates } : e) });
  };

  const renderExperienceSection = () => (
    <section id="section-experience" className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-slate-900">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Experiencia Laboral</h2>
          {!data.sections.find(s => s.id === 'experience')?.visible && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Oculto</span>
          )}
        </div>
        <button onClick={addExperience} className="flex items-center gap-1.5 text-xs bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-bold uppercase tracking-wider">
          <Plus size={14} /> Añadir
        </button>
      </div>
      <div className="space-y-8">
        <AnimatePresence>
          {data.experience.map((exp) => (
            <motion.div 
              key={exp.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-6 bg-slate-50 rounded-lg border border-slate-200 relative group"
            >
              <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mr-8">
                <InputGroup label="Empresa" value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} />
                <InputGroup label="Cargo" value={exp.position} onChange={(v) => updateExperience(exp.id, { position: v })} />
                <InputGroup label="Fecha Inicio" value={exp.startDate} onChange={(v) => updateExperience(exp.id, { startDate: v })} />
                <InputGroup label="Fecha Fin" value={exp.endDate} onChange={(v) => updateExperience(exp.id, { endDate: v })} />
                <div className="md:col-span-2">
                  <InputGroup label="Tecnologías (Separadas por coma)" value={exp.technologies?.join(", ") || ""} onChange={(v) => updateExperience(exp.id, { technologies: v.split(",").map(s => s.trim()) })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Descripción General (Soporta Markdown)</label>
                  <MarkdownToolbar 
                    textareaId={`desc-${exp.id}`} 
                    onAction={(prefix, suffix) => handleMarkdownAction(exp.id, prefix, suffix)} 
                  />
                  <textarea 
                    id={`desc-${exp.id}`}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32 text-sm text-slate-800"
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );

  const renderEducationSection = () => (
    <section id="section-education" className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-slate-900">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Educación</h2>
          {!data.sections.find(s => s.id === 'education')?.visible && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Oculto</span>
          )}
        </div>
        <button onClick={addEducation} className="flex items-center gap-1.5 text-xs bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-bold uppercase tracking-wider">
          <Plus size={14} /> Añadir
        </button>
      </div>
      <div className="space-y-4">
        {data.education.map((edu) => (
          <div key={edu.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200 relative">
            <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mr-8">
              <InputGroup label="Institución" value={edu.institution} onChange={(v) => updateEducation(edu.id, { institution: v })} />
              <InputGroup label="Título/Grado" value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} />
              <InputGroup label="Año Inicio (Opcional)" value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} />
              <InputGroup label="Año Fin" value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderCertificationsSection = () => (
    <section id="section-certifications" className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-slate-900">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Licencias y certificaciones</h2>
          {!data.sections.find(s => s.id === 'certifications')?.visible && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Oculto</span>
          )}
        </div>
        <button onClick={addCertification} className="flex items-center gap-1.5 text-xs bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-bold uppercase tracking-wider">
          <Plus size={14} /> Añadir
        </button>
      </div>
      <div className="space-y-6">
        {data.certifications.map((cert) => (
          <div key={cert.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200 relative">
            <button onClick={() => removeCertification(cert.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 gap-6 mr-8">
              <InputGroup label="Nombre*" value={cert.name} onChange={(v) => updateCertification(cert.id, { name: v })} />
              <InputGroup label="Empresa emisora*" value={cert.issuer} onChange={(v) => updateCertification(cert.id, { issuer: v })} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Fecha de expedición</label>
                  <div className="grid grid-cols-2 gap-2">
                     <select 
                       className="p-2.5 border border-slate-300 rounded text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                       value={cert.issueDate.month}
                       onChange={(e) => updateCertification(cert.id, { issueDate: { ...cert.issueDate, month: e.target.value } })}
                     >
                       <option value="">Mes</option>
                       {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                     <input 
                       type="text" placeholder="Año"
                       className="p-2.5 border border-slate-300 rounded text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                       value={cert.issueDate.year}
                       onChange={(e) => updateCertification(cert.id, { issueDate: { ...cert.issueDate, year: e.target.value } })}
                     />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Fecha de caducidad</label>
                  <div className="grid grid-cols-2 gap-2">
                     <select 
                       className="p-2.5 border border-slate-300 rounded text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                       value={cert.expiryDate.month}
                       onChange={(e) => updateCertification(cert.id, { expiryDate: { ...cert.expiryDate, month: e.target.value } })}
                     >
                       <option value="">Mes</option>
                       {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                     <input 
                       type="text" placeholder="Año"
                       className="p-2.5 border border-slate-300 rounded text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                       value={cert.expiryDate.year}
                       onChange={(e) => updateCertification(cert.id, { expiryDate: { ...cert.expiryDate, year: e.target.value } })}
                     />
                  </div>
                </div>
              </div>

              <InputGroup label="ID de la credencial" value={cert.credentialId || ""} onChange={(v) => updateCertification(cert.id, { credentialId: v })} />
              <InputGroup label="URL de la credencial" value={cert.credentialUrl || ""} onChange={(v) => updateCertification(cert.id, { credentialUrl: v })} />
              <InputGroup label="URL del Icono / Badge" value={cert.badgeUrl || ""} onChange={(v) => updateCertification(cert.id, { badgeUrl: v })} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderSkillsSection = () => (
    <section id="section-skills" className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-slate-900">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Conocimientos Técnicos</h2>
          {!data.sections.find(s => s.id === 'skills')?.visible && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Oculto</span>
          )}
        </div>
        <button onClick={addSkillGroup} className="flex items-center gap-1.5 text-xs bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-bold uppercase tracking-wider">
          <Plus size={14} /> Añadir Grupo
        </button>
      </div>
      <div className="space-y-4">
        {data.skills.map((group) => (
          <div key={group.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200 relative">
            <button 
              onClick={() => onChange({ ...data, skills: data.skills.filter(s => s.id !== group.id) })} 
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 gap-6 mr-8">
              <InputGroup label="Título del Grupo (ej: Lenguajes)" value={group.title} onChange={(v) => updateSkillGroup(group.id, { title: v })} />
              <InputGroup 
                label="Items (Separados por coma)" 
                value={group.items.join(", ")} 
                onChange={(v) => updateSkillGroup(group.id, { items: v.split(",").map(s => s.trim()) })} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderEventsSection = () => (
    <section id="section-events" className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-slate-900">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Eventos / Congresos</h2>
          {!data.sections.find(s => s.id === 'events')?.visible && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Oculto</span>
          )}
        </div>
        <button onClick={addEvent} className="flex items-center gap-1.5 text-xs bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-bold uppercase tracking-wider">
          <Plus size={14} /> Añadir Evento
        </button>
      </div>
      <div className="space-y-4">
        {data.events.map((event) => (
          <div key={event.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200 relative">
            <button 
              onClick={() => onChange({ ...data, events: data.events.filter(e => e.id !== event.id) })} 
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mr-8">
              <div className="md:col-span-2">
                <InputGroup label="Título" value={event.title} onChange={(v) => updateEvent(event.id, { title: v })} />
              </div>
              <InputGroup label="Fecha" value={event.date} onChange={(v) => updateEvent(event.id, { date: v })} />
              <div className="md:col-span-2">
                <InputGroup label="Descripción" value={event.description} onChange={(v) => updateEvent(event.id, { description: v })} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderSectionNode = (sectionId: string) => {
    switch (sectionId) {
      case 'experience': return renderExperienceSection();
      case 'education': return renderEducationSection();
      case 'certifications': return renderCertificationsSection();
      case 'skills': return renderSkillsSection();
      case 'events': return renderEventsSection();
      default: return null;
    }
  };

  return (
    <div className="space-y-10 pb-32">
      {/* Personal Info */}
      <section id="section-personal" className="bg-white rounded-lg">
        <h2 className="text-lg font-bold text-slate-900 mb-6 pb-2 border-b-2 border-slate-900 uppercase tracking-tight">
          Datos Personales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Nombre Completo" value={data.personalInfo.fullName} onChange={(v) => updatePersonalInfo("fullName", v)} />
          <InputGroup label="Email" value={data.personalInfo.email} onChange={(v) => updatePersonalInfo("email", v)} />
          <InputGroup label="Dirección" value={data.personalInfo.address} onChange={(v) => updatePersonalInfo("address", v)} />
          <InputGroup label="Ciudad" value={data.personalInfo.city} onChange={(v) => updatePersonalInfo("city", v)} />
          <InputGroup label="País/Región" value={data.personalInfo.country} onChange={(v) => updatePersonalInfo("country", v)} />
          <InputGroup label="Teléfono" value={data.personalInfo.phone} onChange={(v) => updatePersonalInfo("phone", v)} />
          <div className="md:col-span-2">
            <InputGroup label="Sitio Web / LinkedIn" value={data.personalInfo.website} onChange={(v) => updatePersonalInfo("website", v)} />
          </div>
        </div>
      </section>

      {/* Configuration Section Management */}
      <section id="section-config" className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
          <GripVertical size={20} className="text-primary" />
          Orden y Visibilidad de Secciones
        </h2>
        <p className="text-xs text-slate-500 mb-6 font-medium">Reorganiza las secciones arrastrando o usa las flechas. Oculta las que no necesites por el momento.</p>
        
        <div className="space-y-2">
          {data.sections?.map((section, idx) => (
            <div key={section.id} className={`flex items-center justify-between p-3 rounded-md border transition-all ${section.visible ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-100 border-transparent opacity-50'}`}>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}</span>
                <span className="text-sm font-semibold text-slate-700">{section.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleSectionVisibility(idx)}
                  className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${section.visible ? 'text-primary' : 'text-slate-400'}`}
                  title={section.visible ? 'Ocultar' : 'Mostrar'}
                >
                  {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
                <button 
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, 'up')}
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-500"
                >
                  <ChevronUp size={16} />
                </button>
                <button 
                  disabled={idx === data.sections.length - 1}
                  onClick={() => moveSection(idx, 'down')}
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-500"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Sections Rendered in Order */}
      {data.sections.map(s => (
        <React.Fragment key={s.id}>
           {renderSectionNode(s.id)}
        </React.Fragment>
      ))}
    </div>
  );
};

const InputGroup: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-widest">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-slate-800 bg-white"
    />
  </div>
);

export default ResumeForm;
