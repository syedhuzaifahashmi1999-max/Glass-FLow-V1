
import React, { useState, useMemo } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Wallet, History, Search, X, Check, Filter, Download, Trash2, Edit } from 'lucide-react';
import { BankAccount, BankTransaction, GLAccount } from '../types';
import { MOCK_ACCOUNTS } from '../constants';
import BankAccountModal from '../components/bank/BankAccountModal';
import BankTransactionModal from '../components/bank/BankTransactionModal';

interface BankDashboardProps {
  accounts: BankAccount[];
  transactions: BankTransaction[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<BankTransaction[]>>;
  currency?: string;
  glAccounts?: GLAccount[]; // Pass accounts for linking
}

const BankDashboard: React.FC<BankDashboardProps> = ({ accounts, transactions, setAccounts, setTransactions, currency = 'USD', glAccounts = MOCK_ACCOUNTS }) => {
  // --- UI State ---
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Credit' | 'Debit'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Cleared' | 'Pending'>('All');
  
  // --- Modal State ---
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | undefined>(undefined);
  
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // --- Helpers ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
  };

  // --- Handlers: Accounts ---

  const handleSaveAccount = (accountData: BankAccount) => {
      if (editingAccount) {
          // Edit Mode
          setAccounts(prev => prev.map(acc => acc.id === editingAccount.id ? accountData : acc));
          setEditingAccount(undefined);
      } else {
          // Create Mode
          setAccounts(prev => [...prev, accountData]);
      }
  };

  const handleEditAccount = (account: BankAccount) => {
      setEditingAccount(account);
      setIsAccountModalOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
      if (confirm('Are you sure you want to delete this bank account? This will hide all associated transactions.')) {
          setAccounts(prev => prev.filter(a => a.id !== id));
          if (selectedAccountId === id) setSelectedAccountId(null);
      }
  };

  const handleModalClose = () => {
      setIsAccountModalOpen(false);
      setEditingAccount(undefined);
  };

  // --- Handlers: Transactions ---

  const handleAddTransaction = (txnData: Omit<BankTransaction, 'id'>) => {
      const newTxn: BankTransaction = {
          ...txnData,
          id: `BT-${Date.now()}`
      };
      
      setTransactions(prev => [newTxn, ...prev]);

      // Update Balance automatically
      setAccounts(prev => prev.map(acc => {
          if (acc.id === txnData.accountId) {
              const change = txnData.type === 'Credit' ? txnData.amount : -txnData.amount;
              return { ...acc, balance: acc.balance + change };
          }
          return acc;
      }));
  };

  const handleDeleteTransaction = (id: string) => {
      const txn = transactions.find(t => t.id === id);
      if (txn && confirm('Delete this transaction? The amount will be reverted from the account balance.')) {
          setTransactions(prev => prev.filter(t => t.id !== id));
          
          // Revert Balance
          setAccounts(prev => prev.map(acc => {
              if (acc.id === txn.accountId) {
                  // If we delete a credit, we subtract. If we delete a debit, we add.
                  const revertChange = txn.type === 'Credit' ? -txn.amount : txn.amount;
                  return { ...acc, balance: acc.balance + revertChange };
              }
              return acc;
          }));
      }
  };

  const handleExportCSV = () => {
      const headers = ['ID', 'Date', 'Description', 'Amount', 'Type', 'Category', 'Status', 'Account ID'];
      const csvContent = [
          headers.join(','),
          ...filteredTransactions.map(t => [
              t.id, t.date, `"${t.description}"`, t.amount, t.type, t.category, t.status, t.accountId
          ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // --- Helpers ---

  const getCardGradient = (color: string) => {
      switch(color) {
          case 'black': return 'bg-gradient-to-br from-gray-900 to-black text-white';
          case 'blue': return 'bg-gradient-to-br from-blue-600 to-blue-800 text-white';
          case 'purple': return 'bg-gradient-to-br from-purple-600 to-purple-800 text-white';
          case 'slate': return 'bg-gradient-to-br from-slate-600 to-slate-800 text-white';
          default: return 'bg-gradient-to-br from-gray-900 to-black text-white';
      }
  };

  // --- Filtering Logic ---

  const filteredTransactions = useMemo(() => {
      return transactions.filter(t => {
          const matchesAccount = selectedAccountId ? t.accountId === selectedAccountId : true;
          const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                t.category.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesType = typeFilter === 'All' || t.type === typeFilter;
          const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
          
          return matchesAccount && matchesSearch && matchesType && matchesStatus;
      });
  }, [transactions, selectedAccountId, searchQuery, typeFilter, statusFilter]);

  // --- Summary Stats Calculation ---
  const stats = useMemo(() => {
      let income = 0;
      let expense = 0;
      
      filteredTransactions.forEach(t => {
          if (t.type === 'Credit') income += t.amount;
          else expense += t.amount;
      });

      return { income, expense, net: income - expense };
  }, [filteredTransactions]);

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Banking & Finance</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    Manage accounts, track cash flow, and reconcile transactions.
                </p>
            </div>
            <button 
                onClick={() => setIsAccountModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm"
            >
                <Plus size={14} /> Connect Account
            </button>
        </div>

        {/* Account Cards */}
        <div className="flex gap-6 overflow-x-auto pb-6 mb-4 shrink-0 custom-scrollbar">
            {accounts.map(acc => (
                <div 
                    key={acc.id} 
                    onClick={() => setSelectedAccountId(selectedAccountId === acc.id ? null : acc.id)}
                    className={`
                        w-80 h-48 rounded-xl shadow-lg p-6 flex flex-col justify-between shrink-0 relative overflow-hidden cursor-pointer transition-all duration-300
                        ${getCardGradient(acc.color)}
                        ${selectedAccountId === acc.id ? 'ring-4 ring-offset-2 ring-gray-200 dark:ring-gray-700 scale-[1.02]' : 'hover:-translate-y-1 opacity-90 hover:opacity-100'}
                    `}
                >
                    {/* Abstract Overlay */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{acc.bankName}</p>
                            <p className="text-[10px] opacity-60">{acc.type}</p>
                        </div>
                        <div className="flex gap-2">
                            {selectedAccountId === acc.id && <Check size={18} className="text-white/80" />}
                            <div className="group relative" onClick={(e) => e.stopPropagation()}>
                                <button className="p-1 hover:bg-white/10 rounded">
                                    <MoreHorizontal size={18} className="opacity-80" />
                                </button>
                                {/* Dropdown Menu for Edit/Delete */}
                                <div className="absolute right-0 top-full mt-1 w-24 bg-white dark:bg-[#18181b] rounded shadow-xl py-1 z-20 hidden group-hover:block animate-in fade-in zoom-in-95 border border-gray-100 dark:border-gray-800">
                                    <button onClick={() => handleEditAccount(acc)} className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10">Edit</button>
                                    <button onClick={() => handleDeleteAccount(acc.id)} className="block w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="z-10">
                        <p className="text-3xl font-light tracking-tight mb-1">{formatCurrency(acc.balance)}</p>
                        <div className="flex justify-between items-center mt-4">
                            <p className="font-mono text-sm opacity-80">{acc.accountNumber}</p>
                            {/* Visual Indicator if Linked */}
                            {acc.glAccountId && (
                                <div className="w-2 h-2 rounded-full bg-green-400" title="Linked to Ledger"></div>
                            )}
                            <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center">
                                <div className="w-4 h-3 border border-white/50 rounded-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Add Card Placeholder */}
            <button 
                onClick={() => setIsAccountModalOpen(true)}
                className="w-20 h-48 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shrink-0"
                title="Add New Account"
            >
                <Plus size={24} />
            </button>
        </div>

        {/* --- Financial Summary Bar --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
            <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Total Inflow</p>
                    <p className="text-lg font-light text-green-600 dark:text-green-400">+{formatCurrency(stats.income)}</p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-full text-green-600 dark:text-green-400"><ArrowDownLeft size={16} /></div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Total Outflow</p>
                    <p className="text-lg font-light text-black dark:text-white">-{formatCurrency(stats.expense)}</p>
                </div>
                <div className="p-2 bg-gray-200 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-400"><ArrowUpRight size={16} /></div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Net Cash Flow</p>
                    <p className={`text-lg font-medium ${stats.net >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>
                        {stats.net >= 0 ? '+' : ''}{formatCurrency(stats.net)}
                    </p>
                </div>
                <div className={`p-2 rounded-full ${stats.net >= 0 ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}><Wallet size={16} /></div>
            </div>
        </div>

        {/* --- Transactions Table Section --- */}
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/30 dark:bg-white/5">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search transactions..." 
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:ring-0 transition-all"
                        />
                    </div>
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden md:block"></div>
                    
                    {/* Filters */}
                    <div className="flex gap-2">
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 appearance-none"
                        >
                            <option value="All">All Types</option>
                            <option value="Credit">Credit</option>
                            <option value="Debit">Debit</option>
                        </select>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 appearance-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Cleared">Cleared</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button 
                        onClick={handleExportCSV}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        title="Export CSV"
                    >
                        <Download size={16} strokeWidth={1.5} />
                    </button>
                    <button 
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm flex-1 md:flex-none justify-center"
                    >
                        <Plus size={14} /> Add Transaction
                    </button>
                </div>
            </div>
            
            {/* Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 uppercase tracking-widest font-medium sticky top-0 bg-white dark:bg-[#18181b] z-10 shadow-sm shadow-gray-50 dark:shadow-gray-900">
                            <th className="py-3 px-6 w-1/3">Description</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Account</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-6 text-right">Amount</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-50 dark:divide-gray-800">
                        {filteredTransactions.length > 0 ? filteredTransactions.map(txn => {
                            const isCredit = txn.type === 'Credit';
                            const accountName = accounts.find(a => a.id === txn.accountId)?.name || 'Unknown';
                            const bankName = accounts.find(a => a.id === txn.accountId)?.bankName || '';
                            
                            return (
                                <tr key={txn.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                                    <td className="py-3 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-full shrink-0 ${isCredit ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                                                {isCredit ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-medium text-black dark:text-white truncate">{txn.description}</span>
                                                {txn.referenceId && <span className="text-[9px] text-gray-400 font-mono">Ref: {txn.referenceId}</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{txn.date}</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-0.5 rounded bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400">{txn.category}</span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                                        <span className="text-black dark:text-white">{accountName}</span> <span className="text-[10px] text-gray-400">({bankName})</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${txn.status === 'Cleared' ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10' : 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10'}`}>
                                            {txn.status === 'Cleared' && <Check size={10} />} {txn.status}
                                        </span>
                                    </td>
                                    <td className={`py-3 px-6 text-right font-mono font-medium ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-black dark:text-white'}`}>
                                        {isCredit ? '+' : '-'}{Math.abs(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button 
                                            onClick={() => handleDeleteTransaction(txn.id)}
                                            className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                            title="Delete Transaction"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search size={24} className="opacity-20" />
                                        <span className="text-sm">No transactions found matching your criteria.</span>
                                        <button onClick={() => { setSearchQuery(''); setTypeFilter('All'); setStatusFilter('All'); setSelectedAccountId(null); }} className="text-xs text-blue-600 hover:underline">Clear Filters</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    {/* Modals */}
    <BankAccountModal 
        isOpen={isAccountModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveAccount}
        initialData={editingAccount}
        glAccounts={glAccounts}
    />

    <BankTransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSave={handleAddTransaction}
        accounts={accounts}
        preselectedAccountId={selectedAccountId}
    />
    </>
  );
};

export default BankDashboard;
