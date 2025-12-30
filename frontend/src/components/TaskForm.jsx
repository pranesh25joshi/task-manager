import { useState, useEffect } from 'react';

export default function TaskForm({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo?.map(u => u._id || u) || []
      });
    }
  }, [task]);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const allUsers = await res.json();
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const toggleUser = (userId) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: (prev.assignedTo || []).includes(userId)
        ? (prev.assignedTo || []).filter(id => id !== userId)
        : [...(prev.assignedTo || []), userId]
    }));
  };

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo?.map(u => u._id || u) || []
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.dueDate) {
      setError('Due date is required');
      return;
    }

    try {
      setLoading(true);
      if (task) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${task._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Failed to update task');
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Failed to create task');
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-text-main/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>


      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-card-light shadow-earthy transition-all border border-white/20 max-h-[90vh] flex flex-col">
        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>


        <div className="px-6 py-5 border-b border-border-light flex items-center justify-between relative shrink-0">
          <h2 className="text-xl font-bold text-text-main">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>


        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-6 py-6 space-y-5 overflow-y-auto flex-1">{error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}


            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-main" htmlFor="task-title">
                Task Title
              </label>
              <input
                id="task-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="block w-full rounded-xl border-border-light bg-white/50 text-text-main shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 placeholder:text-text-muted/60"
                placeholder="e.g. Redesign homepage hero"
                disabled={loading}
              />
            </div>


            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-main" htmlFor="task-desc">
                Description
              </label>
              <textarea
                id="task-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full rounded-xl border-border-light bg-white/50 text-text-main shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 placeholder:text-text-muted/60 resize-none"
                placeholder="Add details about the task..."
                rows="3"
                disabled={loading}
              ></textarea>
            </div>


            <div className="grid grid-cols-2 gap-5">

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-text-main" htmlFor="task-date">
                  Due Date
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  </span>
                  <input
                    id="task-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="block w-full rounded-xl border-border-light bg-white/50 text-text-main shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 pl-10 px-4 placeholder:text-text-muted/60"
                    disabled={loading}
                  />
                </div>
              </div>


              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-text-main">
                  Priority Level
                </label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="block w-full rounded-xl border-border-light bg-white/50 text-text-main shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3 appearance-none"
                    disabled={loading}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </div>
                </div>
              </div>
            </div>


            {task && (
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-text-main">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="block w-full rounded-xl border-border-light bg-white/50 text-text-main shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 appearance-none"
                    disabled={loading}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </div>
                </div>
              </div>
            )}


            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-main">
                Assign To
              </label>
              <div className="bg-background-light/50 border border-border-light rounded-xl p-3 max-h-48 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-2">Loading users...</p>
                ) : (
                  <div className="space-y-2">
                    {users.map(user => (
                      <label
                        key={user._id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={(formData.assignedTo || []).includes(user._id)}
                          onChange={() => toggleUser(user._id)}
                          className="w-4 h-4 text-primary border-border-light rounded focus:ring-primary focus:ring-2"
                          disabled={loading}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-main truncate">{user.name}</p>
                          <p className="text-xs text-text-muted truncate">@{user.username}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {formData.assignedTo && formData.assignedTo.length > 0 && (
                <p className="text-xs text-text-muted mt-1">
                  {formData.assignedTo.length} user{formData.assignedTo.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>


          <div className="px-6 py-4 bg-background-light/50 border-t border-border-light flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-text-main hover:bg-black/5 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
