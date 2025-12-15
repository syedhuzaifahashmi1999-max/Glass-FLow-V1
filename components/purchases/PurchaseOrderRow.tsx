
import React from 'react';
import { PurchaseOrder } from '../../types';
import { ShoppingBag, Edit, Trash2, CheckSquare, Square, ChevronRight } from 'lucide-react';

interface PurchaseOrderRowProps {
  po: PurchaseOrder;
  onDelete: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onView?: (po: PurchaseOrder) => void;
}

const PurchaseOrderRow: React.FC<PurchaseOrderRowProps> = ({ po, onDelete, selected = false, onSelect, onView }) => {
  const getStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Received': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
      case 'Ordered': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
      case 'Draft': return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      case 'Cancelled': return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20';
      default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <tr 
        className={`group border-b border-gray-50 dark:border-gray-800 transition-colors cursor-pointer ${selected ? 'bg-blue-50/30 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
        onClick={() => onView && onView(po)}
    >
      <td className="py-3 px-4 w-10 text-center" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onSelect && onSelect(po.id)} 
            className={`flex items-center justify-center transition-colors ${selected ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'}`}
          >
              {selected ? <CheckSquare size={16} /> : <Square size={16} />}
          </button>
      </td>
      <td className="py-3 px-6">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-50 dark:bg-white/5 rounded border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
             <ShoppingBag size={14} />
          </div>
          <div className="flex flex-col">
             <span className="font-mono text-xs font-medium text-black dark:text-white">{po.id}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 font-medium text-black dark:text-white">{po.vendorName}</td>
      <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">{po.orderDate}</td>
      <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">{po.expectedDate || '-'}</td>
      <td className="py-3 px-4">
        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${getStatusColor(po.status)}`}>
          {po.status}
        </span>
      </td>
      <td className="py-3 px-4 text-right font-mono text-sm text-black dark:text-white">
        ${po.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(po.id); }}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors" 
                title="Delete"
            >
                <Trash2 size={14} />
            </button>
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 ml-1" />
        </div>
      </td>
    </tr>
  );
};

export default PurchaseOrderRow;
