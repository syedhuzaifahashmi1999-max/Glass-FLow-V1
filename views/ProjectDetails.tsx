
import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, MoreHorizontal, Calendar, DollarSign, Users, Clock, 
  CheckCircle, Plus, FileText, Layers, Flag, Layout, List as ListIcon, 
  Filter, Search, Activity, Paperclip, 
  MoreVertical, Shield, Mail, Trash2, Save, X, UploadCloud, Share2, Wallet, Receipt
} from 'lucide-react';
import { Project, Task, TaskStatus, Team, Employee, Expense } from '../types';
import TaskRow from '../components/tasks/TaskRow';
import TaskBoardCard from '../components/tasks/TaskBoardCard';
import AddTaskModal from '../components/tasks/AddTaskModal';

interface ProjectDetailsProps {
  project: Project;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onUpdateProject: (project: Project) => void;
  onBack: () => void;
  teams?: Team[];
  employees?: Employee[];
  expenses?: Expense[];
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, tasks, setTasks, onUpdateProject, onBack, teams = [], employees = [], expenses = [] }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'expenses' | 'team' | 'files'>('overview');
  
  // -- Task State --
  const [taskFilter, setTaskFilter] = useState<string>('All');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // -- Edit Mode State --
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Project>>({});

  // -- Files State --
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState([
    { id: 'f1', name: 'Project_Scope_v2.pdf', size: '2.4 MB', type: 'PDF', date: 'Oct 02, 2024' },
    { id: 'f2', name: 'Wireframes_Home.fig', size: '14 MB', type: 'Figma', date: 'Oct 05, 2024' },
    { id: 'f3', name: 'Assets_Bundle.zip', size: '45 MB', type: 'ZIP', date: 'Oct 08, 2024' },
    { id: 'f4', name: 'Contract_Signed.pdf', size: '1.1 MB', type: 'PDF', date: 'Sep 15, 2024' },
  ]);

  // -- Team State --
  // Hydrate team members if a Team is assigned to the project
  const assignedTeam = teams.find(t => t.id === project.teamId);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
      if (assignedTeam && employees.length > 0) {
          // If a team is assigned, derive members from the global employee list
          const members = assignedTeam.memberIds.map(id => {
              const emp = employees.find(e => e.id === id);
              if (!emp) return null;
              return {
                  id: emp.id,
                  name: emp.name,
                  role: emp.role,
                  email: emp.email,
                  access: assignedTeam.leadId === emp.id ? 'Lead' : 'Member',
                  avatar: emp.avatarUrl
              };
          }).filter(Boolean);
          setTeamMembers(members);
      } else {
          // Fallback to mock data if no team assigned
          setTeamMembers([
            { id: 'm1', name: 'Alex Doe', role: 'Project Owner', email: 'alex@glassflow.com', access: 'Admin', avatar: 'https://picsum.photos/100/100?random=20' },
            { id: 'm2', name: 'Sarah Smith', role: 'Lead Developer', email: 'sarah@glassflow.com', access: 'Edit', avatar: 'https://picsum.photos/100/100?random=21' },
            { id: 'm3', name: 'James Wilson', role: 'Designer', email: 'james@glassflow.com', access: 'Edit', avatar: 'https://picsum.photos/100/100?random=22' },
          ]);
      }
  }, [project.teamId, teams, employees]);


  // -- Filtered Data --
  const projectTasks = tasks.filter(t => t.project === project.name);
  const filteredTasks = projectTasks.filter(t => {
      const matchesStatus = taskFilter === 'All' || t.status === taskFilter;
      const matchesSearch = t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) || 
                            (t.assigneeName && t.assigneeName.toLowerCase().includes(taskSearchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
  });

  // -- Metrics --
  const completedTasks = projectTasks.filter(t => t.status === TaskStatus.DONE).length;
  const totalTasks = projectTasks.length;
  const taskProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const taskStatuses = Object.values(TaskStatus);

  // -- Financials --
  const projectExpenses = expenses.filter(e => e.projectId === project.id);
  const totalExpenses = projectExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetValue = parseFloat(project.budget.replace(/[^0-9.]/g, '')) || 0;
  const remainingBudget = budgetValue - totalExpenses;
  const budgetProgress = budgetValue > 0 ? (totalExpenses / budgetValue) * 100 : 0;

  // --- Handlers: Tasks ---

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
      const newTask: Task = {
          ...taskData,
          id: `T-${Date.now()}`,
          createdAt: 'Just now'
      };
      setTasks(prev => [newTask, ...prev]);
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    setTasks(prev => prev.map(t => 
        t.id === draggedTaskId ? { ...t, status: targetStatus } : t
    ));
    setDraggedTaskId(null);
  };

  // --- Handlers: Project Editing ---
  const startEditing = () => {
      setEditForm({
          name: project.name,
          client: project.client,
          status: project.status,
          description: project.description,
          dueDate: project.dueDate
      });
      setIsEditing(true);
  };

  const saveProject = () => {
      onUpdateProject({
          ...project,
          ...editForm
      } as Project);
      setIsEditing(false);
  };

  const cancelEditing = () => {
      setIsEditing(false);
      setEditForm({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Completed': return 'bg-gray-50 text-gray-600 border-gray-100';
      case 'On Hold': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Planning': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  // --- Handlers: Team ---
  const handleAddMember = () => {
      // If team is assigned, user should edit team module instead
      if (assignedTeam) {
          alert('This project is managed by a Team. Please update the team members in the Teams module.');
          return;
      }
      const id = Date.now();
      const newMember = {
          id: `m-${id}`,
          name: `New Member ${teamMembers.length + 1}`,
          role: 'Contributor',
          email: `user${id}@glassflow.com`,
          access: 'View',
          avatar: `https://picsum.photos/100/100?random=${id}`
      };
      setTeamMembers([...teamMembers, newMember]);
  };

  const handleRemoveMember = (id: string) => {
      if (assignedTeam) {
          alert('This project is managed by a Team. Please update the team members in the Teams module.');
          return;
      }
      setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  // --- Handlers: Files ---
  const handleUploadClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const newFile = {
              id: `f-${Date.now()}`,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
              date: 'Just now'
          };
          setFiles([newFile, ...files]);
      }
  };

  const handleDeleteFile = (id: string) => {
      setFiles(prev => prev.filter(f => f.id !== id));
  };


  return (
    <div className="h-full flex flex-col bg-gray-50/50 fade-in relative">
        
        {/* --- HEADER --- */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
            {/* Breadcrumbs & Title */}
            <div className="px-8 pt-6 pb-4">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors mb-3"
                >
                    <ArrowLeft size={12} />
                    <span>Back to Projects</span>
                </button>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center shrink-0 shadow-lg shadow-gray-200">
                             <Layers size={20} strokeWidth={1.5} />
                        </div>
                        <div className="w-full max-w-2xl">
                            {isEditing ? (
                                <div className="space-y-2 animate-in fade-in">
                                    <input 
                                        type="text" 
                                        value={editForm.name} 
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                        className="text-2xl font-semibold text-black tracking-tight leading-none w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-black"
                                    />
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={editForm.client} 
                                            onChange={(e) => setEditForm({...editForm, client: e.target.value})}
                                            className="text-xs font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded px-2 py-1 w-40"
                                        />
                                        <select 
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({...editForm, status: e.target.value as any})}
                                            className="text-[10px] font-medium uppercase tracking-wide bg-gray-50 border border-gray-200 rounded px-2 py-1"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Planning">Planning</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-semibold text-black tracking-tight leading-none mb-2">{project.name}</h1>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="font-medium text-gray-900">{project.client}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-500 font-light">{project.startDate} — {project.dueDate}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wide ${getStatusColor(project.status)}`}>
                                            {project.status}
                                        </span>
                                        {assignedTeam && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-purple-100 bg-purple-50 text-purple-700 text-[10px] font-medium">
                                                    <Share2 size={10} /> {assignedTeam.name}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isEditing && (
                             <div className="flex -space-x-2 mr-2">
                                {teamMembers.slice(0, 3).map((m, i) => (
                                    <img key={m.id} src={m.avatar} className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-gray-100 object-cover" title={m.name} />
                                ))}
                                <button 
                                    onClick={() => setActiveTab('team')}
                                    className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white ring-1 ring-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        )}
                        <div className="h-8 w-px bg-gray-200 mx-1"></div>
                        
                        {isEditing ? (
                            <>
                                <button onClick={cancelEditing} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium transition-all flex items-center gap-2">
                                    <X size={14} /> Cancel
                                </button>
                                <button onClick={saveProject} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium transition-all shadow-md flex items-center gap-2">
                                    <Save size={14} /> Save Changes
                                </button>
                            </>
                        ) : (
                            <button onClick={startEditing} className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-black text-xs font-medium transition-all shadow-sm">
                                Edit Project
                            </button>
                        )}
                        
                        {!isEditing && (
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 text-xs font-medium transition-all shadow-md shadow-gray-200 flex items-center gap-2"
                            >
                                <Plus size={14} /> New Task
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 flex gap-8">
                {['overview', 'tasks', 'expenses', 'team', 'files'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`
                            relative py-3 text-xs font-medium uppercase tracking-wider transition-colors
                            ${activeTab === tab ? 'text-black' : 'text-gray-500 hover:text-gray-800'}
                        `}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-[1400px] mx-auto">
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* Main Content (Left) */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* KPI Cards */}
                            <div className="grid grid-cols-3 gap-5">
                                <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <DollarSign size={48} />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">Total Budget</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-2xl font-light text-black">{project.budget}</h3>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${budgetProgress > 100 ? 'text-red-600 bg-red-50 border-red-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
                                            {budgetProgress > 100 ? 'Over' : 'On Track'}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1">Spend: ${totalExpenses.toLocaleString()}</div>
                                </div>
                                <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <CheckCircle size={48} />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">Task Completion</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-2xl font-light text-black">{taskProgress}%</h3>
                                        <span className="text-[10px] text-gray-400 font-light">{completedTasks}/{totalTasks} Done</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1 rounded-full mt-3 overflow-hidden">
                                        <div className="bg-black h-full rounded-full transition-all duration-1000" style={{ width: `${taskProgress}%` }}></div>
                                    </div>
                                </div>
                                <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Clock size={48} />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">Time Remaining</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-2xl font-light text-black">12 Days</h3>
                                        <span className="text-[10px] text-gray-400">Due {project.dueDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <FileText size={16} className="text-gray-400" />
                                    <h3 className="text-sm font-semibold text-black uppercase tracking-wide">Project Brief</h3>
                                </div>
                                {isEditing ? (
                                    <textarea 
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                        rows={6}
                                        className="w-full bg-gray-50 border border-gray-200 rounded p-4 text-sm font-light resize-none focus:outline-none focus:border-black"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
                                        {project.description}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-md text-[10px] text-gray-600 font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity Timeline */}
                            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <Activity size={16} className="text-gray-400" />
                                    <h3 className="text-sm font-semibold text-black uppercase tracking-wide">Recent Activity</h3>
                                </div>
                                <div className="space-y-6 relative pl-2">
                                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-100"></div>
                                    
                                    {[
                                        { user: 'Alex Doe', action: 'uploaded 3 files', time: '2 hours ago', icon: Paperclip },
                                        { user: 'Sarah Smith', action: 'completed "Homepage Hero"', time: '5 hours ago', icon: CheckCircle },
                                        { user: 'James Wilson', action: 'added a comment', time: 'Yesterday', icon: MoreHorizontal },
                                    ].map((item, i) => (
                                        <div key={i} className="relative flex gap-4 items-start group">
                                            <div className="relative z-10 w-4 h-4 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-black transition-colors"></div>
                                            </div>
                                            <div className="-mt-1">
                                                <p className="text-xs text-gray-900">
                                                    <span className="font-medium">{item.user}</span> {item.action}
                                                </p>
                                                <span className="text-[10px] text-gray-400 font-mono">{item.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Sidebar (Right) */}
                        <div className="space-y-8">
                            
                            {/* Health Status */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">Project Health</h3>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-emerald-600">Healthy</span>
                                    <span className="text-xs text-gray-400">98% Score</span>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }}></div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-3 leading-snug">
                                    This project is currently on schedule and within budget constraints.
                                </p>
                            </div>

                            {/* Milestones */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">Milestones</h3>
                                <div className="space-y-0">
                                    {[
                                        { name: 'Discovery', status: 'done', date: 'Sep 15' },
                                        { name: 'Wireframes', status: 'active', date: 'Oct 01' },
                                        { name: 'Development', status: 'pending', date: 'Oct 15' },
                                        { name: 'QA & Launch', status: 'pending', date: 'Oct 24' },
                                    ].map((m, i, arr) => (
                                        <div key={i} className="flex gap-3 relative pb-6 last:pb-0">
                                            {i !== arr.length - 1 && (
                                                <div className="absolute left-[5.5px] top-3 bottom-0 w-px bg-gray-100"></div>
                                            )}
                                            <div className={`
                                                relative z-10 w-3 h-3 rounded-full border-2 
                                                ${m.status === 'done' ? 'bg-black border-black' : m.status === 'active' ? 'bg-white border-black' : 'bg-white border-gray-200'}
                                            `}></div>
                                            <div className="-mt-1 flex-1">
                                                <div className="flex justify-between">
                                                    <span className={`text-xs font-medium ${m.status === 'pending' ? 'text-gray-400' : 'text-black'}`}>{m.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-mono">{m.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             {/* Project Info List */}
                             <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Details</h3>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-xs text-gray-500">Category</span>
                                    <span className="text-xs font-medium text-black">{project.category}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-xs text-gray-500">Priority</span>
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border bg-gray-50 border-gray-100`}>
                                        {project.priority}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-xs text-gray-500">Start Date</span>
                                    <span className="text-xs font-medium text-black">{project.startDate}</span>
                                </div>
                                {assignedTeam && (
                                    <div className="flex justify-between py-2 border-b border-gray-50">
                                        <span className="text-xs text-gray-500">Assigned Team</span>
                                        <span className="text-xs font-medium text-purple-600">{assignedTeam.name}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-2">
                                    <span className="text-xs text-gray-500">Manager</span>
                                    <div className="flex items-center gap-1.5">
                                        <img src="https://picsum.photos/100/100?random=1" className="w-4 h-4 rounded-full" />
                                        <span className="text-xs font-medium text-black">Alex Doe</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* 2. TASKS TAB */}
                {activeTab === 'tasks' && (
                    <div className="flex flex-col h-[calc(100vh-250px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                             <div className="flex items-center gap-2">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input 
                                        type="text" 
                                        value={taskSearchQuery}
                                        onChange={(e) => setTaskSearchQuery(e.target.value)}
                                        placeholder="Search tasks..." 
                                        className="w-56 bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-black/30 transition-all"
                                    />
                                </div>
                                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                                {['All', 'To Do', 'In Progress', 'Done'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setTaskFilter(status)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                            taskFilter === status 
                                            ? 'bg-black text-white border-black' 
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                             </div>

                             <div className="flex p-1 bg-white rounded-lg border border-gray-200">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <ListIcon size={14} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('board')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'board' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Layout size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Views */}
                        <div className="flex-1 overflow-hidden">
                            {viewMode === 'list' ? (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                                                <th className="py-3 px-6 w-1/3">Task Name</th>
                                                <th className="py-3 px-4">Status</th>
                                                <th className="py-3 px-4">Priority</th>
                                                <th className="py-3 px-4">Assignee</th>
                                                <th className="py-3 px-4 text-right">Due Date</th>
                                                <th className="py-3 px-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredTasks.length > 0 ? (
                                                filteredTasks.map(task => (
                                                    <TaskRow key={task.id} task={task} onClick={() => {}} />
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                                                        No tasks found matching your filters.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex gap-6 overflow-x-auto h-full pb-4 custom-scrollbar">
                                    {taskStatuses.map(status => {
                                        const tasksInColumn = filteredTasks.filter(t => t.status === status);
                                        return (
                                            <div 
                                                key={status}
                                                className="w-80 flex flex-col min-w-[320px] bg-gray-100/50 rounded-xl border border-gray-200/60 p-2"
                                                onDragOver={onDragOver}
                                                onDrop={(e) => onDrop(e, status)}
                                            >
                                                <div className="flex justify-between items-center px-3 py-3 mb-1">
                                                    <span className="text-xs font-semibold text-gray-700">{status}</span>
                                                    <span className="text-[10px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm">
                                                        {tasksInColumn.length}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 px-1">
                                                    {tasksInColumn.map(task => (
                                                        <TaskBoardCard 
                                                            key={task.id}
                                                            task={task}
                                                            isDragging={draggedTaskId === task.id}
                                                            onDragStart={onDragStart}
                                                            onClick={() => {}}
                                                        />
                                                    ))}
                                                    <button 
                                                        onClick={() => setIsAddModalOpen(true)}
                                                        className="w-full py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 text-xs hover:border-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Plus size={12} /> Add Task
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. EXPENSES TAB */}
                {activeTab === 'expenses' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Breakdown Chart & Metrics */}
                        <div className="space-y-6">
                            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">Budget Utilization</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Total Budget</span>
                                        <span className="font-medium text-black">${budgetValue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Actual Spend</span>
                                        <span className="font-medium text-black">${totalExpenses.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-gray-100 my-2"></div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-900 font-medium">Remaining</span>
                                        <span className={`font-mono font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                            ${remainingBudget.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-50">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-500">Progress</span>
                                        <span className="font-mono text-black">{budgetProgress.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${budgetProgress > 100 ? 'bg-red-500' : 'bg-black'}`} style={{ width: `${Math.min(budgetProgress, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Wallet size={16} className="text-blue-600" />
                                    <h4 className="text-sm font-semibold text-blue-800">Financial Tip</h4>
                                </div>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Ensure all receipts are attached for expenses over $500 to comply with auditing standards.
                                </p>
                            </div>
                        </div>

                        {/* Expense List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="text-sm font-medium text-black">Project Expenses</h3>
                                    <div className="text-xs text-gray-500">{projectExpenses.length} Records</div>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase font-semibold sticky top-0">
                                            <tr>
                                                <th className="px-6 py-3">Date</th>
                                                <th className="px-6 py-3">Payee</th>
                                                <th className="px-6 py-3">Category</th>
                                                <th className="px-6 py-3 text-right">Amount</th>
                                                <th className="px-6 py-3 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-xs">
                                            {projectExpenses.length > 0 ? projectExpenses.map(exp => (
                                                <tr key={exp.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-3 text-gray-500 font-mono">{exp.date}</td>
                                                    <td className="px-6 py-3 font-medium text-black">{exp.payee}</td>
                                                    <td className="px-6 py-3 text-gray-600">
                                                        <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">{exp.category}</span>
                                                    </td>
                                                    <td className="px-6 py-3 text-right font-mono text-black">${exp.amount.toLocaleString()}</td>
                                                    <td className="px-6 py-3 text-center">
                                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${
                                                            exp.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                                                        }`}>
                                                            {exp.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={5} className="py-12 text-center text-gray-400">
                                                        No expenses recorded for this project yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. TEAM TAB */}
                {activeTab === 'team' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-medium text-black flex items-center gap-2">
                                    Project Team
                                    {assignedTeam && <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] border border-purple-100">{assignedTeam.name}</span>}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Manage access and roles for this project.</p>
                            </div>
                            <button onClick={handleAddMember} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors">
                                <Plus size={14} /> Add Member
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] text-gray-500 uppercase tracking-widest font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Member</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Access Level</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {teamMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={member.avatar} className="w-10 h-10 rounded-full border border-gray-100 object-cover" />
                                                <div>
                                                    <div className="text-sm font-medium text-black">{member.name}</div>
                                                    <div className="text-xs text-gray-500">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{member.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                                                member.access === 'Admin' || member.access === 'Lead' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                                <Shield size={10} /> {member.access}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors">
                                                    <Mail size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {assignedTeam && (
                            <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center border-t border-gray-100">
                                This project is assigned to <strong>{assignedTeam.name}</strong>. Team members are managed in the Teams module.
                            </div>
                        )}
                    </div>
                )}

                {/* 5. FILES TAB */}
                {activeTab === 'files' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-medium text-black">Attachments & Assets</h3>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-medium hover:border-gray-300">
                                    <Filter size={14} /> Filter
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange} 
                                />
                                <button 
                                    onClick={handleUploadClick}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800"
                                >
                                    <Plus size={14} /> Upload File
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {files.map((file) => (
                                <div key={file.id} className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer relative">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}
                                        className="absolute top-2 right-2 p-1.5 rounded-full text-gray-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-3 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <h4 className="text-xs font-medium text-black truncate mb-1" title={file.name}>{file.name}</h4>
                                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                                        <span>{file.size}</span>
                                        <span>{file.date}</span>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Upload Placeholder */}
                            <div 
                                onClick={handleUploadClick}
                                className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-4 text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer min-h-[140px]"
                            >
                                <UploadCloud size={24} className="mb-2 opacity-50" />
                                <span className="text-xs font-medium">Drop files here</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>

        <AddTaskModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            onSave={handleAddTask}
            preselectedProject={project.name}
        />
    </div>
  );
};

export default ProjectDetails;
