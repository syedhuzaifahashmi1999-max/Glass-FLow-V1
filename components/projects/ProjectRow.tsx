
import React from 'react';
import { ArrowUpRight, Flag } from 'lucide-react';
import { Project } from '../../types';

interface ProjectRowProps {
  project: Project;
  onClick: () => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, onClick }) => {
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
    <tr 
      onClick={onClick}
      className="group border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
    >
      <td className="py-3 px-4">
          <div className="flex flex-col">
              <span className="text-sm font-medium text-black dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">{project.name}</span>
              <div className="flex gap-1 mt-1">
                 <span className="text-[9px] text-gray-400 border border-gray-100 dark:border-gray-700 rounded px-1">{project.category}</span>
              </div>
          </div>
      </td>
      <td className="py-3 px-4 text-gray-600 dark:text-gray-300 font-light text-sm">{project.client}</td>
      <td className="py-3 px-4">
        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-medium ${getPriorityColor(project.priority)}`}>
           <Flag size={8} /> {project.priority}
        </div>
      </td>
      <td className="py-3 px-4">
         <div className="flex items-center gap-2">
             <div className="w-20 bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                    className="bg-black dark:bg-white h-full rounded-full" 
                    style={{ width: `${project.progress}%` }}
                ></div>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">{project.progress}%</span>
         </div>
      </td>
      <td className="py-3 px-4">
          <div className="flex -space-x-1.5">
            {project.members.slice(0, 3).map((avatar, i) => (
            <img 
                key={i} 
                src={avatar} 
                alt="Member" 
                className="w-6 h-6 rounded-full border border-white dark:border-[#18181b] grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
            />
            ))}
        </div>
      </td>
      <td className="py-3 px-4 text-black dark:text-white text-right font-mono opacity-80 text-sm">
        {project.budget}
      </td>
      <td className="py-3 px-4 text-gray-400 text-right font-light text-sm">
        {project.dueDate}
      </td>
      <td className="py-3 px-4 text-right">
           <ArrowUpRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors" />
      </td>
    </tr>
  );
};

export default ProjectRow;
