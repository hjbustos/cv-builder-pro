import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ResumeData, SectionId } from "../types";
import { translateResumeToEnglish } from "../services/geminiService";
import { Loader2, Languages } from "lucide-react";

interface Props {
  data: ResumeData;
}

const BadgeImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = React.useState(false);

  // Reset error state when src changes
  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) return null;

  return (
    <div className="flex-shrink-0 w-12 h-12 bg-gray-50 border border-gray-100 rounded p-1 flex items-center justify-center overflow-hidden">
      <img 
        key={src}
        src={src} 
        alt={alt} 
        className="max-w-full max-h-full object-contain"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

const ResumePreview: React.FC<Props> = ({ data: originalData }) => {
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [translatedData, setTranslatedData] = useState<ResumeData | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(false);

  const handleTranslate = async () => {
    if (language === 'en') return;
    setLanguage('en');
    if (!translatedData) {
      setIsTranslating(true);
      setTranslationError(false);
      try {
        const result = await translateResumeToEnglish(originalData);
        setTranslatedData(result);
      } catch (err) {
        console.error(err);
        setTranslationError(true);
        setLanguage('es');
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const data = language === 'en' && translatedData ? translatedData : originalData;
  const t = (es: string, en: string) => language === 'es' ? es : en;

  // --- RENDERING HELPERS (SHARED DATA) ---
  
  const SectionTitle = ({ es, en }: { es: string; en: string }) => {
    const label = t(es, en);
    const template = data.selectedTemplate;

    if (template === 'minimalist') {
      return (
        <div className="border-b border-gray-300 mb-4 mt-8 pb-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">{label}</h2>
        </div>
      );
    }

    if (template === 'modern') {
      return (
        <h2 className="text-lg font-extrabold text-blue-900 border-l-4 border-blue-900 pl-3 mb-4 uppercase tracking-tighter">
          {label}
        </h2>
      );
    }

    if (template === 'technical') {
      return (
        <div className="flex items-center gap-4 mb-4 mt-6">
          <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">0X{label.substring(0,2).toUpperCase()}</span>
          <h2 className="text-sm font-bold uppercase tracking-tight text-black border-b-2 border-black flex-1">{label}</h2>
        </div>
      );
    }

    // Default Geometric
    return (
      <div className="bg-black text-white px-3 py-1 font-bold text-xs inline-block w-full uppercase">
        {label.split(' ').map((word, i) => (
          <React.Fragment key={i}>
            {word}{i < label.split(' ').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderExperience = () => (
    data.experience.length > 0 && (
      <div className={`${data.selectedTemplate === 'geometric' ? 'grid grid-cols-[150px_1fr] gap-x-8' : 'flex flex-col'} break-inside-avoid mb-10`}>
        {data.selectedTemplate === 'geometric' && (
          <div>
            <SectionTitle es="EXPERIENCIA LABORAL" en="WORK EXPERIENCE" />
          </div>
        )}
        <div className="space-y-8 flex-1">
          {data.selectedTemplate !== 'geometric' && <SectionTitle es="EXPERIENCIA LABORAL" en="WORK EXPERIENCE" />}
          {data.experience.map((exp) => (
            <div key={exp.id} className="relative break-inside-avoid">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={`font-bold ${data.selectedTemplate === 'modern' ? 'text-xl text-blue-900' : 'text-lg'}`}>{exp.company}</h3>
                <span className={`font-bold ${data.selectedTemplate === 'technical' ? 'font-mono text-xs' : ''}`}>{exp.startDate} — {exp.endDate}</span>
              </div>
              <p className={`font-medium mb-3 ${data.selectedTemplate === 'minimalist' ? 'italic text-gray-600' : 'text-gray-800'}`}>{exp.position}</p>
              
              <div className="markdown-body prose prose-slate max-w-none text-sm leading-relaxed mb-4">
                <ReactMarkdown>{exp.description}</ReactMarkdown>
              </div>

              {exp.technologies && (
                 <div className="mb-4">
                    <p className="font-bold underline mb-1">{t('Tecnologías en uso:', 'Technologies used:')}</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {exp.technologies.map((tech, idx) => (
                        <li key={idx} className="marker:text-black">{tech}</li>
                      ))}
                    </ul>
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderEducation = () => (
    data.education.length > 0 && (
      <div className={`${data.selectedTemplate === 'geometric' ? 'grid grid-cols-[150px_1fr] gap-x-8' : 'flex flex-col'} break-inside-avoid mb-10`}>
        {data.selectedTemplate === 'geometric' && (
          <div>
            <SectionTitle es="EDUCACIÓN" en="EDUCATION" />
          </div>
        )}
        <div className="space-y-6 flex-1">
          {data.selectedTemplate !== 'geometric' && <SectionTitle es="EDUCACIÓN" en="EDUCATION" />}
          {data.education.map((edu) => (
            <div key={edu.id} className="break-inside-avoid">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-lg">{edu.degree}</h3>
                <span className={`font-bold ${data.selectedTemplate === 'technical' ? 'font-mono text-xs' : ''}`}>{edu.startDate ? `${edu.startDate} — ` : ""}{edu.endDate}</span>
              </div>
              <p className="font-medium text-gray-700">{edu.institution}</p>
              {edu.description && <p className="mt-2 leading-relaxed text-gray-600 italic border-l-2 border-gray-100 pl-3">{edu.description}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderCertifications = () => (
    data.certifications.length > 0 && (
      <div className={`${data.selectedTemplate === 'geometric' ? 'grid grid-cols-[150px_1fr] gap-x-8' : 'flex flex-col'} break-inside-avoid mb-10`}>
        {data.selectedTemplate === 'geometric' && (
          <div>
            <SectionTitle es="LICENCIAS Y CERTIFICACIONES" en="LICENSES & CERTIFICATIONS" />
          </div>
        )}
        <div className="space-y-4 flex-1">
          {data.selectedTemplate !== 'geometric' && <SectionTitle es="LICENCIAS Y CERTIFICACIONES" en="LICENSES & CERTIFICATIONS" />}
          {data.certifications.map((cert) => (
            <div key={cert.id} className="relative break-inside-avoid">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold">{cert.name}</h3>
                <span className={`font-bold ${data.selectedTemplate === 'technical' ? 'font-mono text-xs' : ''}`}>
                  {cert.issueDate.month} {cert.issueDate.year} {cert.expiryDate.year ? `— ${cert.expiryDate.month} ${cert.expiryDate.year}` : t("— Sin fecha de caducidad", "— No expiration date")}
                </span>
              </div>
              <p className="font-medium text-gray-700">{cert.issuer}</p>
              {cert.credentialId && <p className="text-xs text-gray-500 mt-1">{t('ID de la credencial:', 'Credential ID:')} {cert.credentialId}</p>}
              <div className="flex items-center gap-4 mt-2">
                {cert.badgeUrl && (
                  <BadgeImage src={cert.badgeUrl} alt={`${cert.name} Badge`} />
                )}
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-700 underline truncate hover:text-blue-800 transition-colors">
                     {t('Ver credencial comprobada', 'View verified credential')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderSkills = () => (
    data.skills.length > 0 && (
      <div className={`${data.selectedTemplate === 'geometric' ? 'grid grid-cols-[150px_1fr] gap-x-8' : 'flex flex-col'} break-inside-avoid mb-10`}>
        {data.selectedTemplate === 'geometric' && (
          <div>
            <SectionTitle es="CONOCIMIENTOS TÉCNICOS" en="TECHNICAL SKILLS" />
          </div>
        )}
        <div className="space-y-4 flex-1">
          {data.selectedTemplate !== 'geometric' && <SectionTitle es="CONOCIMIENTOS TÉCNICOS" en="TECHNICAL SKILLS" />}
          <div className={`grid ${data.selectedTemplate === 'modern' ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-4'}`}>
            {data.skills.map((group) => (
              <div key={group.id} className="break-inside-avoid">
                <p className="font-bold mb-1 uppercase text-xs tracking-wider text-gray-500">{group.title}</p>
                <p className={`leading-relaxed ${data.selectedTemplate === 'technical' ? 'font-mono text-xs' : ''}`}>{group.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );

  const renderEvents = () => (
    data.events.length > 0 && (
      <div className={`${data.selectedTemplate === 'geometric' ? 'grid grid-cols-[150px_1fr] gap-x-8' : 'flex flex-col'} break-inside-avoid mb-10`}>
        {data.selectedTemplate === 'geometric' && (
          <div>
            <SectionTitle es="CONGRESOS SEMINARIOS Y CONFERENCIAS" en="CONGRESSES SEMINARS & CONFERENCES" />
          </div>
        )}
        <div className="space-y-4 flex-1">
          {data.selectedTemplate !== 'geometric' && <SectionTitle es="CONGRESOS SEMINARIOS Y CONFERENCIAS" en="CONGRESSES SEMINARS & CONFERENCES" />}
          {data.events.map((event) => (
             <div key={event.id} className="break-inside-avoid">
               <p className="font-bold mb-1">- {event.title} ({event.date})</p>
               {event.description && <p className="leading-relaxed ml-3 text-gray-600">{event.description}</p>}
             </div>
           ))}
        </div>
      </div>
    )
  );

  const renderSection = (id: SectionId) => {
    switch (id) {
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'certifications': return renderCertifications();
      case 'skills': return renderSkills();
      case 'events': return renderEvents();
      default: return null;
    }
  };

  // --- TEMPLATE WRAPPERS ---

  const GeometricLayout = () => (
    <div className="bg-white p-12 shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] font-sans text-sm text-gray-900 border border-gray-100 relative" id="resume-preview">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-8">
        <h1 className="text-5xl font-bold tracking-tight text-black">{data.personalInfo.fullName}</h1>
      </div>

      {/* Main Body */}
      <div className="space-y-2">
        {/* Contact info row */}
        <div className="grid grid-cols-[150px_1fr] gap-x-8 break-inside-avoid mb-10">
          <div>
            <div className="bg-black text-white px-3 py-1 font-bold text-xs inline-block w-full uppercase">
              {t('CONTACTOS', 'CONTACT')}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <p>{data.personalInfo.address}</p>
              <p>{data.personalInfo.country}</p>
              <p>{data.personalInfo.city}</p>
            </div>
            <div className="text-right space-y-0.5">
              <p><span className="font-bold">{t('Correo electrónico:', 'Email:')}</span> {data.personalInfo.email}</p>
              <p><span className="font-bold">{t('Página web:', 'Website:')}</span></p>
              <p className="text-blue-700 underline truncate text-xs">{data.personalInfo.website}</p>
              <p><span className="font-bold">{t('Teléfono:', 'Phone:')}</span> {data.personalInfo.phone}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Sections */}
        {data.sections?.filter(s => s.visible).map(s => (
          <React.Fragment key={s.id}>
            {renderSection(s.id)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const MinimalistLayout = () => (
    <div className="bg-white p-16 shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] font-serif text-sm text-gray-800 border border-gray-100 relative" id="resume-preview">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-light tracking-[0.1em] text-gray-900 mb-4 uppercase">{data.personalInfo.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500 uppercase tracking-widest font-sans">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.city}, {data.personalInfo.country}</span>
          <span>{data.personalInfo.website}</span>
        </div>
      </div>

      <div className="space-y-2 font-sans">
        {data.sections?.filter(s => s.visible).map(s => (
          <React.Fragment key={s.id}>
            {renderSection(s.id)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const ModernLayout = () => (
    <div className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] font-sans flex border border-gray-100 relative" id="resume-preview">
      {/* Sidebar */}
      <div className="w-[280px] bg-blue-900 text-white p-10 flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-black uppercase leading-tight mb-2 tracking-tighter">{data.personalInfo.fullName}</h1>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest opacity-80">{data.experience[0]?.position || "Profesional"}</p>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-300 border-b border-blue-800 mb-3 pb-1">Contacto</h3>
            <div className="space-y-3 text-xs opacity-90">
              <p className="flex flex-col gap-1">
                <span className="font-bold text-blue-200">Email</span>
                {data.personalInfo.email}
              </p>
              <p className="flex flex-col gap-1">
                <span className="font-bold text-blue-200">Teléfono</span>
                {data.personalInfo.phone}
              </p>
              <p className="flex flex-col gap-1">
                <span className="font-bold text-blue-200">Ubicación</span>
                {data.personalInfo.city}, {data.personalInfo.country}
              </p>
              <p className="flex flex-col gap-1">
                <span className="font-bold text-blue-200">LinkedIn/Web</span>
                <span className="break-all">{data.personalInfo.website}</span>
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-12 space-y-1">
        {data.sections?.filter(s => s.visible).map(s => (
          <React.Fragment key={s.id}>
            {renderSection(s.id)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const TechnicalLayout = () => (
    <div className="bg-white p-12 shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] font-mono text-[13px] text-gray-900 border-4 border-black relative" id="resume-preview">
      {/* Dev Header */}
      <div className="bg-black text-white p-6 mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase">{data.personalInfo.fullName}</h1>
          <p className="opacity-70 text-xs mt-1 lowercase">&lt;root@dev&gt; ~ /cv</p>
        </div>
        <div className="hidden md:block">
           <div className="flex gap-2 mb-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <p className="text-[10px] text-right font-bold text-white/40">v2.0.0-PROD</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 bg-gray-50 p-4 border border-gray-200">
         <p><span className="font-bold mr-2">Email:</span> {data.personalInfo.email}</p>
         <p><span className="font-bold mr-2">Phone:</span> {data.personalInfo.phone}</p>
         <p><span className="font-bold mr-2">Loc:</span> {data.personalInfo.city}</p>
         <p className="truncate"><span className="font-bold mr-2">Link:</span> {data.personalInfo.website}</p>
      </div>

      <div className="space-y-1">
        {data.sections?.filter(s => s.visible).map(s => (
          <React.Fragment key={s.id}>
            {renderSection(s.id)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (data.selectedTemplate) {
      case 'minimalist': return <MinimalistLayout />;
      case 'modern': return <ModernLayout />;
      case 'technical': return <TechnicalLayout />;
      default: return <GeometricLayout />;
    }
  };

  return (
    <div className="relative group/resume pt-12">
      {/* Language Switcher UI */}
      <div className="absolute top-0 left-0 right-0 h-12 flex justify-center items-center gap-2 print-hidden border-b border-gray-100 bg-white/80 backdrop-blur-sm z-20 rounded-t-xl overflow-hidden">
        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
          <button 
            onClick={() => setLanguage('es')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'es' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ES
          </button>
          <button 
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${language === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {isTranslating ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Languages size={12} />
            )}
            EN
          </button>
        </div>
        {translationError && (
          <p className="text-[10px] text-red-500 font-medium">Error al traducir</p>
        )}
      </div>

      {/* Background Page Indicators (Horizontal lines and page numbers) */}
      <div className="absolute inset-0 pointer-events-none print-hidden" style={{ zIndex: 10 }}>
        <div className="absolute w-full border-t-2 border-dashed border-red-400 opacity-0 group-hover/resume:opacity-100 transition-opacity" style={{ top: '297mm' }}>
         <span className="absolute right-0 -top-6 bg-red-400 text-white text-[10px] px-2 py-0.5 rounded-l font-bold italic tracking-widest uppercase">{t('Fin de Página 1', 'End of Page 1')}</span>
        </div>
        <div className="absolute w-full border-t-2 border-dashed border-red-400 opacity-0 group-hover/resume:opacity-100 transition-opacity" style={{ top: '594mm' }}>
          <span className="absolute right-0 -top-6 bg-red-400 text-white text-[10px] px-2 py-0.5 rounded-l font-bold italic tracking-widest uppercase">{t('Fin de Página 2', 'End of Page 2')}</span>
        </div>
      </div>

      {/* Render selected template */}
      {renderLayout()}

      {/* Footer info for all templates */}
      <div className="max-w-[210mm] mx-auto mt-4 px-4 pb-8 flex justify-between items-center text-[10px] text-slate-400 font-medium print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse"></span>
          <span>Draft V1.2 - {data.selectedTemplate.toUpperCase()}</span>
        </div>
        <span>© {new Date().getFullYear()} CV Designer Pro</span>
      </div>
    </div>
  );
};

export default ResumePreview;
