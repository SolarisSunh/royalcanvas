export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
