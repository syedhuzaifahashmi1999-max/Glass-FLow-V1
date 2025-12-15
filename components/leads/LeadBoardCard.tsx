
import React from 'react';
import { Lead, LeadStage } from '../../types';
import { ArrowRight, Receipt } from 'lucide-react';

interface LeadBoardCardProps {
  lead: Lead;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onConvert?: (lead: Lead) => void;
  currency?: string;
}

const LeadBoardCard: React.FC<LeadBoardCardProps> = ({ lead, isDragging, onDragStart, onConvert, currency = 'USD' }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      className={`
        group relative p-4 rounded bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:shadow-md hover:shadow-gray-100 dark:hover:shadow-none
        ${isDragging ? 'opacity-30 rotate-1 scale-95' : 'opacity-100'}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-normal text-black dark:text-white leading-tight">{lead.name}</span>
        {lead.avatarUrl && (
          <img src={lead.avatarUrl} className="w-5 h-5 rounded-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-gray-100 dark:border-gray-700" alt="" />
        )}
      </div>
      
      <div className="mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-light truncate">{lead.company}</p>
        <span className="inline-block mt-1 text-[9px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-700">
            {lead.type}
        </span>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100 dark:border-gray-800">
        <span className="text-xs text-gray-900 dark:text-gray-200 font-mono">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(lead.value)}
        </span>
        <span className="text-[10px] text-gray-400">{lead.lastActive}</span>
      </div>

      {lead.stage === LeadStage.QUALIFIED && onConvert && (
          <div className="mt-3 pt-2 border-t border-gray-50 dark:border-gray-800">
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onConvert(lead);
                }}
                className={`w-full flex items-center justify-center gap-2 py-1.5 rounded text-[10px] font-medium transition-colors ${
                    lead.type === 'Project' 
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20' 
                        : 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20'
                }`}
             >
                {lead.type === 'Project' ? (
                    <>
                        Convert to Project <ArrowRight size={10} />
                    </>
                ) : (
                    <>
                        Create Invoice <Receipt size={10} />
                    </>
                )}
             </button>
          </div>
      )}
    </div>
  );
};

export default LeadBoardCard;
