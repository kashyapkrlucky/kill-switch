export const ToggleSwitch = ({
  isOn,
  onToggle,
  disabled = false,
}: {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
      isOn ? "bg-emerald-500" : "bg-gray-600"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
        isOn ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);
