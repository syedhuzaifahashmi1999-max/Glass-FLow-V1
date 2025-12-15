import React from 'react';
import { ArrowLeft, MoreHorizontal, Calendar, Flag, Clock, CheckCircle, User, Tag, Paperclip, Plus } from 'lucide-react';
import { Task } from '../types';

interface TaskDetailsProps {
  task: Task;
  onBack: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onBack }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-50 border-red-100';
      case 'Medium': return 'text-orange-500 bg-orange-50 border-orange-100';
      case 'Low': return 'text-blue-500 bg-blue-50 border-blue-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1200px] mx-auto h-full flex flex-col bg-white fade-in overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft size={12} />
          <span>Back to Tasks</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wide bg-gray-50 text-gray-600 border-gray-200`}>
                {task.status}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">#{task.id}</span>
            </div>
            <h1 className="text-2xl font-light text-black tracking-tight leading-snug">{task.title}</h1>
          </div>

          <div className="flex gap-3">
             <button className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition-colors text-xs font-medium shadow-sm">
                Mark Complete
             </button>
             <button className="p-2 rounded border border-gray-200 text-gray-400 hover:text-black transition-colors">
                <MoreHorizontal size={16} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Description */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4 flex items-center gap-2">
                Description
            </h3>
            <div className="text-sm text-gray-700 font-light leading-relaxed p-6 bg-gray-50/50 rounded-xl border border-gray-100">
                {task.description}
            </div>
          </div>

          {/* Activity / Comments Stub */}
          <div>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Activity</h3>
             </div>
             <div className="space-y-4 relative pl-4 border-l border-gray-100">
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gray-200 border-2 border-white"></div>
                    <div className="text-xs">
                        <span className="font-medium text-black">System</span> created this task
                        <span className="text-gray-400 ml-2">{task.createdAt}</span>
                    </div>
                </div>
                {/* Mock Comment */}
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white"></div>
                    <div className="text-xs">
                        <span className="font-medium text-black">{task.assigneeName}</span> changed status to <span className="font-medium">{task.status}</span>
                        <span className="text-gray-400 ml-2">2h ago</span>
                    </div>
                </div>
             </div>
             
             {/* Input Stub */}
             <div className="mt-6 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                    You
                </div>
                <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-black/20"
                />
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          
          {/* Properties */}
          <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm shadow-gray-100">
             
             {/* Assignee */}
             <div>
                <label className="text-[10px] text-gray-400 uppercase font-medium mb-2 block">Assignee</label>
                <div className="flex items-center gap-2">
                    {task.assignee ? (
                        <img src={task.assignee} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <User size={12} />
                        </div>
                    )}
                    <span className="text-sm font-medium text-black">{task.assigneeName || 'Unassigned'}</span>
                </div>
             </div>

             {/* Due Date */}
             <div>
                <label className="text-[10px] text-gray-400 uppercase font-medium mb-2 block">Due Date</label>
                <div className="flex items-center gap-2 text-sm text-black">
                    <Calendar size={14} className="text-gray-400" />
                    {task.dueDate}
                </div>
             </div>

             {/* Priority */}
             <div>
                <label className="text-[10px] text-gray-400 uppercase font-medium mb-2 block">Priority</label>
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    <Flag size={12} />
                    {task.priority}
                </div>
             </div>

             {/* Project */}
             <div>
                <label className="text-[10px] text-gray-400 uppercase font-medium mb-2 block">Project</label>
                <div className="text-sm text-black hover:text-blue-600 cursor-pointer transition-colors">
                    {task.project || 'None'}
                </div>
             </div>

             {/* Tags */}
             <div>
                <label className="text-[10px] text-gray-400 uppercase font-medium mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                    {task.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            <Tag size={10} /> {tag}
                        </span>
                    ))}
                </div>
             </div>
          </div>
          
          {/* Attachments Stub */}
          <div>
            <div className="flex justify-between items-center mb-3">
               <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Attachments</h3>
               <button className="text-[10px] text-gray-400 hover:text-black">
                  <Plus size={12} />
               </button>
            </div>
            <div className="p-3 border border-dashed border-gray-200 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center gap-1 text-gray-400">
                    <Paperclip size={14} />
                    <span className="text-[10px]">No files attached</span>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskDetails;