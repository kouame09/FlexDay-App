import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle2, ListTodo, Plus, X } from 'lucide-react';
import './index.css';
import { Todo, Tag, SubTask } from './types/Todo';
import TodoItem from './components/TodoItem';
import AddTodo from './components/AddTodo';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem('flexday-todos');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('flexday-todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  }, [todos]);

  const addTodo = useCallback((text: string, description: string, dueDate: string, dueTime: string, tags: Tag[], subTasks: SubTask[]) => {
    if (!text.trim()) {
      toast.error('Le titre de la tâche est requis');
      return;
    }

    try {
      if (editingTodo) {
        setTodos(todos.map(todo =>
          todo.id === editingTodo.id
            ? { ...todo, text, description, dueDate, dueTime, tags, subTasks }
            : todo
        ));
        setEditingTodo(null);
        toast.success('Tâche mise à jour !');
      } else {
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          text,
          description,
          dueDate,
          dueTime,
          tags,
          completed: false,
          createdAt: Date.now(),
          subTasks,
        };
        setTodos(prevTodos => [newTodo, ...prevTodos]);
        toast.success('Tâche ajoutée !');
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding/updating todo:', error);
      toast.error('Une erreur est survenue');
    }
  }, [editingTodo, todos]);

  const toggleTodo = useCallback((id: string) => {
    try {
      setTodos(prevTodos => prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  }, []);

  const toggleSubTask = useCallback((todoId: string, subTaskId: string) => {
    try {
      setTodos(prevTodos => prevTodos.map(todo =>
        todo.id === todoId ? {
          ...todo,
          subTasks: todo.subTasks.map(subTask =>
            subTask.id === subTaskId ? { ...subTask, completed: !subTask.completed } : subTask
          )
        } : todo
      ));
    } catch (error) {
      console.error('Error toggling subtask:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  }, []);

  const deleteTodo = useCallback((id: string) => {
    try {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      toast.success('Tâche supprimée !');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Erreur lors de la suppression');
    }
  }, []);

  const editTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      <Toaster position="bottom-center" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <ListTodo size={32} className="text-emerald-500" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              FlexDay
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Organisez votre journée avec style
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-6"
            >
              <div className="relative">
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingTodo(null);
                  }}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>

                <AddTodo onAdd={addTodo} initialTodo={editingTodo} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {todos.length > 0 ? (
            <motion.div layout className="space-y-3">
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onToggleSubTask={toggleSubTask}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Aucune tâche pour le moment
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-600 transition-colors"
      >
        <Plus size={24} />
      </motion.button>
    </div>
  );
}

export default App;
