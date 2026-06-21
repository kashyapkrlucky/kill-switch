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
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-800/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h1 className="mb-1 flex items-center gap-3 text-2xl font-semibold tracking-normal text-white">
          {icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10">
              {icon}
            </span>
          )}
          <span className="truncate">{title}</span>
        </h1>
        <p className="max-w-3xl text-sm text-slate-400">{description}</p>
      </div>

      {actionButton && actionButton}
    </div>
  );
}
