interface WorkflowFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  members: any[];
  priorities: any[];
  filterMember: number | null;
  filterPriority: number | null;
  onFilterMember: (id: number | null) => void;
  onFilterPriority: (id: number | null) => void;
  // FIX: thêm onClearFilters để clear cả server filter lẫn client search
  onClearFilters?: () => void;
}

export default function WorkflowFilters({
  search,
  onSearchChange,
  members,
  priorities,
  filterMember,
  filterPriority,
  onFilterMember,
  onFilterPriority,
  onClearFilters,
}: WorkflowFiltersProps) {
  const hasActiveFilter = !!filterMember || !!filterPriority;

  const clearAll = () => {
    onFilterMember(null);
    onFilterPriority(null);
    onClearFilters?.();
  };

  return (
    <div className="wf-filters">
      <div className="wf-filters__search-wrap">
        <svg
          className="wf-filters__search-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle
            cx="6.5"
            cy="6.5"
            r="4.5"
            stroke="#9CA3AF"
            strokeWidth="1.5"
          />
          <path
            d="M10.5 10.5L14 14"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          className="wf-filters__search"
          type="text"
          placeholder="Search issues..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            className="wf-filters__clear-search"
            onClick={() => onSearchChange("")}
          >
            ×
          </button>
        )}
      </div>

      <div className="wf-filters__selects">
        <select
          className="wf-filters__select"
          value={filterMember ?? ""}
          onChange={(e) =>
            onFilterMember(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">All Assignees</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name ?? m.name}
            </option>
          ))}
        </select>

        <select
          className="wf-filters__select"
          value={filterPriority ?? ""}
          onChange={(e) =>
            onFilterPriority(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">All Priorities</option>
          {priorities.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {hasActiveFilter && (
          <button className="wf-filters__clear-btn" onClick={clearAll}>
            Clear filters
          </button>
        )}
      </div>

      <div className="wf-filters__right">
        <span className="wf-filters__label">Group by: Status</span>
      </div>
    </div>
  );
}
