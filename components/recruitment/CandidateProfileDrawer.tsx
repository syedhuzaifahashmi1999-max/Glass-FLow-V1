
import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, MapPin, Download, ExternalLink, MessageSquare, Clock, Star, CheckCircle, Ban, ChevronRight, User, Trash2, FileText, Briefcase, Plus, Linkedin } from 'lucide-react';
import { Candidate, CandidateStage, Interview } from '../../types';
import InterviewModal from './InterviewModal';

interface CandidateProfileDrawerProps {
  candidate: Candidate | null;
  onClose: () => void;
  onUpdate: (updatedCandidate: Candidate) => void;
  onDelete: (id: string) => void;
}

const CandidateProfileDrawer: React.FC<CandidateProfileDrawerProps> = ({ candidate, onClose, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'resume' | 'interviews' | 'notes'>('details');
  const [noteText, setNoteText] = useState('');
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  
  useEffect(() => {
    if (candidate) {
      setNoteText(candidate.notes || '');
      setActiveTab('details');
    }
  }, [candidate]);

  if (!candidate) return null;

  const stages = Object.values(CandidateStage);
  
  const handleStageChange = (newStage: CandidateStage) => {
    onUpdate({ ...candidate, stage: newStage });
  };

  const handleRatingChange = (newRating: number) => {
    onUpdate({ ...candidate, rating: newRating });
  };

  const handleSaveNotes = () => {
    onUpdate({ ...candidate, notes: noteText });
  };

  const handleDelete = () => {
      if (confirm('Are you sure you want to delete this candidate?')) {
          onDelete(candidate.id);
          onClose();
      }
  };

  const handleAddInterview = (interview: Interview) => {
      const updatedInterviews = [...(candidate.interviews || []), interview];
      onUpdate({ ...candidate, interviews: updatedInterviews });
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-[700px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-out border-l border-gray-100 flex flex-col">
        
        {/* Header */}
        <div className="h-40 bg-gradient-to-r from-gray-900 via-gray-800 to-black relative flex flex-col justify-end p-8 shrink-0">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
            >
                <X size={20} />
            </button>
            
            <div className="flex items-end gap-6 relative z-10 translate-y-6">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                    <img src={candidate.avatarUrl} alt={candidate.name} className="w-full h-full object-cover" />
                </div>
                <div className="mb-2">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{candidate.name}</h2>
                    <p className="text-blue-200 font-medium text-sm flex items-center gap-2">
                        {candidate.role} 
                        {candidate.currentCompany && <span className="text-gray-400">• {candidate.currentCompany}</span>}
                    </p>
                </div>
            </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-8 py-4 pt-10 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2">
                <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            className="p-1 hover:scale-110 transition-transform"
                        >
                            <Star 
                                size={16} 
                                className={star <= candidate.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                            />
                        </button>
                    ))}
                </div>
                <span className="text-xs text-gray-500 font-medium ml-1">Overall</span>
            </div>
            
            <div className="flex gap-2">
                <a href={`mailto:${candidate.email}`} className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 transition-colors" title="Send Email">
                    <Mail size={18} />
                </a>
                <a href={`tel:${candidate.phone}`} className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 transition-colors" title="Call">
                    <Phone size={18} />
                </a>
                <button onClick={() => setIsInterviewModalOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors">
                    <Calendar size={14} /> Schedule Interview
                </button>
            </div>
        </div>

        {/* Stage Progress */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pipeline Stage</span>
                <span className="text-sm font-bold text-black">{candidate.stage}</span>
            </div>
            <div className="flex gap-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                {stages.map((stage, idx) => {
                    const activeIndex = stages.indexOf(candidate.stage);
                    let colorClass = 'bg-gray-200';
                    if (idx < activeIndex) colorClass = 'bg-green-500';
                    if (idx === activeIndex) colorClass = 'bg-blue-600';
                    
                    return (
                        <div key={stage} className={`h-full flex-1 ${colorClass}`} title={stage} />
                    );
                })}
            </div>
            <div className="flex justify-between mt-2">
                {stages.map((stage, idx) => (
                    <button 
                        key={stage}
                        onClick={() => handleStageChange(stage)}
                        className={`text-[8px] uppercase tracking-wide font-medium transition-colors ${candidate.stage === stage ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {stage === 'Screening' ? 'Screen' : stage === 'Interview' ? 'Intvw' : stage.slice(0, 4)}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white">
            <div className="flex border-b border-gray-100 px-8">
                <button onClick={() => setActiveTab('details')} className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Overview</button>
                <button onClick={() => setActiveTab('resume')} className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'resume' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Resume</button>
                <button onClick={() => setActiveTab('interviews')} className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'interviews' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Interviews <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full ml-1">{candidate.interviews?.length || 0}</span></button>
                <button onClick={() => setActiveTab('notes')} className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notes' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Notes</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50/30">
                
                {/* DETAILS TAB */}
                {activeTab === 'details' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Candidate Profile</h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <label className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider block mb-1">Email</label>
                                    <p className="text-sm font-medium text-black break-all">{candidate.email}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider block mb-1">Phone</label>
                                    <p className="text-sm font-medium text-black">{candidate.phone}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider block mb-1">Applied Date</label>
                                    <p className="text-sm font-medium text-black flex items-center gap-1.5">
                                        <Calendar size={14} className="text-gray-400" /> {candidate.appliedDate}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider block mb-1">Source</label>
                                    <p className="text-sm font-medium text-black flex items-center gap-1.5">
                                        {candidate.source === 'LinkedIn' ? <Linkedin size={14} className="text-blue-600" /> : <ExternalLink size={14} className="text-gray-400" />}
                                        {candidate.source || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Skills & Qualifications</h3>
                            <div className="flex flex-wrap gap-2">
                                {candidate.skills && candidate.skills.length > 0 ? candidate.skills.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                                        {tag}
                                    </span>
                                )) : (
                                    <span className="text-xs text-gray-400 italic">No skills tagged.</span>
                                )}
                                <button className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-xs font-medium text-gray-400 hover:text-black hover:border-gray-400 transition-colors">
                                    + Add Skill
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* RESUME TAB */}
                {activeTab === 'resume' && (
                    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex-1 border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                            {/* Mock PDF Toolbar */}
                            <div className="bg-gray-100 border-b border-gray-200 p-2 flex justify-between items-center">
                                <div className="text-xs font-medium text-gray-600 px-2">{candidate.name}_Resume.pdf</div>
                                <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Download size={14} /></button>
                            </div>
                            {/* Mock PDF Content */}
                            <div className="flex-1 p-8 overflow-y-auto">
                                <div className="max-w-2xl mx-auto space-y-6 opacity-70 select-none pointer-events-none">
                                    <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-gray-100 rounded"></div>
                                        <div className="h-4 w-full bg-gray-100 rounded"></div>
                                        <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                                    </div>
                                    <div className="h-px bg-gray-200 w-full my-6"></div>
                                    <div className="h-6 w-1/4 bg-gray-200 rounded mb-3"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-gray-100 rounded"></div>
                                        <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="text-center mt-10">
                                    <p className="text-sm font-medium text-gray-400">PDF Preview Simulated</p>
                                    <button className="mt-2 text-blue-600 text-xs hover:underline">Download Original File</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* INTERVIEWS TAB */}
                {activeTab === 'interviews' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Interview History</h3>
                            <button 
                                onClick={() => setIsInterviewModalOpen(true)}
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                                <Plus size={12} /> Add Feedback
                            </button>
                        </div>

                        {candidate.interviews && candidate.interviews.length > 0 ? (
                            candidate.interviews.map((int, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-black">{int.type} Round</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${int.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                    {int.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                <User size={12} /> {int.interviewer} • <Clock size={12} /> {int.date}
                                            </p>
                                        </div>
                                        {int.score && (
                                            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg border border-yellow-100">
                                                <span className="text-sm font-bold">{int.score}</span> <Star size={12} className="fill-yellow-600" />
                                            </div>
                                        )}
                                    </div>
                                    {int.notes && (
                                        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-700 italic border border-gray-100">
                                            "{int.notes}"
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                <p className="text-sm text-gray-500">No interviews scheduled or recorded.</p>
                                <button onClick={() => setIsInterviewModalOpen(true)} className="mt-2 text-black text-xs font-medium hover:underline">Schedule one now</button>
                            </div>
                        )}
                    </div>
                )}

                {/* NOTES TAB */}
                {activeTab === 'notes' && (
                    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">
                            <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-3">Internal Notes</label>
                            <textarea 
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-black resize-none"
                                placeholder="Add private notes about this candidate..."
                            />
                            <div className="flex justify-end mt-4">
                                <button 
                                    onClick={handleSaveNotes}
                                    className="px-4 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Save Note
                                </button>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Activity Log</h3>
                            <div className="relative pl-4 border-l border-gray-200 space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white"></div>
                                    <p className="text-xs text-black font-medium">Stage updated to {candidate.stage}</p>
                                    <p className="text-[10px] text-gray-400">Just now • You</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white"></div>
                                    <p className="text-xs text-black font-medium">Application Received</p>
                                    <p className="text-[10px] text-gray-400">{candidate.appliedDate} • System</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-white flex justify-between items-center shrink-0">
            <button 
                onClick={handleDelete}
                className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
            >
                <Trash2 size={14} /> Delete
            </button>

            <div className="flex gap-3">
                <button 
                    onClick={() => handleStageChange(CandidateStage.REJECTED)}
                    className="px-4 py-2 border border-red-100 text-red-600 bg-white hover:bg-red-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                >
                    <Ban size={14} /> Reject
                </button>

                {candidate.stage !== CandidateStage.HIRED && (
                    <button 
                        onClick={() => handleStageChange(CandidateStage.HIRED)}
                        className="px-6 py-2 bg-black text-white hover:bg-gray-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shadow-lg shadow-black/10"
                    >
                        <CheckCircle size={14} /> Hire Candidate
                    </button>
                )}
            </div>
        </div>

      </div>

      <InterviewModal 
        isOpen={isInterviewModalOpen} 
        onClose={() => setIsInterviewModalOpen(false)} 
        candidate={candidate}
        onSave={handleAddInterview}
      />
    </>
  );
};

export default CandidateProfileDrawer;
