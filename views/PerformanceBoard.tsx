
import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Calendar, Star, Users, CheckCircle, Target, TrendingUp, MoreHorizontal, User, Award, Trash2, Edit } from 'lucide-react';
import { MOCK_REVIEWS, MOCK_GOALS, MOCK_EMPLOYEES } from '../constants';
import { PerformanceReview, PerformanceGoal } from '../types';
import AddReviewModal from '../components/performance/AddReviewModal';
import AddGoalModal from '../components/performance/AddGoalModal';

const PerformanceBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'goals'>('reviews');
  const [reviews, setReviews] = useState<PerformanceReview[]>(MOCK_REVIEWS);
  const [goals, setGoals] = useState<PerformanceGoal[]>(MOCK_GOALS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Editing State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<PerformanceReview | undefined>(undefined);
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<PerformanceGoal | undefined>(undefined);

  // Row Action State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // --- Metrics ---
  const stats = useMemo(() => {
      const completedReviews = reviews.filter(r => r.status === 'Completed');
      const avgRating = completedReviews.length > 0 
          ? completedReviews.reduce((sum, r) => sum + r.rating, 0) / completedReviews.length 
          : 0;
      const goalsOnTrack = goals.filter(g => g.status === 'On Track').length;
      
      return {
          avgRating: avgRating.toFixed(1),
          reviewsCount: reviews.length,
          goalsOnTrack,
          totalGoals: goals.length
      };
  }, [reviews, goals]);

  // --- Filtering ---
  const filteredReviews = reviews.filter(r => 
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.reviewerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGoals = goals.filter(g => 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handlers: Reviews ---
  const handleSaveReview = (reviewData: Partial<PerformanceReview>) => {
      if (editingReview) {
          // Update
          const employee = MOCK_EMPLOYEES.find(e => e.id === reviewData.employeeId);
          setReviews(prev => prev.map(r => r.id === editingReview.id ? { 
              ...r, 
              ...reviewData,
              employeeName: employee?.name || r.employeeName,
              avatarUrl: employee?.avatarUrl || r.avatarUrl,
              role: employee?.role || r.role
          } as PerformanceReview : r));
          setEditingReview(undefined);
      } else {
          // Create
          const employee = MOCK_EMPLOYEES.find(e => e.id === reviewData.employeeId);
          if (!employee) return; // Should not happen with dropdown

          const newReview: PerformanceReview = {
              id: `rv-${Date.now()}`,
              employeeId: employee.id,
              employeeName: employee.name,
              avatarUrl: employee.avatarUrl,
              role: employee.role,
              reviewerName: reviewData.reviewerName || '',
              cycle: reviewData.cycle || 'Q4 2024',
              date: reviewData.date || new Date().toISOString().split('T')[0],
              rating: reviewData.rating || 0,
              status: reviewData.status || 'Scheduled',
              feedback: reviewData.feedback || ''
          };
          setReviews(prev => [newReview, ...prev]);
      }
  };

  const handleEditReviewClick = (review: PerformanceReview) => {
      setEditingReview(review);
      setIsReviewModalOpen(true);
      setActiveMenuId(null);
  };

  const handleDeleteReview = (id: string) => {
      if(confirm('Are you sure you want to delete this review?')) {
          setReviews(prev => prev.filter(r => r.id !== id));
      }
      setActiveMenuId(null);
  };

  // --- Handlers: Goals ---
  const handleSaveGoal = (goalData: Omit<PerformanceGoal, 'id' | 'employeeName' | 'avatarUrl'>) => {
      const employee = MOCK_EMPLOYEES.find(e => e.id === goalData.employeeId);
      
      if (editingGoal) {
          // Update
          setGoals(prev => prev.map(g => g.id === editingGoal.id ? {
              ...g,
              ...goalData,
              employeeName: employee?.name || g.employeeName,
              avatarUrl: employee?.avatarUrl || g.avatarUrl
          } : g));
          setEditingGoal(undefined);
      } else {
          // Create
          if (!employee) return;
          const newGoal: PerformanceGoal = {
              ...goalData,
              id: `gl-${Date.now()}`,
              employeeName: employee.name,
              avatarUrl: employee.avatarUrl
          };
          setGoals(prev => [newGoal, ...prev]);
      }
  };

  const handleEditGoalClick = (goal: PerformanceGoal) => {
      setEditingGoal(goal);
      setIsGoalModalOpen(true);
      setActiveMenuId(null);
  };

  const handleDeleteGoal = (id: string) => {
      if(confirm('Delete this goal?')) {
          setGoals(prev => prev.filter(g => g.id !== id));
      }
      setActiveMenuId(null);
  };

  // --- Helpers ---
  const getStatusColor = (status: string) => {
      switch (status) {
          case 'Completed': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
          case 'Scheduled': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
          case 'Draft': return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
          case 'On Track': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
          case 'At Risk': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
          case 'Behind': return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20';
          default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
      }
  };

  const openAddModal = () => {
      if (activeTab === 'reviews') {
          setEditingReview(undefined);
          setIsReviewModalOpen(true);
      } else {
          setEditingGoal(undefined);
          setIsGoalModalOpen(true);
      }
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in" onClick={() => setActiveMenuId(null)}>
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Performance Management</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Track employee growth, reviews, and objectives.</p>
            </div>
            
            {/* KPI Cards */}
            <div className="flex gap-4 overflow-x-auto pb-1">
                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <Star size={10} /> Avg. Team Rating
                    </span>
                    <div className="text-2xl font-light text-black dark:text-white mt-1 flex items-baseline gap-1">
                        {stats.avgRating} <span className="text-sm text-gray-400">/ 5.0</span>
                    </div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <CheckCircle size={10} /> Reviews (YTD)
                    </span>
                    <div className="text-2xl font-light text-blue-600 dark:text-blue-400 mt-1">{stats.reviewsCount}</div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <Target size={10} /> Goals On Track
                    </span>
                    <div className="text-2xl font-light text-green-600 dark:text-green-400 mt-1">{stats.goalsOnTrack}<span className="text-sm text-gray-400">/{stats.totalGoals}</span></div>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0">
            <div className="flex gap-2">
                <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${activeTab === 'reviews' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        <Users size={14} /> Reviews
                    </button>
                    <button 
                        onClick={() => setActiveTab('goals')}
                        className={`px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${activeTab === 'goals' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        <Target size={14} /> Goals & OKRs
                    </button>
                </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${activeTab}...`} 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                    />
                </div>
                <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm whitespace-nowrap"
                >
                    <Plus size={14} /> {activeTab === 'reviews' ? 'Schedule Review' : 'Add Goal'}
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                
                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-white/5 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800 backdrop-blur-sm">
                            <tr>
                                <th className="py-3 px-6 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Employee</th>
                                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Review Cycle</th>
                                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Date</th>
                                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Reviewer</th>
                                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Rating</th>
                                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Status</th>
                                <th className="py-3 px-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-gray-50 dark:divide-gray-800">
                            {filteredReviews.length > 0 ? filteredReviews.map(review => (
                                <tr key={review.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-6">
                                        <div className="flex items-center gap-3">
                                            <img src={review.avatarUrl} className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700" alt="" />
                                            <div>
                                                <div className="font-medium text-black dark:text-white">{review.employeeName}</div>
                                                <div className="text-[10px] text-gray-400">{review.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">{review.cycle}</td>
                                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono">{review.date}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] text-gray-500 dark:text-gray-400">
                                                <User size={10} />
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-300">{review.reviewerName}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {review.rating > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold text-black dark:text-white">{review.rating}</span>
                                                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                            </div>
                                        ) : (
                                            <span className="text-gray-300 dark:text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${getStatusColor(review.status)}`}>
                                            {review.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right relative">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === review.id ? null : review.id); }}
                                            className="text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <MoreHorizontal size={14} />
                                        </button>
                                        
                                        {activeMenuId === review.id && (
                                            <div className="absolute right-8 top-8 w-32 bg-white dark:bg-[#18181b] rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-20 py-1 flex flex-col animate-in fade-in zoom-in-95 origin-top-right">
                                                <button onClick={() => handleEditReviewClick(review)} className="text-left px-3 py-2 text-[10px] hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Edit size={12} /> Edit
                                                </button>
                                                <button onClick={() => handleDeleteReview(review.id)} className="text-left px-3 py-2 text-[10px] hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 text-red-600 dark:text-red-400">
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-400">No reviews found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {/* GOALS TAB */}
                {activeTab === 'goals' && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredGoals.map(goal => (
                            <div key={goal.id} className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-lg transition-all group relative">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === goal.id ? null : goal.id); }}
                                        className="text-gray-400 hover:text-black dark:hover:text-white"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                    
                                    {activeMenuId === goal.id && (
                                        <div className="absolute right-0 top-6 w-28 bg-white dark:bg-[#18181b] rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-20 py-1 flex flex-col animate-in fade-in zoom-in-95 origin-top-right">
                                            <button onClick={() => handleEditGoalClick(goal)} className="text-left px-3 py-2 text-[10px] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Edit size={12} /> Edit
                                            </button>
                                            <button onClick={() => handleDeleteGoal(goal.id)} className="text-left px-3 py-2 text-[10px] hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-2">
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-start mb-3 pr-6">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(goal.status)}`}>
                                        {goal.status}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${goal.priority === 'High' ? 'bg-red-500' : goal.priority === 'Medium' ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                                </div>
                                <h3 className="text-sm font-bold text-black dark:text-white mb-1">{goal.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-8">{goal.description}</p>
                                
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{goal.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-black dark:bg-white h-full rounded-full transition-all duration-500" style={{ width: `${goal.progress}%` }}></div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                                        <div className="flex items-center gap-2">
                                            <img src={goal.avatarUrl} className="w-5 h-5 rounded-full" />
                                            <span className="text-xs text-gray-600 dark:text-gray-300">{goal.employeeName}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-mono">{goal.dueDate}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>

    </div>

    <AddReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        onSave={handleSaveReview}
        employees={MOCK_EMPLOYEES}
        initialData={editingReview}
    />

    <AddGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
        employees={MOCK_EMPLOYEES}
        initialData={editingGoal}
    />
    </>
  );
};

export default PerformanceBoard;
