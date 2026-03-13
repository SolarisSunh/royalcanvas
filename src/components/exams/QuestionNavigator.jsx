export function QuestionNavigator({ total, current, answers = {}, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((num) => {
        const isCurrent = current === num;
        const hasAnswer = answers[num] !== undefined && answers[num] !== '' && (Array.isArray(answers[num]) ? answers[num].length > 0 : true);
        return (
          <button
            key={num}
            type="button"
            onClick={() => onSelect?.(num)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              isCurrent
                ? 'bg-primary-600 text-white'
                : hasAnswer
                  ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}
