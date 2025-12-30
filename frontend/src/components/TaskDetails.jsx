export default function TaskDetails({ task, onClose, onEdit, onDelete }) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDelete();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-priority-high bg-priority-high/10';
      case 'medium': return 'text-priority-med bg-priority-med/10';
      case 'low': return 'text-priority-low bg-priority-low/10';
      default: return 'text-text-muted bg-background-light';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'remove';
      case 'low': return 'low_priority';
      default: return 'flag';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Unknown';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-text-main/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-card-light shadow-earthy transition-all border border-border-light max-h-[90vh] flex flex-col">

        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="px-6 md:px-8 py-4 border-b border-border-light flex items-center justify-between bg-background-light/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">
              Design
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              Updated {new Date(task.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-main p-2 rounded-lg hover:bg-black/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>


        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="flex-1">
                <div className="bg-card-light rounded-2xl p-6 md:p-8 shadow-earthy border border-border-light relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary/60"></div>

                  <h1 className="text-2xl md:text-3xl font-bold text-text-main mb-6 leading-tight pl-4">
                    {task.title}
                  </h1>

                  {task.description && (
                    <div className="prose prose-stone max-w-none pl-4">
                      <p className="text-text-muted leading-relaxed text-base md:text-lg">
                        {task.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-80 flex-shrink-0">
                <div className="bg-card-light rounded-2xl p-5 shadow-card border border-border-light sticky top-4">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">
                        Status
                      </label>
                      <div className="bg-background-light border border-border-light text-text-main rounded-xl py-2.5 px-4 text-sm font-medium">
                        {task.status === 'completed' ? 'Completed' : 'Pending'}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">
                        Priority
                      </label>
                      <div className="flex items-center gap-2 bg-background-light border border-border-light p-2 rounded-xl">
                        <div className={`w-8 h-8 rounded-lg ${getPriorityColor(task.priority)} flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-[18px] fill-1">
                            {getPriorityIcon(task.priority)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-text-main flex-1">
                          {getPriorityText(task.priority)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">
                        Due Date
                      </label>
                      <div className="flex items-center gap-2 text-sm text-text-main bg-background-light p-2.5 rounded-xl border border-border-light">
                        <span className="material-symbols-outlined text-[18px] text-text-muted">calendar_today</span>
                        <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {task.assignedTo && task.assignedTo.length > 0 && (
                      <div>
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">
                          Assigned To
                        </label>
                        <div className="bg-background-light border border-border-light rounded-xl p-2 space-y-2">
                          {task.assignedTo.map((user) => (
                            <div key={user._id} className="flex items-center gap-2 p-1.5 bg-white/50 rounded-lg">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-main truncate">{user.name}</p>
                                <p className="text-xs text-text-muted truncate">@{user.username}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  
                  <div className="pt-6 mt-6 border-t border-border-light">
                    <button
                      onClick={handleDelete}
                      className="w-full text-xs text-text-muted hover:text-red-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      Delete Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
