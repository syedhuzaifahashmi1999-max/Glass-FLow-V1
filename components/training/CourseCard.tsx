
import React from 'react';
import { Clock, BookOpen, MoreHorizontal, PlayCircle, Edit, Trash2 } from 'lucide-react';
import { TrainingCourse } from '../../types';

interface CourseCardProps {
  course: TrainingCourse;
  onClick: () => void;
  onEdit?: (course: TrainingCourse) => void;
  onDelete?: (id: string) => void;
  onAssign?: (course: TrainingCourse) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, onEdit, onDelete, onAssign }) => {
  return (
    <div 
        onClick={onClick}
        className="group relative bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer flex flex-col overflow-hidden h-[280px]"
    >
        {/* Thumbnail Area */}
        <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600">
                <BookOpen size={40} strokeWidth={1} />
            </div>
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(course); }}
                        className="p-1.5 bg-white dark:bg-black/50 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-black/70 rounded-md backdrop-blur-sm"
                    >
                        <Edit size={14} />
                    </button>
                )}
                {onDelete && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(course.id); }}
                        className="p-1.5 bg-white dark:bg-black/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md backdrop-blur-sm"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
            <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-white/90 dark:bg-black/50 backdrop-blur-sm text-[10px] font-medium rounded border border-white/20 dark:border-white/10 text-black dark:text-white">
                {course.category}
            </span>
        </div>

        <div className="p-5 flex flex-col flex-1">
            <h3 className="text-sm font-bold text-black dark:text-white mb-2 line-clamp-2">{course.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">{course.description}</p>
            
            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {course.modulesCount} Modules</span>
                </div>
                {onAssign && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onAssign(course); }}
                        className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-medium hover:opacity-80 transition-opacity"
                    >
                        Assign
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default CourseCard;
