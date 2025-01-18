import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Clock, Trash2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onToggleSubTask: (todoId: string, subTaskId: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export default function TodoItem({ todo, onToggle, onToggleSubTask, onDelete, onEdit }: TodoItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateProgress = () => {
    if (todo.subTasks.length === 0) return todo.completed ? 100 : 0;
    const completedTasks = todo.subTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / todo.subTasks.length) * 100);
  };

  const progress = calculateProgress();

  useEffect(() => {
    if (progress === 100 && !showConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [progress]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all relative"
    >
      {showConfetti && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-emerald-500 mb-2">Félicitations ! 🎉</h3>
              <p className="text-gray-600 dark:text-gray-400">Tâche accomplie avec succès !</p>
            </div>
          </motion.div>
        </>
      )}

      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-6 h-6 mt-1 rounded-full border-2 flex items-center justify-center transition-colors
            ${todo.completed 
              ? 'bg-emerald-500 border-emerald-500' 
              : 'border-gray-300 dark:border-gray-600'}`}
        >
          {todo.completed && <Check size={14} className="text-white" />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-gray-800 dark:text-gray-200 ${
              todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
            }`}>
              {todo.text}
            </span>
            
            {/* Tags */}
            <div className="flex gap-1 flex-wrap">
              {todo.tags.map(tag => (
                <span 
                  key={tag.id}
                  style={{ backgroundColor: tag.color }}
                  className="px-2 py-0.5 text-xs rounded-full text-white"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* Due Date and Time */}
          {(todo.dueDate || todo.dueTime) && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Clock size={14} />
              {todo.dueDate && (
                <span>
                  {new Date(todo.dueDate).toLocaleDateString()}
                  {todo.dueTime && ` à ${todo.dueTime}`}
                </span>
              )}
            </div>
          )}

          {/* Description and SubTasks (Expandable) */}
          {(todo.description || todo.subTasks.length > 0) && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400"
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {expanded ? 'Moins de détails' : 'Plus de détails'}
              </button>

              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-2"
                >
                  {todo.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {todo.description}
                    </p>
                  )}

                  {todo.subTasks.length > 0 && (
                    <div className="space-y-2">
                      {todo.subTasks.map(subTask => (
                        <div
                          key={subTask.id}
                          className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg"
                        >
                          <button
                            onClick={() => onToggleSubTask(todo.id, subTask.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                              ${subTask.completed 
                                ? 'bg-emerald-500 border-emerald-500' 
                                : 'border-gray-300 dark:border-gray-600'}`}
                          >
                            {subTask.completed && <Check size={10} className="text-white" />}
                          </button>
                          <span className={`text-sm ${
                            subTask.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {subTask.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(todo)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400 transition-opacity"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-opacity"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar for SubTasks */}
      {todo.subTasks.length > 0 && (
        <div className="mt-2">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-emerald-500"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {progress}% complété
          </p>
        </div>
      )}
    </motion.div>
  );
}
