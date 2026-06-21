interface InfoCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconColor?: string;
  description?: string;
  accent?: "emerald" | "sky" | "violet" | "rose" | "amber";
}
export default function InfoCard({
  title,
  description,
  value,
  icon,
  iconColor = "bg-gray-500/20",
  accent = "emerald",
}: InfoCardProps) {
  const accentClasses = {
    emerald: "from-emerald-300/50",
    sky: "from-sky-300/50",
    violet: "from-violet-300/50",
    rose: "from-rose-300/50",
    amber: "from-amber-300/50",
  };

  return (
    <div className="hairline-panel group relative min-w-0 overflow-hidden rounded-xl p-4 transition-transform duration-200 hover:-translate-y-0.5">
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentClasses[accent]} via-white/20 to-transparent`}
      />
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
        <div className={`${iconColor} rounded-lg p-2.5 ring-1 ring-white/5`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
