
import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Trash2, Edit, MoreHorizontal, ArrowUpDown, ChevronRight, Hash, Book, DollarSign } from 'lucide-react';
import { GLAccount } from '../types';
import { MOCK_ACCOUNTS } from '../constants';
import AddAccountModal from '../components/finance/AddAccountModal';

const ChartOfAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<GLAccount[]>(MOCK_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<GLAccount | undefined>(undefined);

  // Sorting
  const [sortConfig, setSortConfig] = useState<{ key: keyof GLAccount; direction: 'asc' | 'desc' }>({ key: 'code', direction: 'asc' });

  // --- Logic ---

  const handleAddAccount = (accountData: Omit<GLAccount, 'id'>) => {
      if (editingAccount) {
          setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...a, ...accountData } : a));
          setEditingAccount(undefined);
      } else {
          const newAccount: GLAccount = {
              ...accountData,
              id: `GL-${Date.now()}`
          };
          setAccounts(prev => [...prev, newAccount]);
      }
  };

  const handleDelete = (id: string) => {
      if(confirm('Are you sure you want to delete this account? This may affect historical data.')) {
          setAccounts(prev => prev.filter(a => a.id !== id));
      }
  };

  const handleEdit = (account: GLAccount) => {
      setEditingAccount(account);
      setIsModalOpen(true);
  };

  const handleSort = (key: keyof GLAccount) => {
      setSortConfig(current => ({
          key,
          direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
      }));
  };

  // --- Derived Data ---

  const filteredAccounts = useMemo(() => {
      return accounts.filter(acc => {
          const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                acc.code.includes(searchQuery);
          const matchesType = filterType === 'All' || acc.type === filterType;
          return matchesSearch && matchesType;
      });
  }, [accounts, searchQuery, filterType]);

  const sortedAccounts = useMemo(() => {
      return [...filteredAccounts].sort((a, b) => {
          const aVal = a[sortConfig.key] || '';
          const bVal = b[sortConfig.key] || '';
          
          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  }, [filteredAccounts, sortConfig]);

  // Balance Sheet Summary
  const summary = useMemo(() => {
      const assets = accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0);
      const liabilities = accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0);
      const equity = accounts.filter(a => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0);
      const income = accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0);
      const expense = accounts.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);
      return { assets, liabilities, equity, income, expense };
  }, [accounts]);

  const getTypeColor = (type: string) => {
      switch(type) {
          case 'Asset': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
          case 'Liability': return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20';
          case 'Equity': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
          case 'Revenue': return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-500/20';
          case 'Expense': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
          default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
      }
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Chart of Accounts</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Manage your general ledger accounts and structure.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-1">
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[140px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">Total Assets</span>
                    <div className="text-lg font-light text-green-600 dark:text-green-400 mt-0.5">${summary.assets.toLocaleString()}</div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[140px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">Total Liabilities</span>
                    <div className="text-lg font-light text-red-600 dark:text-red-400 mt-0.5">${summary.liabilities.toLocaleString()}</div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[140px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">Equity</span>
                    <div className="text-lg font-light text-blue-600 dark:text-blue-400 mt-0.5">${summary.equity.toLocaleString()}</div>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0">
             <div className="flex gap-2 w-full md:w-auto">
                 <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search accounts..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-8 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 appearance-none min-w-[140px]"
                    >
                        <option value="All">All Types</option>
                        <option value="Asset">Assets</option>
                        <option value="Liability">Liabilities</option>
                        <option value="Equity">Equity</option>
                        <option value="Revenue">Revenue</option>
                        <option value="Expense">Expenses</option>
                    </select>
                </div>
             </div>

             <div className="flex gap-2">
                 <button 
                    onClick={() => alert("Exporting COA...")}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" 
                    title="Export CSV"
                 >
                     <Download size={16} className="text-gray-500" />
                 </button>
                 <button 
                    onClick={() => { setEditingAccount(undefined); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-colors text-xs font-medium shadow-sm"
                >
                    <Plus size={14} /> Add Account
                </button>
             </div>
        </div>

        {/* Account Table */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col">
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                 <table className="w-full text-left border-collapse">
                     <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold sticky top-0 backdrop-blur-sm z-10">
                         <tr>
                             <th className="px-6 py-3 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('code')}>
                                 <div className="flex items-center gap-1">Code <ArrowUpDown size={10} /></div>
                             </th>
                             <th className="px-6 py-3 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('name')}>
                                 <div className="flex items-center gap-1">Name <ArrowUpDown size={10} /></div>
                             </th>
                             <th className="px-6 py-3">Type</th>
                             <th className="px-6 py-3">Detail Type</th>
                             <th className="px-6 py-3 text-right">Balance</th>
                             <th className="px-6 py-3 text-center">Status</th>
                             <th className="px-6 py-3 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs">
                         {sortedAccounts.map(account => (
                             <tr key={account.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                 <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{account.code}</td>
                                 <td className="px-6 py-4 font-medium text-black dark:text-white">{account.name}</td>
                                 <td className="px-6 py-4">
                                     <span className={`px-2 py-0.5 rounded text-[10px] border w-fit font-medium ${getTypeColor(account.type)}`}>
                                         {account.type}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{account.subtype}</td>
                                 <td className="px-6 py-4 text-right font-mono text-black dark:text-white">${account.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                 <td className="px-6 py-4 text-center">
                                     <span className={`text-[10px] ${account.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                                         {account.status}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                     <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button onClick={() => handleEdit(account)} className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors" title="Edit">
                                             <Edit size={14} />
                                         </button>
                                         <button onClick={() => handleDelete(account.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Delete">
                                             <Trash2 size={14} />
                                         </button>
                                     </div>
                                 </td>
                             </tr>
                         ))}
                         {filteredAccounts.length === 0 && (
                             <tr>
                                 <td colSpan={7} className="py-12 text-center text-gray-400">No accounts found.</td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>
        </div>

    </div>

    <AddAccountModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAccount}
        initialData={editingAccount}
    />
    </>
  );
};

export default ChartOfAccounts;
