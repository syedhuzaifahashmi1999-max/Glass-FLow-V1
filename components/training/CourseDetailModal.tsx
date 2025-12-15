
import React from 'react';
import { X, Clock, BookOpen, Layers, Edit, Trash2, User, CheckCircle, BarChart3, MoreHorizontal } from 'lucide-react';
import { TrainingCourse, TrainingModule } from '../../types';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: TrainingCourse | null;
  onEdit: (course: TrainingCourse) => void;
  onDelete: (id: string) => void;
  onAssign: (course: TrainingCourse) => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ isOpen, onClose, course, onEdit, onDelete, onAssign }) => {
  if (!isOpen || !course) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-[#18181b] shadow-2xl z-[101] transform transition-transform duration-300 ease-out border-l border-gray-100 dark:border-gray-800 flex flex-col">
        
        {/* Header with Cover */}
        <div className="relative h-48 bg-gradient-to-br from-gray-900 to-black shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md z-10">
                <X size={20} />
            </button>
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <BookOpen size={80} className="text-white" />
            </div>
            <div className="absolute bottom-6 left-8 right-8">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wide border border-white/10 mb-3 inline-block">
                    {course.category}
                </span>
                <h2 className="text-2xl font-bold text-white leading-tight">{course.title}</h2>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            
            {/* Action Bar */}
            <div className="flex gap-3 mb-8">
                <button 
                    onClick={() => onAssign(course)}
                    className="flex-1 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-black/5"
                >
                    Assign Training
                </button>
                <button onClick={() => onEdit(course)} className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-300">
                    <Edit size={18} />
                </button>
                <button onClick={() => onDelete(course.id)} className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors text-gray-600 dark:text-gray-300">
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="space-y-8">
                
                {/* Description */}
                <div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">About this Course</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {course.description}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                            <Clock size={14} /> <span className="text-xs uppercase font-medium">Duration</span>
                        </div>
                        <p className="text-lg font-semibold text-black dark:text-white">{course.duration}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                            <Layers size={14} /> <span className="text-xs uppercase font-medium">Modules</span>
                        </div>
                        <p className="text-lg font-semibold text-black dark:text-white">{course.modules?.length || 0}</p>
                    </div>
                </div>

                {/* Curriculum / Modules */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Curriculum</h3>
                        <span className="text-xs text-gray-500">{course.modules?.length || 0} Lessons</span>
                    </div>
                    <div className="space-y-3">
                        {course.modules && course.modules.length > 0 ? (
                            course.modules.map((module, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-3 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-black dark:text-white truncate">{module.title}</h4>
                                        <p className="text-[10px] text-gray-500">{module.type} • {module.duration}</p>
                                    </div>
                                    {module.type === 'Video' ? <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><CheckCircle size={14} /></div> : null}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                                No modules defined.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailModal;
