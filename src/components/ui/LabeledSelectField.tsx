interface SelectLabelIconProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
}

export default function LabeledSelectField({
  label,
  icon,
  options,
  ...props
}: SelectLabelIconProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-500 mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <span>{label}</span>
          </div>
        </label>
      )}
      <select
        {...props}
        className="w-full px-3 py-1 text-sm border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-300"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
