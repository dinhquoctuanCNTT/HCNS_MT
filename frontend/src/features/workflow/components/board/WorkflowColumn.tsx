import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import WorkflowTaskCard from "./WorkflowTaskCard";
import { BoardColumn, BoardTask } from "../../hooks/useWorkflowBoard";

interface WorkflowColumnProps {
  column: BoardColumn;
  isDragOver: boolean;
  draggingTask: BoardTask | null;
  onTaskClick: (task: BoardTask) => void;
}

function SortableTaskCard({
  task,
  columnId,
  statusId,
  onClick,
}: {
  task: BoardTask;
  columnId: number;
  statusId: number;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(task.id),
    data: {
      type: "task",
      task,
      columnId,
      statusId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        isDragging
          ? "wf-card-sortable wf-card-sortable--dragging"
          : "wf-card-sortable"
      }
      {...attributes}
      {...listeners}
    >
      <WorkflowTaskCard task={task} onClick={onClick} isDragging={isDragging} />
    </div>
  );
}

export default function WorkflowColumn({
  column,
  onTaskClick,
}: WorkflowColumnProps) {
  const statusColor = column.status?.color ?? "#9CA3AF";

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: "column",
      columnId: column.id,
      statusId: column.status?.id,
    },
  });

  const taskIds = column.tasks.map((t) => String(t.id));

  return (
    <div className={`wf-column ${isOver ? "wf-column--drag-over" : ""}`}>
      <div className="wf-column__header">
        <div className="wf-column__header-left">
          <span
            className="wf-column__status-dot"
            style={{ background: statusColor }}
          />
          <span className="wf-column__name">{column.name.toUpperCase()}</span>
          <span className="wf-column__count">{column.tasks.length}</span>
        </div>

        <button type="button" className="wf-column__add-btn" title="Add task">
          +
        </button>
      </div>

      <div className="wf-column__tasks" ref={setNodeRef}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {column.tasks.length === 0 ? (
            <div
              className={`wf-column__empty ${isOver ? "wf-column__empty--active" : ""}`}
            >
              Drop task here
            </div>
          ) : (
            column.tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                columnId={column.id}
                statusId={column.status?.id}
                onClick={() => onTaskClick(task)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
