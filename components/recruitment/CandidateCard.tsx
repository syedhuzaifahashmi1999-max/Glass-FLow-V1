
import React, { useState } from 'react';
import { Candidate } from '../../types';
import { Mail, Phone, Star, MoreHorizontal, Trash2, Edit } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, isDragging, onDragStart, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, candidate.id)}
      className={`
        group relative p-4 rounded-lg bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none flex flex-col gap-3
        ${isDragging ? 'opacity-30 rotate-1 scale-95' : 'opacity-100'}
      `}
    >
      <div className="flex items-start gap-3">
        <img src={candidate.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-black dark:text-white truncate">{candidate.name}</h4>
          <p className="text-xs text-blue-600 dark:text-blue-400 truncate">{candidate.role}</p>
        </div>
        
        {/* Context Menu Trigger */}
        <div className="relative">
            <button 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                className="p-1 rounded hover:bg-gray-50 dark:hover:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
                <MoreHorizontal size={14} />
            </button>
            
            {/* Dropdown */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-28 bg-white dark:bg-[#18181b] rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 z-20 py-1 flex flex-col animate-in fade-in zoom-in-95 origin-top-right">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onEdit(candidate); }}
                            className="text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                        >
                            <Edit size={12} /> Edit
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onDelete(candidate.id); }}
                            className="text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
          <Mail size={10} className="shrink-0" />
          <span className="truncate">{candidate.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
          <Phone size={10} className="shrink-0" />
          <span className="truncate">{candidate.phone}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              size={10} 
              className={star <= candidate.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'} 
            />
          ))}
        </div>
        <span className="text-[9px] text-gray-400 font-mono">{candidate.appliedDate}</span>
      </div>
    </div>
  );
};

export default CandidateCard;
