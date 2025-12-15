
import React from 'react';
import { Monitor, Cpu, Box, Truck, User, Edit, Trash2, CheckSquare, Square } from 'lucide-react';
import { Asset } from '../../types';

interface AssetRowProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

const AssetRow: React.FC<AssetRowProps> = ({ asset, onEdit, onDelete, selected = false, onSelect }) => {
  
  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Use': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Maintenance': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Retired': return 'bg-gray-50 text-gray-600 border-gray-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getIcon = (category: Asset['category']) => {
      switch(category) {
          case 'Hardware': return <Monitor size={14} className="text-gray-500" />;
          case 'Software': return <Cpu size={14} className="text-gray-500" />;
          case 'Furniture': return <Box size={14} className="text-gray-500" />;
          case 'Vehicle': return <Truck size={14} className="text-gray-500" />;
          default: return <Box size={14} className="text-gray-500" />;
      }
  };

  return (
    <tr 
        className={`group border-b border-gray-50 transition-colors cursor-pointer ${selected ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
        onClick={() => onSelect && onSelect(asset.id)}
    >
      <td className="py-3 px-4 w-10 text-center">
          <button className={`text-gray-300 ${selected ? 'text-black' : 'group-hover:text-gray-400'}`}>
              {selected ? <CheckSquare size={14} /> : <Square size={14} />}
          </button>
      </td>
      <td className="py-3 px-6">
          <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gray-50 rounded border border-gray-100">
                  {getIcon(asset.category)}
              </div>
              <div className="flex flex-col">
                  <span className="text-sm font-medium text-black">{asset.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{asset.id}</span>
              </div>
          </div>
      </td>
      <td className="py-3 px-4 text-xs text-gray-600">{asset.category}</td>
      <td className="py-3 px-4 text-xs text-gray-500 font-mono">{asset.serialNumber || '-'}</td>
      <td className="py-3 px-4">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(asset.status)}`}>
              {asset.status}
          </span>
      </td>
      <td className="py-3 px-4">
          {asset.assignedToName ? (
              <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                      <User size={10} />
                  </div>
                  <span className="text-xs text-gray-700">{asset.assignedToName}</span>
              </div>
          ) : (
              <span className="text-xs text-gray-400 italic">Unassigned</span>
          )}
      </td>
      <td className="py-3 px-4 text-right font-mono text-xs text-black">
          ${asset.value.toLocaleString()}
      </td>
      <td className="py-3 px-4 text-right">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
                onClick={(e) => { e.stopPropagation(); onEdit(asset); }} 
                className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded transition-colors"
             >
                 <Edit size={14} />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); onDelete(asset.id); }} 
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
             >
                 <Trash2 size={14} />
             </button>
          </div>
      </td>
    </tr>
  );
};

export default AssetRow;
