
import React from 'react';
import { MoreHorizontal, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { Customer } from '../../types';

interface CustomerRowProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

const CustomerRow: React.FC<CustomerRowProps> = ({ customer, onEdit, onDelete }) => {
  return (
    <tr className="group border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img src={customer.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700" />
          <div>
            <div className="font-medium text-black dark:text-white text-sm">{customer.name}</div>
            <div className="text-gray-500 dark:text-gray-400 font-light text-xs">{customer.company}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col gap-1 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5 text-xs">
            <Mail size={10} />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Phone size={10} />
            <span>{customer.phone}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${
          customer.status === 'Active' 
            ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20' 
            : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
        }`}>
          {customer.status}
        </span>
      </td>
      <td className="py-3 px-4 text-black dark:text-white text-right font-mono text-sm">
        ${customer.totalSpent.toLocaleString()}
      </td>
      <td className="py-3 px-4 text-gray-400 text-right font-light text-sm">
        {customer.lastOrderDate}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={() => onEdit(customer)}
                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors"
                title="Edit"
            >
                <Edit size={14} />
            </button>
            <button 
                onClick={() => onDelete(customer.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                title="Delete"
            >
                <Trash2 size={14} />
            </button>
        </div>
      </td>
    </tr>
  );
};

export default CustomerRow;
