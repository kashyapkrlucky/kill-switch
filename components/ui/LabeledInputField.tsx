interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}
export default function LabeledInputField({ label, icon, ...props }: Props) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
      </label>}
      <input
        {...props}
        className="w-full px-4 py-2 border border-gray-500 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
    </div>
  );
}
