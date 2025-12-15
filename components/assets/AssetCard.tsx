import React from 'react';
import { Monitor, Cpu, Box, Truck, User, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Asset } from '../../types';

interface AssetCardProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onEdit, onDelete, selected = false, onSelect }) => {
  
  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
      case 'In Use': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
      case 'Maintenance': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
      case 'Retired': return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
    }
  };

  const getIcon = (category: Asset['category']) => {
      switch(category) {
          case 'Hardware': return <Monitor size={16} className="text-gray-600 dark:text-gray-300" />;
          case 'Software': return <Cpu size={16} className="text-gray-600 dark:text-gray-300" />;
          case 'Furniture': return <Box size={16} className="text-gray-600 dark:text-gray-300" />;
          case 'Vehicle': return <Truck size={16} className="text-gray-600 dark:text-gray-300" />;
          default: return <Box size={16} className="text-gray-600 dark:text-gray-300" />;
      }
  };

  return (
    <div 
        onClick={() => onSelect && onSelect(asset.id)}
        className={`
            group bg-white dark:bg-[#18181b] rounded-xl border p-5 hover:shadow-lg transition-all flex flex-col h-[220px] relative cursor-pointer
            ${selected ? 'border-black dark:border-white ring-1 ring-black dark:ring-white' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}
        `}
    >
      <div className="absolute top-4 right-4 z-10">
          {selected ? (
              <CheckCircle size={20} className="text-black dark:text-white fill-white dark:fill-black" />
          ) : (
              <Circle size={20} className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-400 dark:hover:text-gray-500" />
          )}
      </div>

      <div className="flex justify-between items-start mb-4">
         <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-700">
             {getIcon(asset.category)}
         </div>
      </div>

      <div className="flex-1">
          <h3 className="text-sm font-semibold text-black dark:text-white mb-1 line-clamp-1">{asset.name}</h3>
          <p className="text-[10px] text-gray-400 font-mono mb-2">{asset.serialNumber || 'No S/N'}</p>
          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-medium border ${getStatusColor(asset.status)}`}>
              {asset.status}
          </span>
      </div>

      <div className="pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between mt-auto">
         <div className="flex flex-col">
            <span className="text-xs font-mono text-black dark:text-white">${asset.value.toLocaleString()}</span>
            <span className="text-[9px] text-gray-400">{asset.assignedToName || 'Unassigned'}</span>
         </div>
         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
                onClick={(e) => { e.stopPropagation(); onEdit(asset); }}
                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
             >
                <Edit size={14} />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); onDelete(asset.id); }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
             >
                <Trash2 size={14} />
             </button>
         </div>
      </div>
    </div>
  );
};

export default AssetCard;