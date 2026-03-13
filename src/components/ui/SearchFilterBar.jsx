export function SearchFilterBar({ searchPlaceholder = 'Search...', searchValue, onSearchChange, filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <input
        type="search"
        placeholder={searchPlaceholder}
        value={searchValue || ''}
        onChange={(e) => onSearchChange?.(e.target.value)}
        className="input max-w-xs"
      />
      {filters?.map((f) => (
        <select
          key={f.id}
          value={f.value}
          onChange={(e) => onFilterChange?.(f.id, e.target.value)}
          className="input max-w-[180px]"
        >
          <option value="">{f.placeholder}</option>
          {f.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
