import { PlusCircle, X, Calendar, Clock, Tag, ListTodo, AlignLeft, Plus } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag as TagType, SubTask, Todo } from '../types/Todo';
import ColorPicker from './ColorPicker';
import { toast } from 'react-hot-toast';

interface AddTodoProps {
  onAdd: (text: string, description: string, dueDate: string, dueTime: string, tags: TagType[], subTasks: SubTask[]) => void;
  initialTodo?: Todo | null;
}

export default function AddTodo({ onAdd, initialTodo }: AddTodoProps) {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#10b981');
  const [tags, setTags] = useState<TagType[]>([]);
  const [subTaskText, setSubTaskText] = useState('');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [activeSection, setActiveSection] = useState<'description' | 'datetime' | 'tags' | 'subtasks' | null>(null);

  useEffect(() => {
    if (initialTodo) {
      setText(initialTodo.text);
      setDescription(initialTodo.description || '');
      setDueDate(initialTodo.dueDate || '');
      setDueTime(initialTodo.dueTime || '');
      setTags(initialTodo.tags || []);
      setSubTasks(initialTodo.subTasks || []);
    }
  }, [initialTodo]);

  const resetForm = () => {
    setText('');
    setDescription('');
    setDueDate('');
    setDueTime('');
    setTags([]);
    setSubTasks([]);
    setActiveSection(null);
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error('Le titre de la tâche est requis');
      return;
    }

    try {
      onAdd(text.trim(), description, dueDate, dueTime, tags, subTasks);
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Une erreur est survenue');
    }
  }, [text, description, dueDate, dueTime, tags, subTasks, onAdd]);

  const handleAddTag = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!tagName.trim()) {
      toast.error('Le nom de l\'étiquette est requis');
      return;
    }

    if (tags.length >= 5) {
      toast.error('Maximum 5 étiquettes par tâche');
      return;
    }

    try {
      const newTag: TagType = {
        id: crypto.randomUUID(),
        name: tagName.trim(),
        color: tagColor
      };
      setTags(prevTags => [...prevTags, newTag]);
      setTagName('');
      setTagColor('#10b981');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Erreur lors de l\'ajout de l\'étiquette');
    }
  }, [tagName, tagColor, tags]);

  const handleKeyPressTag = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  const removeTag = useCallback((id: string) => {
    try {
      setTags(prevTags => prevTags.filter(tag => tag.id !== id));
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error('Erreur lors de la suppression de l\'étiquette');
    }
  }, []);

  const handleAddSubTask = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!subTaskText.trim()) {
      toast.error('Le texte de la sous-tâche est requis');
      return;
    }

    if (subTasks.length >= 10) {
      toast.error('Maximum 10 sous-tâches par tâche');
      return;
    }

    try {
      const newSubTask: SubTask = {
        id: crypto.randomUUID(),
        text: subTaskText.trim(),
        completed: false
      };
      setSubTasks(prevSubTasks => [...prevSubTasks, newSubTask]);
      setSubTaskText('');
    } catch (error) {
      console.error('Error adding subtask:', error);
      toast.error('Erreur lors de l\'ajout de la sous-tâche');
    }
  }, [subTaskText, subTasks]);

  const handleKeyPressSubTask = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubTask();
    }
  }, [handleAddSubTask]);

  const removeSubTask = useCallback((id: string) => {
    try {
      setSubTasks(prevSubTasks => prevSubTasks.filter(subTask => subTask.id !== id));
    } catch (error) {
      console.error('Error removing subtask:', error);
      toast.error('Erreur lors de la suppression de la sous-tâche');
    }
  }, []);

  const toggleSection = (section: 'description' | 'datetime' | 'tags' | 'subtasks') => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-4">
      {/* Main Input */}
      <div className="relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Quelle tâche souhaitez-vous ajouter ?"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500 text-lg font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => toggleSection('description')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            activeSection === 'description'
              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <AlignLeft size={16} />
          Description
        </button>
        <button
          type="button"
          onClick={() => toggleSection('datetime')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            activeSection === 'datetime'
              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Calendar size={16} />
          Échéance
        </button>
        <button
          type="button"
          onClick={() => toggleSection('tags')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            activeSection === 'tags'
              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Tag size={16} />
          Étiquettes {tags.length > 0 && `(${tags.length})`}
        </button>
        <button
          type="button"
          onClick={() => toggleSection('subtasks')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            activeSection === 'subtasks'
              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <ListTodo size={16} />
          Sous-tâches {subTasks.length > 0 && `(${subTasks.length})`}
        </button>
      </div>

      {/* Expandable Sections */}
      <AnimatePresence>
        {activeSection === 'description' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ajoutez plus de détails à votre tâche..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500 min-h-[100px] resize-none"
            />
          </motion.div>
        )}

        {activeSection === 'datetime' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date d'échéance
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Heure
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'tags' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag.id}
                  style={{ backgroundColor: tag.color }}
                  className="px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 group"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => removeTag(tag.id)}
                    className="opacity-0 group-hover:opacity-100 hover:text-gray-200 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <input
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                onKeyPress={handleKeyPressTag}
                placeholder="Nouvelle étiquette"
                className="flex-1 w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ColorPicker color={tagColor} onChange={setTagColor} />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors w-full sm:w-auto"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'subtasks' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            <div className="space-y-2">
              {subTasks.map(subTask => (
                <div
                  key={subTask.id}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg group"
                >
                  <span className="flex-1 text-gray-800 dark:text-gray-200">{subTask.text}</span>
                  <button
                    type="button"
                    onClick={() => removeSubTask(subTask.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={subTaskText}
                onChange={(e) => setSubTaskText(e.target.value)}
                onKeyPress={handleKeyPressSubTask}
                placeholder="Nouvelle sous-tâche"
                className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddSubTask}
                className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
      >
        Ajouter la tâche
      </button>
    </form>
  );
}
