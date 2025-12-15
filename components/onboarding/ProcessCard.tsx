
import React from 'react';
import { EmployeeProcess } from '../../types';
import { Clock, CheckSquare, ChevronRight } from 'lucide-react';

interface ProcessCardProps {
  process: EmployeeProcess;
  onClick: () => void;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ process, onClick }) => {
  const completedTasks = process.tasks.filter(t => t.status === 'Completed').length;
  const totalTasks = process.tasks.length;

  return (
    <div 
        onClick={onClick}
        className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer flex flex-col h-[200px]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
            <img src={process.avatarUrl} alt={process.employeeName} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
            <div>
                <h3 className="text-sm font-bold text-black">{process.employeeName}</h3>
                <p className="text-xs text-gray-500">{process.role}</p>
            </div>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
            process.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-50 text-gray-600 border-gray-200'
        }`}>
            {process.status}
        </span>
      </div>

      <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium uppercase tracking-wide">Current Stage</span>
              <span className="text-black font-semibold">{process.stage}</span>
          </div>

          <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Progress</span>
                  <span>{process.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-black h-full rounded-full transition-all duration-500" 
                    style={{ width: `${process.progress}%` }}
                  ></div>
              </div>
          </div>
      </div>

      <div className="pt-4 mt-auto border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                  <CheckSquare size={14} className={completedTasks === totalTasks ? 'text-green-500' : 'text-gray-400'} />
                  {completedTasks}/{totalTasks} Tasks
              </span>
              <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  {process.startDate}
              </span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default ProcessCard;
