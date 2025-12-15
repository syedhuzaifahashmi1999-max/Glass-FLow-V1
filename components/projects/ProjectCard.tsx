
import React from 'react';
import { MoreHorizontal, Calendar, Flag, Layers, Share2 } from 'lucide-react';
import { Project, Team } from '../../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  team?: Team;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, team }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
      case 'Completed': return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700';
      case 'On Hold': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
      case 'Planning': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
      default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20';
      case 'Medium': return 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20';
      case 'Low': return 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
      default: return 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-gray-800';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 cursor-pointer flex flex-col h-[280px]"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">{project.client}</span>
             {project.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
          </div>
          <h3 className="text-lg font-normal text-black dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors truncate w-full">{project.name}</h3>
        </div>
        <button className="text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors p-1 hover:bg-gray-50 dark:hover:bg-white/5 rounded">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Meta Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${getPriorityColor(project.priority)}`}>
           <Flag size={8} /> {project.priority}
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400">
           <Layers size={8} /> {project.category}
        </span>
        {team && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border border-purple-100 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
               <Share2 size={8} /> {team.name}
            </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-gray-400 font-light line-clamp-3 mb-4 flex-1">
        {project.description}
      </p>

      {/* Footer */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
             <span>Progress</span>
             <span className="font-mono text-black dark:text-white">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1 overflow-hidden">
             <div 
               className="bg-black dark:bg-white h-full rounded-full transition-all duration-1000 ease-out" 
               style={{ width: `${project.progress}%` }}
             ></div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-gray-800">
           <div className="flex -space-x-2">
             {project.members.slice(0, 3).map((avatar, i) => (
               <img 
                 key={i} 
                 src={avatar} 
                 alt="Member" 
                 className="w-6 h-6 rounded-full border-2 border-white dark:border-[#18181b] grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
               />
             ))}
             {project.members.length > 3 && (
               <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#18181b] bg-gray-50 dark:bg-white/10 flex items-center justify-center text-[8px] text-gray-400">
                 +{project.members.length - 3}
               </div>
             )}
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-gray-400">
                 <span className="text-[10px] font-mono">{project.budget}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                 <Calendar size={12} />
                 <span className="text-[10px]">{project.dueDate}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
