
import React from 'react';
import { MoreHorizontal, Edit, Trash2, Box, Package, Layers } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onEdit, onDelete }) => {
  
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
        case 'Service': return <Layers size={14} className="text-blue-500" />;
        case 'Digital': return <Box size={14} className="text-purple-500" />;
        case 'Physical': return <Package size={14} className="text-orange-500" />;
        default: return <Package size={14} />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 flex flex-col h-[220px] cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
         <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700">
            {getTypeIcon(product.type)}
         </div>
         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
                onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
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
      </div>

      <div className="flex-1">
         <h3 className="text-sm font-semibold text-black dark:text-white mb-1 line-clamp-1">{product.name}</h3>
         <p className="text-[10px] text-gray-400 font-mono mb-2">{product.sku || 'NO-SKU'}</p>
         <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700 inline-block mb-3">
            {product.category}
         </span>
      </div>

      <div className="pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between mt-auto">
         <div className="flex flex-col">
            <span className="text-sm font-medium text-black dark:text-white">${product.price.toLocaleString()}</span>
            <span className="text-[9px] text-gray-400">{product.billingFrequency}</span>
         </div>
         <span className={`px-2 py-0.5 rounded border text-[9px] font-medium ${getStatusColor(product.status)}`}>
            {product.status}
         </span>
      </div>
    </div>
  );
};

export default ProductCard;
