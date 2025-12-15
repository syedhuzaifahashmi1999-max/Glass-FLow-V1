
import React from 'react';
import { Claim } from '../../types';
import { DollarSign, Clock, CheckCircle, XCircle, FileText, User, AlertTriangle } from 'lucide-react';

interface ClaimCardProps {
  claim: Claim;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onClick: () => void;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claim, isDragging, onDragStart, onClick }) => {
  
  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500';
      case 'Paid': return 'bg-blue-500';
      default: return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, claim.id)}
      onClick={onClick}
      className={`
        group relative bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-grab active:cursor-grabbing flex flex-col gap-3
        ${isDragging ? 'opacity-30 rotate-1 scale-95' : 'opacity-100'}
      `}
    >
      <div className="flex justify-between items-start">
         <div className="flex items-center gap-3">
             <img src={claim.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700 object-cover" />
             <div className="flex-1 min-w-0">
                 <h4 className="text-sm font-bold text-black dark:text-white leading-tight line-clamp-1">{claim.description}</h4>
                 <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.employeeName}</p>
             </div>
         </div>
         {claim.policyWarning && (
             <div className="text-red-500" title="Policy Warning">
                 <AlertTriangle size={14} />
             </div>
         )}
      </div>

      <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] px-2 py-0.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded text-gray-600 dark:text-gray-300">
              {claim.category}
          </span>
          <span className="text-sm font-mono font-bold text-black dark:text-white">
              ${claim.amount.toFixed(2)}
          </span>
      </div>

      <div className="pt-3 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center text-[10px] text-gray-400">
          <div className="flex items-center gap-1">
             <Clock size={12} /> {claim.date}
          </div>
          <div className="flex gap-2">
             {claim.receiptUrl && (
                 <div title="Receipt Attached">
                    <FileText size={12} className="text-blue-500" />
                 </div>
             )}
          </div>
      </div>
      
      {/* Status indicator line */}
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r ${getStatusColor(claim.status)}`}></div>
    </div>
  );
};

export default ClaimCard;
