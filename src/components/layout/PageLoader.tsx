import { LoaderCircleIcon } from "lucide-react";

export default function PageLoader() {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-gray-900 flex items-center justify-center z-50">
            <LoaderCircleIcon className="h-12 w-12 animate-spin text-white"/>
        </div>
    );
}