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
    <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          {icon}
          {title}
        </h1>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>

      {actionButton && actionButton}
    </div>
  );
}
