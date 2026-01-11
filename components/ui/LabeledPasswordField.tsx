import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function LabeledPasswordField({ label, error, ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">
        <div className="flex items-center gap-2">
          <LockIcon className="h-4 w-4 text-gray-300" />
          <span>{label}</span>
        </div>
      </label>}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          {...props}
          className={`w-full pl-4 pr-10 py-2 border text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
            error ? "border-red-500" : "border-gray-500"
          }`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5 text-gray-300 hover:text-gray-400" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-300 hover:text-gray-400" />
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
