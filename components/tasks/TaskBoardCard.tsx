
import React from 'react';
import { Task } from '../../types';
import { Calendar, Flag } from 'lucide-react';

interface TaskBoardCardProps {
  task: Task;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onClick: () => void;
}

const TaskBoardCard: React.FC<TaskBoardCardProps> = ({ task, isDragging, onDragStart, onClick }) => {
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
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={onClick}
      className={`
        group relative p-4 rounded-lg bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none
        ${isDragging ? 'opacity-30 rotate-1 scale-95' : 'opacity-100'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
         <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-medium ${getPriorityColor(task.priority)}`}>
            <Flag size={8} />
            {task.priority}
         </div>
         {task.assignee && (
            <img src={task.assignee} className="w-5 h-5 rounded-full border border-gray-100 dark:border-gray-700" alt="" />
         )}
      </div>

      <h4 className="text-sm font-medium text-black dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{task.title}</h4>
      
      {task.project && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-light mb-3">{task.project}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map(tag => (
              <span key={tag} className="text-[9px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-700">
                  {tag}
              </span>
          ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <Calendar size={10} />
            <span>{task.dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskBoardCard;
