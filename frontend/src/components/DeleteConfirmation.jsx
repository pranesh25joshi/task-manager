export default function DeleteConfirmation({ taskTitle, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="fixed inset-0 bg-text-main/40 backdrop-blur-sm transition-opacity"></div>
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-card-light text-left shadow-earthy transition-all sm:my-8 sm:w-full sm:max-w-lg border border-border-light animate-in zoom-in-95 fade-in duration-200">
          <div className="bg-card-light px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <span className="material-symbols-outlined text-red-700 text-[24px]">delete</span>
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-bold leading-6 text-text-main" id="modal-title">
                  Delete Task
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-text-muted">
                    Are you sure you want to remove <span className="font-semibold text-text-main">"{taskTitle}"</span>? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card-hover-light/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            <button
              onClick={onConfirm}
              className="inline-flex w-full justify-center rounded-xl bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 sm:w-auto transition-all active:scale-95"
              type="button"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="mt-3 inline-flex w-full justify-center rounded-xl bg-transparent px-3 py-2 text-sm font-semibold text-text-main shadow-sm ring-1 ring-inset ring-border-light hover:bg-border-light/30 sm:mt-0 sm:w-auto transition-all active:scale-95"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
