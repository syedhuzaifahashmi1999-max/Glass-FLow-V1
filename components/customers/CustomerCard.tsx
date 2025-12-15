
import React from 'react';
import { Mail, Phone, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { Customer } from '../../types';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit, onDelete }) => {
  return (
    <div className="group relative bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 flex flex-col">
       <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <img src={customer.avatarUrl} alt={customer.name} className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-700 object-cover" />
             <div>
                 <h3 className="text-sm font-medium text-black dark:text-white mb-0.5">{customer.name}</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{customer.company}</p>
             </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
                onClick={() => onEdit(customer)}
                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
             >
                <Edit size={14} />
             </button>
             <button 
                onClick={() => onDelete(customer.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
             >
                <Trash2 size={14} />
             </button>
          </div>
       </div>

       <div className="space-y-2 mb-6 flex-1">
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
             <Mail size={12} className="text-gray-400" />
             <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
             <Phone size={12} className="text-gray-400" />
             <span>{customer.phone}</span>
          </div>
       </div>

       <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[9px] uppercase text-gray-400 font-medium mb-1">Total Spent</span>
             <span className="text-sm font-mono text-black dark:text-white">${customer.totalSpent.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
             <span className={`px-2 py-0.5 rounded text-[9px] font-medium border mb-1 ${
                customer.status === 'Active' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20' : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
             }`}>
                {customer.status}
             </span>
             <span className="text-[9px] text-gray-400 flex items-center gap-1">
                <Calendar size={10} /> {customer.lastOrderDate}
             </span>
          </div>
       </div>
    </div>
  );
};

export default CustomerCard;
