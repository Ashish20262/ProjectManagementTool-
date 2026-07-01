import { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const formatDate = (value) => {
  if (!value) return 'TBD';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const TaskDetailsModal = ({ open, task, onClose }) => {
  const [visible, setVisible] = useState(false);
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement;
    // small delay to trigger CSS transition
    requestAnimationFrame(() => setVisible(true));

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab') {
        // focus trap
        const focusable = modalRef.current?.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // focus close button for accessibility
    setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      setVisible(false);
      // restore focus
      try { previouslyFocused.current?.focus(); } catch (e) {}
    };
  }, [open, onClose]);

  if (!open || !task) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-6 transition-colors duration-300 ${visible ? 'bg-slate-900/70' : 'bg-transparent'}`}
      aria-hidden={!open}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        aria-describedby="task-details-description"
        className={`modal-surface w-full max-w-3xl max-h-[90vh] overflow-auto ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Task details</p>
            <h2 id="task-details-title" className="mt-3 text-3xl font-semibold text-slate-900">{task.title}</h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <FaTimes className="mr-2" /> Close
          </button>
        </div>

        <div id="task-details-description" className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-500">Description</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{task.description || 'No description provided.'}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Project</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{task.project?.title || 'Unknown project'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Assigned member</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{task.assignedTo?.name || 'Unassigned'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Priority</p>
                <p className="mt-2 badge badge-danger inline-flex text-sm font-semibold">{task.priority}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-2 badge badge-info inline-flex text-sm font-semibold">{task.status}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Due date</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatDate(task.dueDate)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Created date</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatDate(task.createdAt)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Updated date</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatDate(task.updatedAt)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-xl">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Quick details</p>
                <p className="mt-2 text-lg font-semibold">{task.title}</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Project</p>
                <p className="mt-2 text-lg font-semibold text-white">{task.project?.title || 'Unknown'}</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Member</p>
                <p className="mt-2 text-lg font-semibold text-white">{task.assignedTo?.name || 'Unassigned'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
