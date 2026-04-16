type ProjectOption = {
  id: number;
  name: string;
  key?: string;
};

type Props = {
  projects: ProjectOption[];
  value?: number;
  onChange: (projectId: number) => void;
  disabled?: boolean;
};

export default function WorkflowProjectSwitcher({
  projects,
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <select
      className="workflow-select"
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value="" disabled>
        Chọn project
      </option>

      {projects.map((project) => (
        <option key={project.id} value={project.id}>
          {project.key ? `${project.key} - ${project.name}` : project.name}
        </option>
      ))}
    </select>
  );
}
