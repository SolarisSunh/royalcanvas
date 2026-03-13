import { useState, useEffect } from 'react';

function pad(n) {
  return n < 10 ? `0${n}` : String(n);
}

export function ExamTimer({ durationMinutes, startedAt, onExpire }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const end = startedAt
      ? new Date(new Date(startedAt).getTime() + durationMinutes * 60 * 1000)
      : new Date(Date.now() + durationMinutes * 60 * 1000);
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setRemaining(diff);
      if (diff === 0) onExpire?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [durationMinutes, startedAt, onExpire]);

  if (remaining == null) return <span className="text-slate-500">--:--:--</span>;
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const isLow = remaining < 300;
  return (
    <span className={`font-mono font-semibold ${isLow ? 'text-red-600' : 'text-slate-800'}`}>
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
