import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskDetails from './TaskDetails';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    loadTasks();
  }, [page, statusFilter, priorityFilter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (err) {
      alert('Failed to load tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      loadTasks();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ priority: newPriority })
      });
      if (!res.ok) throw new Error('Failed to update priority');
      loadTasks();
    } catch (err) {
      alert('Failed to update priority: ' + err.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setSelectedTask(null);
      loadTasks();
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-priority-high';
      case 'medium': return 'border-l-priority-med';
      case 'low': return 'border-l-priority-low';
      default: return 'border-l-border-light';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-priority-high/10 text-priority-high border-priority-high/20';
      case 'medium': return 'bg-priority-med/10 text-priority-med border-priority-med/20';
      case 'low': return 'bg-priority-low/10 text-priority-low border-priority-low/20';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'remove';
      case 'low': return 'low_priority';
      default: return 'remove';
    }
  };

  const getPriorityText = (priority) => {
    const text = priority.charAt(0).toUpperCase() + priority.slice(1);
    return text === 'Medium' ? 'Med' : text;
  };

  return (
    <div className="min-h-screen bg-background-light font-display flex flex-col overflow-hidden">
      <header className="h-14 sm:h-16 px-3 sm:px-6 md:px-8 border-b border-border-light flex items-center justify-between bg-card-light/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/20">
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">bolt</span>
            </div>
            <span className="font-bold text-lg sm:text-xl text-text-main">Terra</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => { setShowForm(true); setEditingTask(null); }}
            className="bg-primary hover:bg-primary-hover text-white px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold shadow-md shadow-primary/20 flex items-center gap-1 sm:gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">add</span>
            <span className="hidden sm:inline">New Task</span>
          </button>
          <div className="h-6 w-[px] bg-border-light mx-0.5 sm:mx-1 hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-text-muted">
            <span className="hidden md:inline">Welcome,</span>
            <span className="font-medium text-text-main truncate max-w-[100px]">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-text-muted hover:text-text-main p-1.5 sm:p-2 rounded-lg hover:bg-black/5 transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">logout</span>
          </button>
        </div>
      </header>
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#dcbca8]/20 rounded-full blur-[120px] mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#E3DDD1]/40 rounded-full blur-[100px] mix-blend-multiply"></div>
        </div>

        <div className="px-3 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-main">My Tasks</h1>
              <p className="text-xs sm:text-sm text-text-muted mt-1">{tasks.length} Total Tasks</p>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg border border-border-light px-2 sm:px-3 py-1">
                <span className="text-[10px] sm:text-xs font-medium text-text-muted">Page {page}/{totalPages}</span>
                <div className="w-[1px] h-4 bg-border-light mx-0.5 sm:mx-1"></div>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-text-muted transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">chevron_left</span>
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-text-muted transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-border-light text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:border-transparent text-text-main shadow-sm flex-shrink-0"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
              className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-border-light text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:border-transparent text-text-main shadow-sm flex-shrink-0"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="md:hidden h-full overflow-x-auto overflow-y-hidden px-3 pt-2 pb-4">
            <div className="flex gap-3 h-full" style={{minWidth: 'fit-content'}}>
              {['high', 'medium', 'low'].map(priority => {
                const priorityTasks = tasks.filter(t => t.priority === priority);
                
                return (
                  <div key={priority} className="flex flex-col bg-white/30 rounded-2xl border border-border-light overflow-hidden backdrop-blur-sm shadow-sm" style={{width: '280px', maxHeight: 'calc(100vh - 240px)'}}>
                    <div className="p-3 border-b border-border-light bg-card-light/40 flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-priority-${priority === 'medium' ? 'med' : priority} text-[18px]`}>
                          {getPriorityIcon(priority)}
                        </span>
                        <h3 className="font-bold text-text-main text-xs uppercase tracking-wide">
                          {getPriorityText(priority)}
                        </h3>
                        <span className={`${getPriorityBadge(priority)} text-xs font-bold px-2 py-0.5 rounded-full border`}>
                          {priorityTasks.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {priorityTasks.length === 0 ? (
                        <div className="text-center py-6 text-text-muted text-xs">No tasks</div>
                      ) : (
                        priorityTasks.map(task => (
                          <div
                            key={task._id}
                            onClick={() => setSelectedTask(task)}
                            className={`bg-card-light p-3 rounded-xl shadow-card hover:shadow-floating border-l-4 ${getPriorityColor(task.priority)} border-t border-r border-b border-border-light/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group flex flex-col gap-2`}
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded ${task.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                {task.status.toUpperCase()}
                              </span>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-sm text-text-main leading-snug mb-1 group-hover:text-primary transition-colors">
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-xs text-text-muted line-clamp-2">{task.description}</p>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-border-light mt-auto" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1 text-[10px] text-text-muted">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>{new Date(task.dueDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
                              </div>
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                className="px-1.5 py-0.5 text-[10px] border border-border-light rounded bg-white focus:ring-1 focus:ring-primary"
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Done</option>
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          <div className="hidden md:block h-full p-6 md:p-8 pt-4">
            <div className="grid grid-cols-3 gap-4 lg:gap-6 h-full">
              {['high', 'medium', 'low'].map(priority => {
                const priorityTasks = tasks.filter(t => t.priority === priority);
                
                return (
                  <div key={priority} className="flex flex-col h-full bg-white/30 rounded-2xl border border-border-light overflow-hidden backdrop-blur-sm shadow-sm">
                    <div className="p-4 border-b border-border-light bg-card-light/40 flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-priority-${priority === 'medium' ? 'med' : priority} text-[20px]`}>
                          {getPriorityIcon(priority)}
                        </span>
                        <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">
                          {getPriorityText(priority)} Priority
                        </h3>
                        <span className={`${getPriorityBadge(priority)} text-xs font-bold px-2 py-0.5 rounded-full border`}>
                          {priorityTasks.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{maxHeight: 'calc(100vh - 300px)'}}>
                      {priorityTasks.length === 0 ? (
                        <div className="text-center py-8 text-text-muted text-sm">No tasks</div>
                      ) : (
                        priorityTasks.map(task => (
                          <div
                            key={task._id}
                            onClick={() => setSelectedTask(task)}
                            className={`bg-card-light p-4 rounded-xl shadow-card hover:shadow-floating border-l-4 ${getPriorityColor(task.priority)} border-t border-r border-b border-border-light/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group flex flex-col gap-3`}
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-md ${task.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                {task.status.toUpperCase()}
                              </span>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-text-main leading-snug mb-1 group-hover:text-primary transition-colors">
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-xs text-text-muted line-clamp-2">{task.description}</p>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-border-light mt-auto" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-2 text-xs text-text-muted">
                                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex gap-1">
                                <select
                                  value={task.status}
                                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                  className="px-1.5 py-0.5 text-xs border border-border-light rounded bg-white focus:ring-1 focus:ring-primary"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="completed">Done</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-light/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-sm text-text-muted">Loading...</p>
            </div>
          </div>
        )}
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={() => { setShowForm(false); setEditingTask(null); }}
          onSave={() => { setShowForm(false); setEditingTask(null); loadTasks(); }}
        />
      )}

      {selectedTask && !showForm && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={() => { setEditingTask(selectedTask); setShowForm(true); setSelectedTask(null); }}
          onDelete={() => handleDelete(selectedTask._id)}
        />
      )}
    </div>
  );
}
