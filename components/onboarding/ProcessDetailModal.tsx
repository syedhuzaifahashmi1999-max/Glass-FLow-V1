
import React, { useState, useEffect, useRef } from 'react';
import { 
    X, CheckCircle, Circle, User, Briefcase, Calendar, Clock, 
    Plus, Trash2, Send, AlertTriangle, Archive, MessageSquare, 
    FileText, Paperclip, ChevronRight, Mail, Phone, MapPin, 
    Laptop, Building2, BookOpen, Download, Loader2, Check
} from 'lucide-react';
import { EmployeeProcess, OnboardingTask } from '../../types';

interface ProcessDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: EmployeeProcess | null;
  onUpdateTask: (processId: string, taskId: string, status: 'Pending' | 'Completed') => void;
  onAddTask: (processId: string, task: OnboardingTask) => void;
  onUpdateProcess: (process: EmployeeProcess) => void;
}

const ProcessDetailModal: React.FC<ProcessDetailModalProps> = ({ isOpen, onClose, process, onUpdateTask, onAddTask, onUpdateProcess }) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'documents' | 'timeline'>('checklist');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [isInviteSent, setIsInviteSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Local state for documents to simulate uploads
  const [documents, setDocuments] = useState([
      { id: 'd1', name: 'Employment_Contract.pdf', size: '2.4 MB', date: 'Oct 24, 2024' },
      { id: 'd2', name: 'Employee_Handbook_v2.pdf', size: '14 MB', date: 'Oct 24, 2024' },
      { id: 'd3', name: 'NDA_Signed.pdf', size: '1.1 MB', date: 'Oct 25, 2024' },
  ]);

  // Local state for timeline to simulate audit trail
  const [activityLog, setActivityLog] = useState([
      { id: 'a1', type: 'system', text: 'Onboarding process started', date: '2 days ago', user: 'System' },
      { id: 'a2', type: 'email', text: 'Welcome packet sent', date: 'Yesterday', user: 'HR Bot' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when process changes
  useEffect(() => {
    if (process?.notes) setNoteText(process.notes);
    setIsInviteSent(false); // Reset on new open
  }, [process]);

  if (!isOpen || !process) return null;

  // Stages definition
  const STAGES = ['Pre-boarding', 'Week 1', 'Month 1', 'Probation'];

  // --- Actions ---

  const handleAddNewTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTaskTitle.trim()) return;
      
      const newTask: OnboardingTask = {
          id: `t-${Date.now()}`,
          title: newTaskTitle,
          status: 'Pending',
          category: 'Admin',
          dueDate: new Date().toISOString().split('T')[0],
          assignee: 'Manager'
      };
      
      onAddTask(process.id, newTask);
      setNewTaskTitle('');
      addLogEntry('Task created: ' + newTaskTitle);
  };

  const handleSendInvite = () => {
      setIsSending(true);
      setTimeout(() => {
          setIsSending(false);
          setIsInviteSent(true);
          addLogEntry('Official onboarding invitation sent via email');
      }, 1500);
  };

  const handleCompleteStage = () => {
      const currentIndex = STAGES.indexOf(process.stage);
      const incompleteTasks = process.tasks.filter(t => t.status !== 'Completed').length;

      if (incompleteTasks > 0) {
          if (!confirm(`There are ${incompleteTasks} pending tasks. Are you sure you want to advance to the next stage?`)) {
              return;
          }
      }

      if (currentIndex < STAGES.length - 1) {
          const nextStage = STAGES[currentIndex + 1];
          onUpdateProcess({ ...process, stage: nextStage });
          addLogEntry(`Stage advanced from ${process.stage} to ${nextStage}`);
      } else {
          // Completed
          onUpdateProcess({ ...process, status: 'Completed', progress: 100 });
          addLogEntry('Onboarding process marked as completed');
          onClose();
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const newDoc = {
              id: `d-${Date.now()}`,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              date: 'Just now'
          };
          setDocuments(prev => [newDoc, ...prev]);
          addLogEntry(`Document uploaded: ${file.name}`);
      }
  };

  const handleDeleteDocument = (id: string) => {
      if(confirm('Remove this document?')) {
          setDocuments(prev => prev.filter(d => d.id !== id));
      }
  };

  const addLogEntry = (text: string) => {
      const newEntry = {
          id: `a-${Date.now()}`,
          type: 'update',
          text: text,
          date: 'Just now',
          user: 'You'
      };
      setActivityLog(prev => [newEntry, ...prev]);
  };

  const handleSaveNote = () => {
      if (!noteText.trim()) return;
      onUpdateProcess({...process, notes: noteText});
      addLogEntry('Internal notes updated');
      setActiveTab('timeline'); // switch to see the log
  };


  // --- Calculations ---
  const completedTasksCount = process.tasks.filter(t => t.status === 'Completed').length;
  const totalTasksCount = process.tasks.length;
  const progressPercent = Math.round((completedTasksCount / totalTasksCount) * 100) || 0;
  
  // Group tasks by category
  const categories = Array.from(new Set(process.tasks.map(t => t.category)));

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-[850px] bg-white dark:bg-[#18181b] shadow-2xl z-[101] transform transition-transform duration-300 ease-out border-l border-gray-100 dark:border-gray-800 flex flex-col">
        
        {/* --- Header Section --- */}
        <div className="relative shrink-0">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 h-full z-0 overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute left-0 bottom-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
            </div>

            <div className="relative z-10 px-8 pt-8 pb-6">
                <div className="flex justify-between items-start mb-6">
                    <button 
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex gap-2">
                         <button 
                            onClick={handleSendInvite}
                            disabled={isInviteSent || isSending}
                            className={`
                                px-4 py-2 rounded-lg text-xs font-medium backdrop-blur-md transition-all border flex items-center gap-2
                                ${isInviteSent 
                                    ? 'bg-green-500/20 border-green-500/30 text-green-300 cursor-default' 
                                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'}
                            `}
                         >
                             {isSending ? <Loader2 size={14} className="animate-spin" /> : isInviteSent ? <Check size={14} /> : <Send size={14} />}
                             {isInviteSent ? 'Invite Sent' : 'Send Invite'}
                         </button>
                         
                         <button 
                            onClick={handleCompleteStage}
                            className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2"
                         >
                             Complete {process.stage} <ChevronRight size={14} />
                         </button>
                    </div>
                </div>

                <div className="flex items-end gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#18181b] shadow-xl overflow-hidden bg-gray-200">
                            <img src={process.avatarUrl} alt={process.employeeName} className="w-full h-full object-cover" />
                        </div>
                        <span className={`absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full border-4 border-gray-900 dark:border-[#18181b] bg-white shadow-sm`}>
                            <Briefcase size={14} className="text-black" />
                        </span>
                    </div>
                    <div className="mb-1 flex-1">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-1">{process.employeeName}</h2>
                        <div className="flex items-center gap-4 text-gray-300 text-sm">
                            <span className="flex items-center gap-1.5"><Briefcase size={14} /> {process.role}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                            <span className="flex items-center gap-1.5"><Building2 size={14} /> {process.department || 'Engineering'}</span>
                        </div>
                    </div>
                    <div className="hidden md:block text-right text-white">
                        <div className="text-3xl font-light tracking-tighter">{progressPercent}%</div>
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Completion</div>
                    </div>
                </div>
            </div>

            {/* Stage Tracker Bar */}
            <div className="px-8 pb-0 relative z-10">
                <div className="flex items-center justify-between relative">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
                    
                    {STAGES.map((stage, idx) => {
                        const isCurrent = stage === process.stage;
                        const isPast = STAGES.indexOf(process.stage) > idx;
                        
                        return (
                            <div key={stage} className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                    ${isPast ? 'bg-green-500 border-green-500 text-black' : isCurrent ? 'bg-white border-white text-black scale-110 shadow-lg shadow-white/20' : 'bg-gray-800 border-gray-600 text-gray-400'}
                                `}>
                                    {isPast ? <CheckCircle size={16} /> : isCurrent ? <Circle size={16} className="fill-black" /> : <Circle size={16} />}
                                </div>
                                <span className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                                    {stage}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="mt-6 px-8 flex gap-8 border-b border-white/10 relative z-10">
                <button 
                    onClick={() => setActiveTab('checklist')}
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'checklist' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Checklist
                </button>
                <button 
                    onClick={() => setActiveTab('documents')}
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'documents' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Documents
                </button>
                <button 
                    onClick={() => setActiveTab('timeline')}
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Timeline & Notes
                </button>
            </div>
        </div>

        {/* --- Content Body --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-black/20 p-8">
            
            {activeTab === 'checklist' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-black dark:text-white">Onboarding Tasks</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage required steps for {process.stage}.</p>
                        </div>
                        <form onSubmit={handleAddNewTask} className="flex gap-2">
                            <input 
                                type="text" 
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Add a quick task..."
                                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-xs w-64 focus:outline-none focus:border-black dark:focus:border-white transition-all"
                            />
                            <button type="submit" className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90">
                                <Plus size={16} />
                            </button>
                        </form>
                    </div>

                    <div className="grid gap-6">
                        {categories.map(category => {
                            const categoryTasks = process.tasks.filter(t => t.category === category);
                            const catCompleted = categoryTasks.filter(t => t.status === 'Completed').length;
                            const catTotal = categoryTasks.length;
                            const categoryProgress = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
                            
                            return (
                                <div key={category} className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            {category === 'IT' && <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Laptop size={16} /></div>}
                                            {category === 'HR' && <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><User size={16} /></div>}
                                            {category === 'Admin' && <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Briefcase size={16} /></div>}
                                            {category === 'Training' && <div className="p-2 bg-green-100 text-green-600 rounded-lg"><BookOpen size={16} /></div>}
                                            <h4 className="font-bold text-sm text-black dark:text-white uppercase tracking-wide">{category}</h4>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-black dark:bg-white h-full transition-all duration-500" style={{ width: `${categoryProgress}%` }}></div>
                                            </div>
                                            <span className="text-xs font-mono text-gray-500">{categoryProgress}%</span>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {categoryTasks.map(task => (
                                            <div 
                                                key={task.id} 
                                                className={`group flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${task.status === 'Completed' ? 'opacity-50' : ''}`}
                                                onClick={() => onUpdateTask(process.id, task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`
                                                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                                        ${task.status === 'Completed' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 group-hover:border-black dark:group-hover:border-white'}
                                                    `}>
                                                        {task.status === 'Completed' && <CheckCircle size={14} />}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-black dark:text-white'}`}>{task.title}</p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            {task.assignee && <span className="text-[10px] text-gray-400 flex items-center gap-1"><User size={10} /> {task.assignee}</span>}
                                                            {task.dueDate && <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> {task.dueDate}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'documents' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-lg font-bold text-black dark:text-white">Employee Documents</h3>
                         <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                         >
                             <Plus size={14} /> Upload Document
                         </button>
                         <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-white dark:bg-[#18181b] p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-shadow group relative">
                                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-black dark:text-white truncate" title={doc.name}>{doc.name}</h4>
                                    <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                                        <Download size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteDocument(doc.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                         {/* Upload Placeholder */}
                         <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer min-h-[80px]"
                         >
                            <div className="text-gray-400 mb-1"><Paperclip size={20} /></div>
                            <span className="text-xs font-medium text-gray-500">Drag & Drop files here</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'timeline' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
                     <div className="flex-1 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col">
                        <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-6">Activity Log</h3>
                        
                        <div className="relative pl-6 border-l border-gray-100 dark:border-gray-800 space-y-8 flex-1 overflow-y-auto">
                            {activityLog.map((log) => (
                                <div key={log.id} className="relative">
                                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-[#18181b] ${log.type === 'update' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                    <p className="text-sm text-black dark:text-white font-medium">{log.text}</p>
                                    <p className="text-xs text-gray-400 mt-1">{log.date} • {log.user}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                             <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Internal Notes</h4>
                             <textarea 
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm focus:outline-none focus:border-black dark:focus:border-white resize-none h-32 transition-all"
                                placeholder="Add private notes about this employee's progress..."
                             />
                             <div className="flex justify-end mt-3">
                                 <button 
                                    onClick={handleSaveNote} 
                                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold hover:opacity-90"
                                 >
                                     Save Note
                                 </button>
                             </div>
                        </div>
                     </div>
                 </div>
            )}

        </div>

      </div>
    </>
  );
};

export default ProcessDetailModal;
