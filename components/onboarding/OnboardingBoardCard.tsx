
import React from 'react';
import { EmployeeProcess } from '../../types';
import { CheckSquare, Clock } from 'lucide-react';

interface OnboardingBoardCardProps {
  process: EmployeeProcess;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onClick: () => void;
}

const OnboardingBoardCard: React.FC<OnboardingBoardCardProps> = ({ process, isDragging, onDragStart, onClick }) => {
  const completedTasks = process.tasks.filter(t => t.status === 'Completed').length;
  const totalTasks = process.tasks.length;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, process.id)}
      onClick={onClick}
      className={`
        bg-white p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group
        ${isDragging ? 'opacity-50 rotate-1' : 'opacity-100'}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img 
            src={process.avatarUrl} 
            alt={process.employeeName} 
            className="w-8 h-8 rounded-full object-cover border border-gray-100"
          />
          <div>
            <h4 className="text-sm font-bold text-black leading-tight">{process.employeeName}</h4>
            <p className="text-[10px] text-gray-500">{process.role}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-[10px] text-gray-400">
            <span>Progress</span>
            <span className="font-medium text-gray-600">{process.progress}%</span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full transition-all duration-500 ${process.progress === 100 ? 'bg-green-500' : 'bg-black'}`}
                style={{ width: `${process.progress}%` }}
            ></div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 pt-2 text-[10px] text-gray-400">
        <div className="flex items-center gap-1.5">
            <CheckSquare size={12} className={completedTasks === totalTasks ? 'text-green-500' : 'text-gray-400'} />
            <span>{completedTasks}/{totalTasks}</span>
        </div>
        <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{process.startDate}</span>
        </div>
      </div>
    </div>
  );
};

export default OnboardingBoardCard;
