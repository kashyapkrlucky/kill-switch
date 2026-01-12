import { LoaderCircleIcon } from "lucide-react";

export default function InlineLoader() {
  return (
    <div className="flex items-center justify-center">
      <LoaderCircleIcon className="h-12 w-12 animate-spin text-white"/>
    </div>
  );
}
