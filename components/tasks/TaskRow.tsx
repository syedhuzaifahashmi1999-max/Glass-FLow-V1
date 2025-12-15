
import React from 'react';
import { ArrowUpRight, Calendar, Flag } from 'lucide-react';
import { Task } from '../../types';

interface TaskRowProps {
  task: Task;
  onClick: () => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20';
      case 'Medium': return 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20';
      case 'Low': return 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
      default: return 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-gray-800';
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'Done': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
        case 'In Progress': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
        case 'Review': return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-500/20';
        default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <tr 
      onClick={onClick}
      className="group border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
    >
      <td className="py-3 px-4">
          <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${task.status === 'Done' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <span className="text-sm font-medium text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{task.title}</span>
          </div>
      </td>
      <td className="py-3 px-4">
        {task.project ? (
            <span className="px-2 py-0.5 rounded text-[10px] bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">{task.project}</span>
        ) : (
            <span className="text-[10px] text-gray-300 dark:text-gray-600 italic">No Project</span>
        )}
      </td>
      <td className="py-3 px-4">
        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${getStatusStyle(task.status)}`}>
          {task.status}
        </span>
      </td>
      <td className="py-3 px-4">
         <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-medium ${getPriorityColor(task.priority)}`}>
            <Flag size={10} />
            {task.priority}
         </div>
      </td>
      <td className="py-3 px-4">
         <div className="flex items-center gap-2">
            {task.assignee ? (
                <img src={task.assignee} alt={task.assigneeName} className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700" />
            ) : (
                <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"></div>
            )}
            <span className="text-xs text-gray-600 dark:text-gray-300">{task.assigneeName || 'Unassigned'}</span>
         </div>
      </td>
      <td className="py-3 px-4 text-gray-400 text-right font-light">
        <div className="flex items-center justify-end gap-1.5">
            <Calendar size={12} />
            {task.dueDate}
        </div>
      </td>
      <td className="py-3 px-4 text-right">
           <ArrowUpRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors" />
      </td>
    </tr>
  );
};

export default TaskRow;
