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
    <div className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-medium">{title}</p>
          <p className="text-xl font-bold text-white mt-0.5">{value}</p>
          <p className="text-gray-500 text-xs mt-1">{description}</p>
        </div>
        <div className={`${iconColor} p-2 rounded-md`}>{icon}</div>
      </div>
    </div>
  );
}
