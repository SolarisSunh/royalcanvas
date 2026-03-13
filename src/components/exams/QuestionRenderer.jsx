import { useState } from 'react';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '../../constants/questionTypes';

export function QuestionRenderer({ question, answer, onAnswerChange }) {
  const [localValue, setLocalValue] = useState(answer ?? '');

  const handleChange = (value) => {
    setLocalValue(value);
    onAnswerChange?.(value);
  };

  if (!question) return null;

  const q = question;
  const type = q.type;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">{QUESTION_TYPE_LABELS[q.type] || type}</p>
      <p className="text-lg font-medium text-slate-800">{q.stem}</p>

      {type === 'multiple_choice' && (
        <ul className="space-y-2">
          {(q.options || []).map((opt) => (
            <li key={opt}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={localValue === opt}
                  onChange={() => handleChange(opt)}
                  className="rounded-full border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span>{opt}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {type === 'true_false' && (
        <ul className="space-y-2">
          {(q.options || ['True', 'False']).map((opt) => (
            <li key={opt}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={localValue === opt}
                  onChange={() => handleChange(opt)}
                  className="rounded-full border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span>{opt}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {type === 'multi_select' && (
        <ul className="space-y-2">
          {(q.options || []).map((opt) => (
            <li key={opt}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={opt}
                  checked={(Array.isArray(localValue) ? localValue : []).includes(opt)}
                  onChange={(e) => {
                    const arr = Array.isArray(localValue) ? [...localValue] : [];
                    if (e.target.checked) arr.push(opt);
                    else arr.splice(arr.indexOf(opt), 1);
                    handleChange(arr);
                  }}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span>{opt}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {(type === 'short_text' || type === 'open_response') && (
        <input
          type="text"
          placeholder={q.placeholder}
          value={typeof localValue === 'string' ? localValue : ''}
          onChange={(e) => handleChange(e.target.value)}
          className="input"
        />
      )}

      {type === 'long_text' && (
        <textarea
          placeholder={q.placeholder}
          value={typeof localValue === 'string' ? localValue : ''}
          onChange={(e) => handleChange(e.target.value)}
          rows={5}
          className="input"
        />
      )}

      {type === 'fill_blank' && (
        <input
          type="text"
          placeholder="Your answer"
          value={typeof localValue === 'string' ? localValue : ''}
          onChange={(e) => handleChange(e.target.value)}
          className="input max-w-xs"
        />
      )}

      {type === 'matching' && (
        <div className="space-y-2 text-sm">
          {(q.leftItems || []).map((left, i) => (
            <div key={left} className="flex items-center gap-2">
              <span className="w-24">{left}</span>
              <span className="text-slate-400">→</span>
              <select
                value={(localValue && localValue[left]) || ''}
                onChange={(e) => handleChange({ ...(localValue || {}), [left]: e.target.value })}
                className="input flex-1 max-w-[200px]"
              >
                <option value="">Select...</option>
                {(q.rightItems || []).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {type === 'ordering' && (
        <ul className="space-y-2">
          {(q.items || []).map((item, i) => (
            <li key={item} className="flex items-center gap-2">
              <span className="text-slate-500 w-6">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
          <p className="text-xs text-slate-500">Ordering UI: drag-and-drop would go here (simulated).</p>
        </ul>
      )}

      {type === 'file_upload' && (
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center text-slate-500 text-sm">
          File upload placeholder. No files are actually uploaded.
        </div>
      )}
    </div>
  );
}
