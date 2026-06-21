interface InfoCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconColor?: string;
  description?: string;
}
export default function InfoCard({
  title,
  description,
  value,
  icon,
  iconColor = "bg-gray-500/20",
}: InfoCardProps) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {value.toLocaleString()}
          </p>
          {description && (
            <p className="mt-2 text-xs leading-5 text-slate-400">
              {description}
            </p>
          )}
        </div>
        <div className={`${iconColor} rounded-md p-2.5`}>{icon}</div>
      </div>
    </div>
  );
}
