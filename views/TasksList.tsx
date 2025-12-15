
import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, List as ListIcon, Plus, MoreHorizontal, Calendar, CheckSquare, X, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { Task, TaskStatus, Project } from '../types';
import TaskRow from '../components/tasks/TaskRow';
import TaskBoardCard from '../components/tasks/TaskBoardCard';
import AddTaskModal from '../components/tasks/AddTaskModal';

interface TasksListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
  onSelectTask: (id: string) => void;
}

const TasksList: React.FC<TasksListProps> = ({ tasks, setTasks, projects, onSelectTask }) => {
  // View State
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterProject, setFilterProject] = useState<string>('All');
  
  // Sort State
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Drag & Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const taskStatuses = Object.values(TaskStatus);

  // --- Logic ---

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
      const newTask: Task = {
          ...taskData,
          id: `T-${Date.now()}`,
          createdAt: 'Just now'
      };
      setTasks(prev => [newTask, ...prev]);
  };

  // Filtering
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.project && t.project.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.assigneeName && t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchesProject = filterProject === 'All' || t.project === filterProject;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  // Sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
      let res = 0;
      if (sortBy === 'title') res = a.title.localeCompare(b.title);
      else if (sortBy === 'dueDate') res = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      else if (sortBy === 'priority') {
          const pMap = { High: 3, Medium: 2, Low: 1 };
          res = (pMap[a.priority as keyof typeof pMap] || 0) - (pMap[b.priority as keyof typeof pMap] || 0);
      }
      return sortOrder === 'asc' ? res : -res;
  });

  // Drag & Drop Handlers
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
    // Optional: Add a custom drag image or class to body
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

  const activeFiltersCount = (filterStatus !== 'All' ? 1 : 0) + (filterPriority !== 'All' ? 1 : 0) + (filterProject !== 'All' ? 1 : 0);
  const clearFilters = () => {
      setFilterStatus('All');
      setFilterPriority('All');
      setFilterProject('All');
      setSearchQuery('');
  };

  return (
    <>
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b]">
        
        {/* --- Header --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 gap-4">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Tasks</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    {filteredTasks.length} tasks matching your criteria.
                </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
                {/* View Switcher */}
                <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 mr-2">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        title="List View"
                    >
                        <ListIcon size={14} />
                    </button>
                    <button 
                        onClick={() => setViewMode('board')}
                        className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'board' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        title="Board View"
                    >
                        <LayoutGrid size={14} />
                    </button>
                </div>

                {/* Sort Controls (List only usually, but good for both) */}
                <div className="hidden md:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 bg-white dark:bg-white/5 mr-2">
                    <span className="text-[10px] uppercase text-gray-400 font-bold mr-1">Sort</span>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer text-black dark:text-white font-medium focus:outline-none"
                    >
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Name</option>
                    </select>
                    <button 
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="ml-1 p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500"
                    >
                        <ArrowUpDown size={12} className={sortOrder === 'asc' ? '' : 'rotate-180'} />
                    </button>
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks..." 
                        className="w-40 lg:w-56 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:ring-0 transition-all"
                    />
                </div>

                {/* Filter Toggle */}
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors text-xs font-medium ${isFilterOpen || activeFiltersCount > 0 ? 'bg-gray-50 dark:bg-white/10 border-gray-300 dark:border-gray-600 text-black dark:text-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    <SlidersHorizontal size={14} />
                    <span className="hidden sm:inline">Filter</span>
                    {activeFiltersCount > 0 && (
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-[9px]">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>

                <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1"></div>

                {/* Add Task */}
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm ml-1"
                >
                    <Plus size={14} />
                    <span className="hidden lg:inline">New Task</span>
                </button>
            </div>
        </div>

        {/* --- Filter Panel --- */}
        {isFilterOpen && (
            <div className="mb-6 p-5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex flex-wrap items-end gap-6">
                    {/* Status Filter */}
                    <div className="w-full sm:w-auto">
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Status</label>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full sm:w-40 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20"
                        >
                            <option value="All">All Statuses</option>
                            {taskStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Priority Filter */}
                    <div className="w-full sm:w-auto">
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Priority</label>
                        <select 
                            value={filterPriority} 
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="w-full sm:w-40 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20"
                        >
                            <option value="All">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    {/* Project Filter */}
                    <div className="w-full sm:w-auto">
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Project</label>
                        <select 
                            value={filterProject} 
                            onChange={(e) => setFilterProject(e.target.value)}
                            className="w-full sm:w-48 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20"
                        >
                            <option value="All">All Projects</option>
                            {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex items-center gap-2 ml-auto mt-4 sm:mt-0">
                        <button 
                            onClick={clearFilters}
                            className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors px-3 py-1.5"
                        >
                            Clear All
                        </button>
                        <button 
                            onClick={() => setIsFilterOpen(false)}
                            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- Content Area --- */}
        <div className="flex-1 overflow-hidden">
            {sortedTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                        <Search size={24} className="opacity-20" />
                    </div>
                    <p className="text-sm">No tasks found matching your filters.</p>
                    <button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-2">Clear Filters</button>
                </div>
            ) : viewMode === 'list' ? (
                /* --- List View --- */
                <div className="h-full overflow-y-auto custom-scrollbar fade-in bg-white dark:bg-[#18181b] rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 uppercase tracking-widest font-medium sticky top-0 bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm z-10">
                            <th className="py-3 px-4 font-medium w-[30%]">Task Name</th>
                            <th className="py-3 px-4 font-medium">Project</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Priority</th>
                            <th className="py-3 px-4 font-medium">Assignee</th>
                            <th className="py-3 px-4 font-medium text-right">Due Date</th>
                            <th className="py-3 px-4 font-medium w-10"></th>
                        </tr>
                        </thead>
                        <tbody className="text-xs">
                            {sortedTasks.map(task => (
                                <TaskRow key={task.id} task={task} onClick={() => onSelectTask(task.id)} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* --- Board View --- */
                <div className="h-full overflow-x-auto custom-scrollbar pb-4 fade-in">
                    <div className="flex gap-6 h-full min-w-max">
                        {taskStatuses.map(status => {
                            const statusTasks = sortedTasks.filter(t => t.status === status);
                            return (
                                <div 
                                    key={status}
                                    className="w-80 flex flex-col h-full bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-200/60 dark:border-gray-800/60 p-2"
                                    onDragOver={onDragOver}
                                    onDrop={(e) => onDrop(e, status)}
                                >
                                    {/* Column Header */}
                                    <div className="flex justify-between items-center px-3 py-3 mb-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">{status}</h3>
                                            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700 shadow-sm">
                                                {statusTasks.length}
                                            </span>
                                        </div>
                                        <button className="text-gray-400 hover:text-black dark:hover:text-white p-1 rounded hover:bg-white dark:hover:bg-white/10 transition-colors">
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>

                                    {/* Drop Zone */}
                                    <div className="flex-1 space-y-2.5 overflow-y-auto custom-scrollbar px-1 pb-20">
                                        {statusTasks.map(task => (
                                            <TaskBoardCard 
                                                key={task.id} 
                                                task={task} 
                                                isDragging={draggedTaskId === task.id}
                                                onDragStart={onDragStart}
                                                onClick={() => onSelectTask(task.id)}
                                            />
                                        ))}

                                        {statusTasks.length === 0 && (
                                            <div className="h-24 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center opacity-50 text-gray-400 gap-1 m-1">
                                                <span className="text-[10px]">Drag tasks here</span>
                                            </div>
                                        )}
                                        
                                        {/* Quick Add Placeholder */}
                                        <button 
                                            onClick={() => setIsAddModalOpen(true)}
                                            className="w-full py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 text-xs hover:border-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={12} /> Add
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
        </div>

        <AddTaskModal 
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddTask}
            projects={projects}
        />
    </>
  );
};

export default TasksList;
