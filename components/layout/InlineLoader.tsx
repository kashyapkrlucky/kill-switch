import { LoaderCircleIcon } from "lucide-react";

export default function InlineLoader() {
  return (
    <div className="flex items-center justify-center" style={{ height: "48px" }}>
      <LoaderCircleIcon className="h-6 w-6 animate-spin text-white"/>
    </div>
  );
}
