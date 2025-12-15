
import React, { useState } from 'react';
import { Search, Plus, Filter, LayoutGrid, List, ArrowUpDown, X } from 'lucide-react';
import { Project, Team } from '../types';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectRow from '../components/projects/ProjectRow';
import AddProjectModal from '../components/projects/AddProjectModal';

interface ProjectsListProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  teams?: Team[];
  onSelectProject: (id: string) => void;
  currency?: string;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, setProjects, teams = [], onSelectProject, currency = 'USD' }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Sort
  const [sortBy, setSortBy] = useState<'name' | 'dueDate' | 'progress' | 'budget'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddProject = (projectData: Omit<Project, 'id' | 'members' | 'progress'>) => {
     const newProject: Project = {
         ...projectData,
         id: `p-${Date.now()}`,
         members: [], // Start with empty members or current user
         progress: 0
     };
     setProjects(prev => [newProject, ...prev]);
  };

  // Logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || p.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
     let comparison = 0;
     switch(sortBy) {
         case 'name':
             comparison = a.name.localeCompare(b.name);
             break;
         case 'dueDate':
             comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
             break;
         case 'progress':
             comparison = a.progress - b.progress;
             break;
         case 'budget':
             // Remove $ and , for comparison
             const budgetA = parseFloat(a.budget.replace(/[^0-9.-]+/g,""));
             const budgetB = parseFloat(b.budget.replace(/[^0-9.-]+/g,""));
             comparison = budgetA - budgetB;
             break;
     }
     return sortOrder === 'asc' ? comparison : -comparison;
  });

  const activeFiltersCount = (statusFilter !== 'All' ? 1 : 0) + (priorityFilter !== 'All' ? 1 : 0);
  const clearFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setSearchQuery('');
  };

  return (
    <>
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b]">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 gap-4">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Projects</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    {filteredProjects.length} active initiatives.
                </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
                {/* View Toggle */}
                <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 mr-2">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        title="List View"
                    >
                        <List size={14} />
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        title="Grid View"
                    >
                        <LayoutGrid size={14} />
                    </button>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 bg-white dark:bg-white/5 mr-2">
                    <span className="text-[10px] uppercase text-gray-400 font-bold mr-1">Sort</span>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer text-black dark:text-white font-medium focus:outline-none"
                    >
                        <option value="dueDate">Due Date</option>
                        <option value="name">Name</option>
                        <option value="progress">Progress</option>
                        <option value="budget">Budget</option>
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
                        placeholder="Search projects..." 
                        className="w-40 lg:w-56 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:ring-0 transition-all"
                    />
                </div>

                {/* Filter Toggle */}
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors text-xs font-medium ${isFilterOpen || activeFiltersCount > 0 ? 'bg-gray-50 dark:bg-white/10 border-gray-300 dark:border-gray-600 text-black dark:text-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    <Filter size={14} />
                    <span className="hidden sm:inline">Filter</span>
                    {activeFiltersCount > 0 && (
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-[9px]">
                        {activeFiltersCount}
                    </span>
                    )}
                </button>

                {/* Add Button */}
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm ml-2"
                >
                    <Plus size={14} />
                    <span className="hidden lg:inline">New Project</span>
                </button>
            </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex flex-wrap items-end gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Status</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Planning">Planning</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Priority</label>
                        <select 
                            value={priorityFilter} 
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors px-3">Clear All</button>
                        <button onClick={() => setIsFilterOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500"><X size={14} /></button>
                    </div>
                </div>
            </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden fade-in">
            {sortedProjects.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                        <Search size={24} className="opacity-20" />
                    </div>
                    <p className="text-sm">No projects found.</p>
                    <button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-2">Clear Filters</button>
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar h-full pb-10 content-start">
                    {sortedProjects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            team={teams.find(t => t.id === project.teamId)}
                            onClick={() => onSelectProject(project.id)} 
                        />
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="h-full overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 uppercase tracking-widest font-medium sticky top-0 bg-white dark:bg-[#18181b] z-10 shadow-sm">
                        <th className="py-3 px-4 font-medium w-64">Project Name</th>
                        <th className="py-3 px-4 font-medium w-40">Client</th>
                        <th className="py-3 px-4 font-medium w-32">Status</th>
                        <th className="py-3 px-4 font-medium w-32">Priority</th>
                        <th className="py-3 px-4 font-medium w-48">Progress</th>
                        <th className="py-3 px-4 font-medium w-32">Team</th>
                        <th className="py-3 px-4 font-medium text-right w-32">Budget</th>
                        <th className="py-3 px-4 font-medium text-right w-32">Due Date</th>
                        <th className="py-3 px-4 font-medium w-10"></th>
                    </tr>
                    </thead>
                    <tbody className="text-xs">
                    {sortedProjects.map((project) => (
                        <ProjectRow 
                        key={project.id} 
                        project={project} 
                        onClick={() => onSelectProject(project.id)} 
                        />
                    ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
        </div>
        
        <AddProjectModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            onSave={handleAddProject}
            teams={teams}
        />
    </>
  );
};

export default ProjectsList;
