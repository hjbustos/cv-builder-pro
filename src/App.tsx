/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ResumeData } from './types';
import { INITIAL_DATA } from './constants';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { Printer, Edit3, Eye, Info, Download, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { exportToCSV, importFromCSV } from './lib/csvHelper';

function NavOption({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer text-sm font-medium ${active ? 'bg-slate-100 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
    >
      <span className="text-lg opacity-80">{icon}</span>
      <span className="hidden lg:inline">{label}</span>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handlePrint = () => {
    window.focus();
    window.print();
  };

  const handleExportCSV = () => {
    exportToCSV(data);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const newData = importFromCSV(text);
        setData(newData);
        alert("Datos importados correctamente.");
      } catch (err) {
        console.error("Error al importar CSV:", err);
        alert("Error al procesar el archivo CSV. Asegúrate de que sea un archivo válido exportado por esta aplicación.");
      }
    };
    reader.readAsText(file);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-bg-app font-sans">
      {/* Navbar - Geometric Balance Style */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-header text-white z-50 px-6 flex items-center justify-between print-hidden border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded shadow-lg flex items-center justify-center">
            <Edit3 size={18} className="text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">CV Builder Pro</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 mr-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider bg-slate-800 px-3 py-1.5 rounded"
              title="Guardar como CSV"
            >
              <Download size={14} /> <span>Exportar</span>
            </button>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider bg-slate-800 px-3 py-1.5 rounded cursor-pointer" title="Cargar desde CSV">
              <Upload size={14} /> <span>Cargar</span>
              <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
            </label>
          </div>

          {!isLargeScreen && (
            <div className="flex p-1 bg-slate-800 rounded-lg">
              <button 
                onClick={() => setActiveTab('editor')}
                className={`p-1.5 rounded-md transition-all ${activeTab === 'editor' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`p-1.5 rounded-md transition-all ${activeTab === 'preview' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
              >
                <Eye size={18} />
              </button>
            </div>
          )}

          <button 
            onClick={handlePrint}
            className="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <Printer size={16} />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 h-[calc(100vh-64px)] overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar Area */}
          {isLargeScreen && (
            <aside className="w-60 bg-white border-r border-border-theme p-6 hidden md:flex flex-col gap-6 print-hidden overflow-y-auto">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Estructura</p>
                <nav className="flex flex-col gap-1">
                  <NavOption icon="👤" label="Datos Personales" onClick={() => scrollToSection('section-personal')} />
                  <NavOption icon="⚙️" label="Configuración" onClick={() => scrollToSection('section-config')} />
                </nav>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Diseño / Temas</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['geometric', 'minimalist', 'modern', 'technical'] as const).map((tId) => (
                    <button
                      key={tId}
                      onClick={() => setData({ ...data, selectedTemplate: tId })}
                      className={`px-2 py-3 rounded border text-[10px] font-bold uppercase tracking-tighter transition-all ${
                        data.selectedTemplate === tId 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {tId}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Contenido</p>
                <nav className="flex flex-col gap-1">
                  <NavOption icon="💼" label="Experiencia" onClick={() => scrollToSection('section-experience')} />
                  <NavOption icon="🎓" label="Educación" onClick={() => scrollToSection('section-education')} />
                  <NavOption icon="🏆" label="Certificaciones" onClick={() => scrollToSection('section-certifications')} />
                  <NavOption icon="🛠️" label="Habilidades" onClick={() => scrollToSection('section-skills')} />
                  <NavOption icon="🎤" label="Eventos" onClick={() => scrollToSection('section-events')} />
                </nav>
              </div>

              <div className="mt-auto p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-3">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Tamaño de Hoja</p>
                  <div className="flex bg-white rounded border border-slate-200 p-0.5">
                    {(['A4', 'Letter'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setData({ ...data, pageSize: size })}
                        className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                          data.pageSize === size 
                          ? 'bg-slate-900 text-white shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Diseño Seleccionado</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-text-slate font-bold uppercase">{data.selectedTemplate}</p>
                    <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">{data.pageSize}</span>
                  </div>
                </div>
              </div>
            </aside>
          )}


          {/* Editor Column */}
          {(isLargeScreen || activeTab === 'editor') && (
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white custom-scrollbar print-hidden">
              <div className="max-w-3xl mx-auto">
                <header className="mb-8 block">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Editor de Currículum</h2>
                  <p className="text-sm text-text-muted">Modifica los datos y observa los cambios instantáneamente.</p>
                  <p className="mt-2 text-[11px] text-primary bg-blue-50 p-3 rounded border border-blue-100 font-medium flex items-center gap-3">
                    <span className="flex-shrink-0 bg-blue-100 p-1.5 rounded-full"><Info size={14} /></span>
                    <span>
                      Tip: Si el botón "Exportar PDF" no abre el diálogo, intenta abrir la app en una <strong>pestaña nueva</strong>.
                    </span>
                  </p>
                </header>
                <ResumeForm data={data} onChange={setData} />
              </div>
            </div>
          )}

          {/* Preview Column - Panel Style */}
          {(isLargeScreen || activeTab === 'preview') && (
            <div className="preview-container flex-1 bg-white md:bg-slate-200 p-0 md:p-12 overflow-y-auto custom-scrollbar flex justify-center items-start print:bg-white print:p-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="print:m-0 w-full flex justify-center py-6 md:py-0 px-4 md:px-0"
              >
                <ResumePreview data={data} />
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
