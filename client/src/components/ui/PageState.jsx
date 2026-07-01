import { FaExclamationCircle, FaPlus, FaRedo, FaSpinner, FaTools } from 'react-icons/fa';

const PageState = ({
  variant = 'loading',
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
  count = 3,
}) => {
  if (variant === 'loading') {
    return (
      <div className="animate-fade-up rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <FaSpinner className="animate-spin" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-slate-200" />
            <div className="h-3 w-40 rounded-full bg-slate-100" />
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-[1.5rem] bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  const renderIcon = Icon ? <Icon className="text-cyan-600" /> : variant === 'error' ? <FaExclamationCircle className="text-rose-500" /> : <FaTools className="text-cyan-600" />;

  return (
    <div className="card-surface p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl shadow-inner">
        {renderIcon}
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary mx-auto mt-6 inline-flex items-center gap-2"
        >
          {variant === 'error' ? <FaRedo /> : <FaPlus />} {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default PageState;
