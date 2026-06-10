import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingSpinner({ message = 'Loading...', subMessage }: LoadingSpinnerProps) {
  return (
    <div id="loading-spinner-container" className="flex min-h-[250px] flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <div className="absolute h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
      </div>
      <p className="mt-4 text-base font-semibold text-slate-700">{message}</p>
      {subMessage && (
        <p className="mt-1.5 text-xs font-medium text-slate-400 max-w-sm">{subMessage}</p>
      )}
    </div>
  );
}
