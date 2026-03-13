const variants = {
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export function WarningBanner({ variant = 'warning', title, message, icon }) {
  const style = variants[variant] || variants.warning;
  return (
    <div className={`rounded-lg border p-4 ${style}`}>
      <div className="flex items-start gap-3">
        {icon && <span className="text-lg">{icon}</span>}
        <div>
          {title && <p className="font-medium">{title}</p>}
          {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
        </div>
      </div>
    </div>
  );
}
