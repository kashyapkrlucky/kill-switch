interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}
export default function PageHeader({
  title,
  description,
  icon,
  actionButton,
}: PageHeaderProps) {
  return (
    <div className="glass-panel relative mb-6 overflow-hidden rounded-xl p-5 lg:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h1 className="mb-2 flex items-center gap-3 text-2xl font-semibold tracking-normal text-white">
          {icon && (
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-400/25 bg-emerald-500/12 shadow-inner shadow-emerald-950/40">
              {icon}
            </span>
          )}
          <span className="truncate">{title}</span>
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>

      {actionButton && actionButton}
      </div>
    </div>
  );
}
