type Props = {
  search?: string;
  onSearchChange: (value: string) => void;
};

export default function WorkflowBulkToolbar({
  search = "",
  onSearchChange,
}: Props) {
  return (
    <div className="workflow-toolbar">
      <div className="workflow-toolbar__left">
        <input
          className="workflow-toolbar__search"
          type="text"
          placeholder="Search issues"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="workflow-toolbar__right">
        <button type="button" className="workflow-btn">
          Filter
        </button>
        <button type="button" className="workflow-btn">
          Group by: Status
        </button>
      </div>
    </div>
  );
}
