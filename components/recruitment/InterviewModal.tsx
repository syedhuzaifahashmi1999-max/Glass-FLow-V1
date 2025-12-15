
import React, { useState } from 'react';
import { X, Calendar, User, MessageSquare, Star, Clock, CheckCircle } from 'lucide-react';
import { Interview, Candidate } from '../../types';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  onSave: (interview: Interview) => void;
}

const InterviewModal: React.FC<InterviewModalProps> = ({ isOpen, onClose, candidate, onSave }) => {
  const [type, setType] = useState<Interview['type']>('Technical');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16)); // datetime-local format
  const [interviewer, setInterviewer] = useState('Alex Doe');
  const [status, setStatus] = useState<Interview['status']>('Scheduled');
  const [score, setScore] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `INT-${Date.now()}`,
      type,
      date: new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      interviewer,
      status,
      score,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Manage Interview</h3>
            <p className="text-xs text-gray-500">For {candidate.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1.5">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
                <option>Screening</option>
                <option>Technical</option>
                <option>Cultural</option>
                <option>Final</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
                <option>Scheduled</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1.5">Date & Time</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="datetime-local" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1.5">Interviewer</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={interviewer} 
                onChange={(e) => setInterviewer(e.target.value)} 
                className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {status === 'Completed' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1.5">Score (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScore(s)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${score === s ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{s}</span> <Star size={12} className={score === s ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1.5">Feedback / Notes</label>
            <div className="relative">
              <MessageSquare size={14} className="absolute left-3 top-3 text-gray-400" />
              <textarea 
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key observations..."
                className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg shadow-lg shadow-black/10 transition-colors flex items-center gap-2">
              <CheckCircle size={14} /> Save Record
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default InterviewModal;
