
import React, { useState, useEffect } from 'react';
import { X, PlayCircle, CheckCircle, Circle, ChevronLeft, ChevronRight, Award, FileText, Video } from 'lucide-react';
import { TrainingCourse, TrainingAssignment, TrainingModule } from '../../types';

interface CoursePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: TrainingCourse | null;
  assignment: TrainingAssignment | null;
  onUpdateProgress: (assignmentId: string, progress: number, completedModules: string[]) => void;
}

const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({ isOpen, onClose, course, assignment, onUpdateProgress }) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && assignment) {
      setCompletedModules(assignment.completedModuleIds || []);
      // Find first incomplete module or start at 0
      if (course) {
          const firstIncomplete = course.modules.findIndex(m => !(assignment.completedModuleIds || []).includes(m.id));
          setActiveModuleIndex(firstIncomplete !== -1 ? firstIncomplete : 0);
      }
    }
  }, [isOpen, assignment, course]);

  if (!isOpen || !course || !assignment) return null;

  const activeModule = course.modules[activeModuleIndex];
  const isLastModule = activeModuleIndex === course.modules.length - 1;
  const isModuleCompleted = completedModules.includes(activeModule.id);

  const handleCompleteModule = () => {
    if (!completedModules.includes(activeModule.id)) {
        const newCompleted = [...completedModules, activeModule.id];
        setCompletedModules(newCompleted);
        
        // Calculate total progress
        const progress = Math.round((newCompleted.length / course.modules.length) * 100);
        onUpdateProgress(assignment.id, progress, newCompleted);
    }

    if (!isLastModule) {
        setActiveModuleIndex(prev => prev + 1);
    }
  };

  const handleDownloadCertificate = () => {
      alert("Certificate PDF downloaded (simulation).");
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black text-white flex flex-col animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><X size={20} /></button>
              <div>
                  <h2 className="text-sm font-bold">{course.title}</h2>
                  <p className="text-xs text-gray-400">Module {activeModuleIndex + 1} of {course.modules.length}</p>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400">Course Progress</p>
                  <p className="text-sm font-bold text-white">{Math.round((completedModules.length / course.modules.length) * 100)}%</p>
              </div>
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500" 
                    style={{ width: `${(completedModules.length / course.modules.length) * 100}%` }}
                  />
              </div>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
          
          {/* Player Area */}
          <div className="flex-1 bg-black flex flex-col">
              <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0a0a] relative">
                  {/* Mock Content Player */}
                  <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800 shadow-2xl relative overflow-hidden group">
                      {activeModule.type === 'Video' ? (
                          <div className="text-center">
                              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform cursor-pointer backdrop-blur-sm">
                                  <PlayCircle size={48} className="text-white" />
                              </div>
                              <h3 className="text-xl font-medium text-gray-300">Video Content Placeholder</h3>
                              <p className="text-sm text-gray-500 mt-2">{activeModule.duration}</p>
                          </div>
                      ) : (
                          <div className="text-center">
                              <FileText size={64} className="text-gray-700 mx-auto mb-4" />
                              <h3 className="text-xl font-medium text-gray-300">{activeModule.type} Content</h3>
                              <p className="text-sm text-gray-500 mt-2">Read the materials below</p>
                          </div>
                      )}
                      
                      {/* Success Overlay if complete */}
                      {isModuleCompleted && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 animate-in fade-in">
                              <div className="text-center">
                                  <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                                  <h3 className="text-2xl font-bold text-white">Module Completed</h3>
                                  <button onClick={() => setActiveModuleIndex(prev => Math.min(prev + 1, course.modules.length - 1))} className="mt-4 text-sm text-gray-300 hover:text-white underline">Replay</button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
              
              {/* Footer Controls */}
              <div className="h-20 border-t border-gray-800 bg-gray-900 px-8 flex items-center justify-between">
                  <button 
                    disabled={activeModuleIndex === 0}
                    onClick={() => setActiveModuleIndex(prev => prev - 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-sm font-medium"
                  >
                      <ChevronLeft size={16} /> Previous
                  </button>

                  <div className="text-center">
                      <h3 className="text-sm font-bold text-white">{activeModule.title}</h3>
                      <span className="text-xs text-gray-500">{activeModule.type} • {activeModule.duration}</span>
                  </div>

                  {isLastModule && isModuleCompleted ? (
                      <button 
                        onClick={handleDownloadCertificate}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition-all text-sm font-bold shadow-lg shadow-yellow-900/20"
                      >
                          <Award size={16} /> Get Certificate
                      </button>
                  ) : (
                      <button 
                        onClick={handleCompleteModule}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black hover:bg-gray-200 transition-all text-sm font-bold"
                      >
                          {isModuleCompleted ? 'Next Module' : 'Mark Complete'} <ChevronRight size={16} />
                      </button>
                  )}
              </div>
          </div>

          {/* Sidebar Playlist */}
          <div className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col">
              <div className="p-4 border-b border-gray-800 font-bold text-sm text-gray-400 uppercase tracking-wider">Course Modules</div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {course.modules.map((mod, idx) => {
                      const isCompleted = completedModules.includes(mod.id);
                      const isActive = idx === activeModuleIndex;

                      return (
                          <button 
                            key={mod.id}
                            onClick={() => setActiveModuleIndex(idx)}
                            className={`w-full text-left p-4 border-b border-gray-800 flex items-center gap-3 transition-all hover:bg-gray-800/50 ${isActive ? 'bg-gray-800 border-l-4 border-l-green-500 pl-3' : 'pl-4'}`}
                          >
                              <div className={`shrink-0 ${isCompleted ? 'text-green-500' : isActive ? 'text-white' : 'text-gray-600'}`}>
                                  {isCompleted ? <CheckCircle size={18} /> : isActive ? <PlayCircle size={18} /> : <Circle size={18} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-gray-400'}`}>{mod.title}</p>
                                  <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-1">
                                      {mod.type === 'Video' ? <Video size={10} /> : <FileText size={10} />}
                                      {mod.duration}
                                  </p>
                              </div>
                          </button>
                      );
                  })}
              </div>
          </div>

      </div>
    </div>
  );
};

export default CoursePlayerModal;
