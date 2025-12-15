
import React from 'react';
import { Lead, LeadStage } from '../../types';
import { ArrowRight, Receipt } from 'lucide-react';

interface LeadRowProps {
  lead: Lead;
  onConvert?: (lead: Lead) => void;
  currency?: string;
}

const LeadRow: React.FC<LeadRowProps> = ({ lead, onConvert, currency = 'USD' }) => {
  return (
    <tr className="group border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
      <td className="py-3 px-4 text-gray-400 group-hover:text-black dark:group-hover:text-white font-mono text-[10px] uppercase w-20">
        #{lead.id}
      </td>
      <td className="py-3 px-4 text-black dark:text-white font-medium">
         <div className="flex flex-col">
            <span>{lead.name}</span>
            <span className="text-[9px] text-gray-400 font-light">{lead.type}</span>
         </div>
      </td>
      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-light">{lead.company}</td>
      <td className="py-3 px-4">
        <span className="inline-block px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent text-gray-500 dark:text-gray-400 text-[10px]">
          {lead.stage}
        </span>
      </td>
      <td className="py-3 px-4 text-black dark:text-white text-right font-mono opacity-80 group-hover:opacity-100">
        {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(lead.value)}
      </td>
      <td className="py-3 px-4 text-gray-400 text-right font-light">
        {lead.lastActive}
      </td>
      <td className="py-3 px-4 w-40">
         {lead.stage === LeadStage.QUALIFIED && onConvert && (
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onConvert(lead);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-colors w-full justify-center ${
                    lead.type === 'Project' 
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20' 
                        : 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20'
                }`}
             >
                {lead.type === 'Project' ? (
                    <>
                        To Project <ArrowRight size={10} />
                    </>
                ) : (
                    <>
                        To Invoice <Receipt size={10} />
                    </>
                )}
             </button>
         )}
      </td>
    </tr>
  );
};

export default LeadRow;
