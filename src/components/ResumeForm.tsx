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
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    personal: false,
    experience: false,
    education: false,
    certifications: false,
    skills: false,
    events: false,
  });

  const toggleExpand = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

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

  const moveItem = (sectionId: keyof ResumeData, index: number, direction: 'up' | 'down') => {
    const items = [...(data[sectionId] as any[])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < items.length) {
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      
      const updates: any = { [sectionId]: items };
      // Switch to manual if moving items
      if (data.sortConfig && (sectionId as string) in data.sortConfig) {
        updates.sortConfig = { ...data.sortConfig, [sectionId]: 'manual' };
      }
      
      onChange({ ...data, ...updates });
    }
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
    newSections[index] = { ...newSections[index], visible: !newSections[index].visible };
    onChange({ ...data, sections: newSections });
  };

  const setSortType = (sectionId: keyof ResumeData["sortConfig"], type: 'date' | 'manual') => {
    onChange({
      ...data,
      sortConfig: { ...data.sortConfig, [sectionId]: type }
    });
  };

  const SortControls = ({ sectionId }: { sectionId: keyof ResumeData["sortConfig"] }) => (
    <div className="flex bg-slate-100 p-1 rounded-md mb-2 w-fit">
      <button 
        onClick={() => setSortType(sectionId, 'date')}
        className={`px-3 py-1 text-[10px] font-bold rounded transition-all flex items-center gap-1 ${data.sortConfig[sectionId] === 'date' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <ListOrdered size={12} /> FECHA
      </button>
      <button 
        onClick={() => setSortType(sectionId, 'manual')}
        className={`px-3 py-1 text-[10px] font-bold rounded transition-all flex items-center gap-1 ${data.sortConfig[sectionId] === 'manual' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <GripVertical size={12} /> MANUAL
      </button>
    </div>
  );

  const ItemActions = ({ onRemove, onMoveUp, onMoveDown, isFirst, isLast }: { onRemove: () => void, onMoveUp: () => void, onMoveDown: () => void, isFirst: boolean, isLast: boolean }) => (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <div className="flex bg-white rounded border border-slate-200">
        <button 
          disabled={isFirst}
          onClick={onMoveUp}
          className="p-1 px-1.5 hover:bg-slate-50 disabled:opacity-30 text-slate-400 hover:text-slate-600 transition-colors border-r border-slate-200"
        >
          <ChevronUp size={16} />
        </button>
        <button 
          disabled={isLast}
          onClick={onMoveDown}
          className="p-1 px-1.5 hover:bg-slate-50 disabled:opacity-30 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronDown size={16} />
        </button>
      </div>
      <button onClick={onRemove} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
        <Trash2 size={18} />
      </button>
    </div>
  );

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
    <section id="section-experience" className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
      <div 
        onClick={() => toggleExpand('experience')}
        className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Evolución Profesional</h2>
          {!data.sections.find(s => s.id === 'experience')?.visible && (
            <span className="text-[10px] bg-white text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-slate-200">Oculto</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); addExperience(); }} 
            className="flex items-center gap-1.5 text-[10px] bg-primary text-white px-3 py-1.5 rounded transition-all font-bold uppercase tracking-wider shadow-sm hover:translate-y-[-1px]"
          >
            <Plus size={12} /> Añadir
          </button>
          <div className={`transition-transform duration-200 ${expandedSections.experience ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} className="text-slate-400" />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expandedSections.experience && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              <SortControls sectionId="experience" />
              <div className="space-y-8 mt-4">
                <AnimatePresence>
                  {data.experience.map((exp, idx) => (
                    <motion.div 
                      key={exp.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="p-6 bg-slate-50 rounded-lg border border-slate-200 relative group"
                    >
                      <ItemActions 
                        onRemove={() => removeExperience(exp.id)} 
                        onMoveUp={() => moveItem('experience', idx, 'up')}
                        onMoveDown={() => moveItem('experience', idx, 'down')}
                        isFirst={idx === 0}
                        isLast={idx === data.experience.length - 1}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mr-16">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );

  const renderEducationSection = () => (
    <section id="section-education" className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
      <div 
        onClick={() => toggleExpand('education')}
        className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Formación Académica</h2>
          {!data.sections.find(s => s.id === 'education')?.visible && (
            <span className="text-[10px] bg-white text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-slate-200">Oculto</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); addEducation(); }} 
            className="flex items-center gap-1.5 text-[10px] bg-primary text-white px-3 py-1.5 rounded transition-all font-bold uppercase tracking-wider shadow-sm hover:translate-y-[-1px]"
          >
            <Plus size={12} /> Añadir
          </button>
          <div className={`transition-transform duration-200 ${expandedSections.education ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} className="text-slate-400" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expandedSections.education && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              <SortControls sectionId="education" />
              <div className="space-y-4 mt-4">
                {data.education.map((edu, idx) => (
                  <div key={edu.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200 relative">
                    <ItemActions 
                      onRemove={() => removeEducation(edu.id)} 
                      onMoveUp={() => moveItem('education', idx, 'up')}
                      onMoveDown={() => moveItem('education', idx, 'down')}
                      isFirst={idx === 0}
                      isLast={idx === data.education.length - 1}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mr-16">
                      <InputGroup label="Institución" value={edu.institution} onChange={(v) => updateEducation(edu.id, { institution: v })} />
                      <InputGroup label="Título/Grado" value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} />
                      <InputGroup label="Año Inicio (Opcional)" value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} />
                      <InputGroup label="Año Fin" value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} />
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Comentario / Descripción (Opcional)</label>
                        <textarea 
                          className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 text-sm text-slate-800 bg-white"
                          value={edu.description || ""}
                          onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                          placeholder="Ej: Mención honorífica, promedio sobresaliente, tesis sobre..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );

  const renderCertificationsSection = () => (
    <section id="section-certifications" className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
      <div 
        onClick={() => toggleExpand('certifications')}
        className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Certificaciones Relevantes</h2>
          {!data.sections.find(s => s.id === 'certifications')?.visible && (
            <span className="text-[10px] bg-white text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-slate-200">Oculto</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); addCertification(); }} 
            className="flex items-center gap-1.5 text-[10px] bg-primary text-white px-3 py-1.5 rounded transition-all font-bold uppercase tracking-wider shadow-sm hover:translate-y-[-1px]"
          >
            <Plus size={12} /> Añadir
          </button>
          <div className={`transition-transform duration-200 ${expandedSections.certifications ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} className="text-slate-400" />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expandedSections.certifications && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              <SortControls sectionId="certifications" />
              <div className="space-y-6 mt-4">
                {data.certifications.map((cert, idx) => (
                  <div key={cert.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200 relative">
                    <ItemActions 
                      onRemove={() => removeCertification(cert.id)} 
                      onMoveUp={() => moveItem('certifications', idx, 'up')}
                      onMoveDown={() => moveItem('certifications', idx, 'down')}
                      isFirst={idx === 0}
                      isLast={idx === data.certifications.length - 1}
                    />
                    <div className="grid grid-cols-1 gap-6 mr-16">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );

  const renderSkillsSection = () => (
    <section id="section-skills" className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
      <div 
        onClick={() => toggleExpand('skills')}
        className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Stack Técnico</h2>
          {!data.sections.find(s => s.id === 'skills')?.visible && (
            <span className="text-[10px] bg-white text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-slate-200">Oculto</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); addSkillGroup(); }} 
            className="flex items-center gap-1.5 text-[10px] bg-primary text-white px-3 py-1.5 rounded transition-all font-bold uppercase tracking-wider shadow-sm hover:translate-y-[-1px]"
          >
            <Plus size={12} /> Añadir
          </button>
          <div className={`transition-transform duration-200 ${expandedSections.skills ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} className="text-slate-400" />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expandedSections.skills && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              <SortControls sectionId="skills" />
              <div className="space-y-4 mt-4">
                {data.skills.map((group, idx) => (
                  <div key={group.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200 relative">
                    <ItemActions 
                      onRemove={() => onChange({ ...data, skills: data.skills.filter(s => s.id !== group.id) })} 
                      onMoveUp={() => moveItem('skills', idx, 'up')}
                      onMoveDown={() => moveItem('skills', idx, 'down')}
                      isFirst={idx === 0}
                      isLast={idx === data.skills.length - 1}
                    />
                    <div className="grid grid-cols-1 gap-6 mr-16">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );

  const renderEventsSection = () => (
    <section id="section-events" className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
      <div 
        onClick={() => toggleExpand('events')}
        className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Participación en Eventos</h2>
          {!data.sections.find(s => s.id === 'events')?.visible && (
            <span className="text-[10px] bg-white text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-slate-200">Oculto</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); addEvent(); }} 
            className="flex items-center gap-1.5 text-[10px] bg-primary text-white px-3 py-1.5 rounded transition-all font-bold uppercase tracking-wider shadow-sm hover:translate-y-[-1px]"
          >
            <Plus size={12} /> Añadir
          </button>
          <div className={`transition-transform duration-200 ${expandedSections.events ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} className="text-slate-400" />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expandedSections.events && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              <SortControls sectionId="events" />
              <div className="space-y-4 mt-4">
                {data.events.map((event, idx) => (
                  <div key={event.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200 relative">
                    <ItemActions 
                      onRemove={() => onChange({ ...data, events: data.events.filter(e => e.id !== event.id) })} 
                      onMoveUp={() => moveItem('events', idx, 'up')}
                      onMoveDown={() => moveItem('events', idx, 'down')}
                      isFirst={idx === 0}
                      isLast={idx === data.events.length - 1}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mr-16">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      <section id="section-personal" className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div 
          onClick={() => toggleExpand('personal')}
          className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-200"
        >
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Datos Personales
          </h2>
          <div className={`transition-transform duration-200 ${expandedSections.personal ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} className="text-slate-400" />
          </div>
        </div>
        
        <AnimatePresence>
          {expandedSections.personal && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </motion.div>
          )}
        </AnimatePresence>
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
