
import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, Plus, Search, Filter, BookOpen, Clock, 
  CheckCircle, PlayCircle, Award, Layout, LayoutList, 
  MoreHorizontal, Download, Users, TrendingUp 
} from 'lucide-react';
import { TrainingCourse, TrainingAssignment, Employee } from '../types';
import { MOCK_TRAINING_COURSES, MOCK_TRAINING_ASSIGNMENTS, MOCK_EMPLOYEES } from '../constants';
import CourseCard from '../components/training/CourseCard';
import AddCourseModal from '../components/training/AddCourseModal';
import AssignTrainingModal from '../components/training/AssignTrainingModal';
import CourseDetailModal from '../components/training/CourseDetailModal';
import CoursePlayerModal from '../components/training/CoursePlayerModal';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

const TrainingBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'my_learning' | 'library'>('overview');
  const [courses, setCourses] = useState<TrainingCourse[]>(MOCK_TRAINING_COURSES);
  const [assignments, setAssignments] = useState<TrainingAssignment[]>(MOCK_TRAINING_ASSIGNMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  const [viewingCourse, setViewingCourse] = useState<TrainingCourse | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<TrainingAssignment | null>(null);
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | undefined>(undefined);

  // Mock Current User (e1 = Alex Doe)
  const currentUserId = 'e1';

  // --- Handlers ---
  const handleCreateCourse = (courseData: Omit<TrainingCourse, 'id'>) => {
    if (editingCourse) {
        setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...courseData } : c));
        setEditingCourse(undefined);
    } else {
        const newCourse: TrainingCourse = {
            ...courseData,
            id: `TR-${Date.now()}`
        };
        setCourses(prev => [newCourse, ...prev]);
    }
  };

  const handleDeleteCourse = (id: string) => {
      if (confirm('Delete this course? Assignments will remain but course details will be removed.')) {
          setCourses(prev => prev.filter(c => c.id !== id));
          if (viewingCourse?.id === id) setViewingCourse(null);
      }
  };

  const handleAssignTraining = (assignmentData: Omit<TrainingAssignment, 'id'>) => {
      const newAssignment: TrainingAssignment = {
          ...assignmentData,
          id: `TA-${Date.now()}`
      };
      setAssignments(prev => [...prev, newAssignment]);
  };

  const handleStartCourse = (assignment: TrainingAssignment) => {
      setActiveAssignment(assignment);
  };

  const handleUpdateProgress = (assignmentId: string, progress: number, completedModules: string[]) => {
      setAssignments(prev => prev.map(a => 
          a.id === assignmentId ? { 
              ...a, 
              progress, 
              status: progress === 100 ? 'Completed' : 'In Progress',
              completedModuleIds: completedModules
          } : a
      ));
      // Also update local active assignment to reflect changes instantly in player
      setActiveAssignment(prev => prev ? { 
          ...prev, 
          progress, 
          status: progress === 100 ? 'Completed' : 'In Progress',
          completedModuleIds: completedModules 
      } : null);
  };

  // --- Derived Data ---
  const myAssignments = assignments.filter(a => a.employeeId === currentUserId);
  const myProgress = myAssignments.map(a => {
      const course = courses.find(c => c.id === a.courseId);
      return { 
          ...a, 
          courseTitle: course?.title, 
          courseCategory: course?.category, 
          courseDuration: course?.duration,
          modulesCount: course?.modules.length || 0,
          course: course // include full object for player
      };
  });

  const stats = useMemo(() => {
      const totalAssignments = assignments.length;
      const completed = assignments.filter(a => a.status === 'Completed').length;
      const completionRate = totalAssignments > 0 ? (completed / totalAssignments) * 100 : 0;
      const activeLearners = new Set(assignments.filter(a => a.status === 'In Progress').map(a => a.employeeId)).size;
      
      return { completionRate, activeLearners, totalAssignments };
  }, [assignments]);

  const filteredCourses = courses.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Learning & Development</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Manage employee training, compliance, and skill growth.</p>
            </div>
            
            <div className="flex gap-4">
                 <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><CheckCircle size={10} /> Completion Rate</span>
                    <div className="text-lg font-light text-black dark:text-white mt-0.5">{stats.completionRate.toFixed(0)}%</div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><Users size={10} /> Active Learners</span>
                    <div className="text-lg font-light text-black dark:text-white mt-0.5">{stats.activeLearners}</div>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0">
            <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('my_learning')}
                    className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${activeTab === 'my_learning' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                    My Learning
                </button>
                <button 
                    onClick={() => setActiveTab('library')}
                    className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${activeTab === 'library' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                    Course Library
                </button>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                    />
                </div>
                {activeTab === 'library' && (
                    <button 
                        onClick={() => { setEditingCourse(undefined); setIsAddModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-colors text-xs font-medium shadow-sm"
                    >
                        <Plus size={14} /> Add Course
                    </button>
                )}
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-black dark:text-white mb-4">Training Distribution</h3>
                        <div className="space-y-3">
                            {[
                                { cat: 'Compliance', val: 35, color: 'bg-blue-500' },
                                { cat: 'Technical', val: 40, color: 'bg-purple-500' },
                                { cat: 'Leadership', val: 15, color: 'bg-orange-500' },
                                { cat: 'Soft Skills', val: 10, color: 'bg-emerald-500' },
                            ].map(item => (
                                <div key={item.cat}>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>{item.cat}</span>
                                        <span>{item.val}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-black dark:text-white mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {assignments.slice(0, 4).map(a => {
                                const emp = MOCK_EMPLOYEES.find(e => e.id === a.employeeId);
                                const course = courses.find(c => c.id === a.courseId);
                                return (
                                    <div key={a.id} className="flex items-center gap-3">
                                        <img src={emp?.avatarUrl} className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-black dark:text-white">
                                                {emp?.name} <span className="text-gray-400 font-normal">started</span> {course?.title}
                                            </p>
                                            <p className="text-[10px] text-gray-400">{a.assignedDate}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: MY LEARNING */}
            {activeTab === 'my_learning' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    {myProgress.length > 0 ? myProgress.map(item => (
                        <div key={item.id} className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400">
                                <BookOpen size={24} strokeWidth={1} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-bold text-black dark:text-white truncate">{item.courseTitle}</h3>
                                    <span className="text-[10px] bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{item.courseCategory}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {item.courseDuration}</span>
                                    <span>Due: {item.dueDate}</span>
                                </div>
                                <div className="mt-3 w-full max-w-md">
                                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                        <span>Progress</span>
                                        <span>{item.progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${item.status === 'Completed' ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${item.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex gap-3">
                                {item.status === 'Completed' ? (
                                    <button 
                                        onClick={() => {
                                            alert("Certificate Downloaded!");
                                        }}
                                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <Award size={14} className="text-yellow-500" /> Certificate
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleStartCourse(item)}
                                        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <PlayCircle size={14} /> {item.progress > 0 ? 'Continue' : 'Start'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-sm">No courses assigned to you.</p>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: LIBRARY */}
            {activeTab === 'library' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 pb-10">
                    {filteredCourses.map(course => (
                        <CourseCard 
                            key={course.id} 
                            course={course}
                            onClick={() => setViewingCourse(course)}
                            onEdit={(c) => { setEditingCourse(c); setIsAddModalOpen(true); }}
                            onDelete={handleDeleteCourse}
                            onAssign={(c) => { setSelectedCourse(c); setIsAssignModalOpen(true); }}
                        />
                    ))}
                </div>
            )}

        </div>

    </div>

    <AddCourseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleCreateCourse}
        initialData={editingCourse}
    />

    <AssignTrainingModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignTraining}
        course={selectedCourse}
        employees={MOCK_EMPLOYEES}
    />

    <CourseDetailModal 
        isOpen={!!viewingCourse}
        onClose={() => setViewingCourse(null)}
        course={viewingCourse}
        onEdit={(c) => { setViewingCourse(null); setEditingCourse(c); setIsAddModalOpen(true); }}
        onDelete={(id) => { handleDeleteCourse(id); setViewingCourse(null); }}
        onAssign={(c) => { setViewingCourse(null); setSelectedCourse(c); setIsAssignModalOpen(true); }}
    />

    <CoursePlayerModal 
        isOpen={!!activeAssignment}
        onClose={() => setActiveAssignment(null)}
        course={activeAssignment ? courses.find(c => c.id === activeAssignment.courseId) || null : null}
        assignment={activeAssignment}
        onUpdateProgress={handleUpdateProgress}
    />

    </>
  );
};

export default TrainingBoard;
