
import React from 'react';
import { MoreHorizontal, Edit, Trash2, Package, Box, Layers } from 'lucide-react';
import { Product } from '../../types';

interface ProductRowProps {
  product: Product;
  onClick: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, onClick, onEdit, onDelete }) => {
  
  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
      case 'Draft': return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      case 'Archived': return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20';
      default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: Product['type']) => {
    switch(type) {
        case 'Service': return <Layers size={12} className="text-blue-500" />;
        case 'Digital': return <Box size={12} className="text-purple-500" />;
        case 'Physical': return <Package size={12} className="text-orange-500" />;
        default: return <Package size={12} />;
    }
  };

  return (
    <tr 
      onClick={onClick}
      className="group border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
    >
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-medium text-black dark:text-white text-sm mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.name}</span>
          <span className="text-[10px] text-gray-400 font-mono">{product.sku || product.id}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600 dark:text-gray-300 text-xs">
        {product.category}
      </td>
      <td className="py-3 px-4">
         <div className="flex items-center gap-2">
            {getTypeIcon(product.type)}
            <span className="text-gray-600 dark:text-gray-300 text-xs">{product.type}</span>
         </div>
      </td>
      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
        {product.billingFrequency}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-0.5 text-black dark:text-white font-medium">
            <span className="text-[10px] text-gray-400">$</span>
            <span className="text-xs">{product.price.toLocaleString()}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${getStatusColor(product.status)}`}>
          {product.status}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
                onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors"
             >
                <Edit size={14} />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
             >
                <Trash2 size={14} />
             </button>
         </div>
      </td>
    </tr>
  );
};

export default ProductRow;
