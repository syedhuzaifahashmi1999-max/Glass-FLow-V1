
import React, { useState } from 'react';
import { Search, Filter, Plus, MessageSquare, AlertCircle, Clock, CheckCircle, MoreHorizontal } from 'lucide-react';
import { MOCK_TICKETS } from '../constants';
import { ServiceTicket } from '../types';

const ServiceList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = MOCK_TICKETS.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: ServiceTicket['status']) => {
    switch (status) {
      case 'Open': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'In Progress': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-100';
      case 'Closed': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getPriorityColor = (priority: ServiceTicket['priority']) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-100';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Low': return 'text-gray-500 bg-gray-50 border-gray-200';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 border-b border-gray-100 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-light text-black mb-1">Service & Support</h1>
          <p className="text-xs text-gray-500 font-light">
            Manage customer tickets, inquiries, and issues.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={14} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets..." 
                className="w-48 lg:w-64 bg-white border border-gray-200 rounded pl-9 pr-3 py-1.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black/20 focus:ring-0 transition-all"
              />
            </div>
            <button className="p-1.5 rounded border border-gray-200 bg-white text-gray-500 hover:text-black hover:border-gray-300 transition-colors">
              <Filter size={14} />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-black text-white hover:bg-gray-800 transition-colors text-xs font-medium shadow-sm ml-2">
              <Plus size={14} />
              <span className="hidden lg:inline">New Ticket</span>
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden fade-in">
        <div className="h-full overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest font-medium sticky top-0 bg-white z-10">
                <th className="py-3 px-4 font-medium w-32">ID</th>
                <th className="py-3 px-4 font-medium w-[40%]">Subject</th>
                <th className="py-3 px-4 font-medium">Customer</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Assignee</th>
                <th className="py-3 px-4 font-medium text-right">Created</th>
                <th className="py-3 px-4 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="group border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-400 group-hover:text-black font-mono">
                    #{ticket.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-black">{ticket.subject}</span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[9px] text-gray-500 border border-gray-200">{ticket.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {ticket.customerName}
                  </td>
                  <td className="py-3 px-4">
                     <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority === 'Critical' && <AlertCircle size={10} />}
                        {ticket.priority}
                     </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {ticket.assignedTo ? (
                        <img src={ticket.assignedTo} alt="Assignee" className="w-6 h-6 rounded-full border border-gray-200" />
                    ) : (
                        <span className="text-gray-300 italic text-[10px]">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-right font-light">
                    {ticket.createdAt}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-gray-300 hover:text-black transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
