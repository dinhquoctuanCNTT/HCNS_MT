import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { BoardColumn, BoardTask } from "../../hooks/useWorkflowBoard";
import WorkflowColumn from "./WorkflowColumn";
import WorkflowTaskCard from "./WorkflowTaskCard";

type Props = {
  columns: BoardColumn[];
  onTaskClick: (task: BoardTask) => void;
  onMoveTask: (
    taskId: number,
    toStatusId: number,
    toColumnId: number,
    newPosition: number,
  ) => Promise<void>;
  onReorderTask: (
    taskId: number,
    statusId: number,
    newPosition: number,
  ) => Promise<void>;
  onAddTask?: (column: BoardColumn) => void;
};

export default function WorkflowBoard({
  columns,
  onTaskClick,
  onMoveTask,
  onReorderTask,
  onAddTask,
}: Props) {
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const taskMap = useMemo(() => {
    const allTasks = columns.flatMap((column) => column.tasks);
    return new Map(allTasks.map((task) => [String(task.id), task]));
  }, [columns]);

  const handleTaskClick = (task: BoardTask) => {
    setSelectedTaskId(task.id);

    const column = columns.find((col) =>
      col.tasks.some((t) => t.id === task.id),
    );

    setSelectedColumnId(column?.id ?? null);
    onTaskClick(task);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    const task = taskMap.get(activeId) || null;
    setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;
    if (String(active.id) === String(over.id)) return;

    const activeTaskData = active.data.current?.task as BoardTask | undefined;

    if (!activeTaskData) return;

    const activeColumnId = Number(active.data.current?.columnId);
    const activeStatusId = Number(active.data.current?.statusId);

    if (!activeColumnId || !activeStatusId) return;

    const overType = over.data.current?.type as "column" | "task" | undefined;

    const overColumnId = Number(over.data.current?.columnId);
    const overStatusId = Number(over.data.current?.statusId);

    if (!overColumnId || !overStatusId) return;

    if (overType === "column") {
      const targetTasks =
        columns.find((c) => c.id === overColumnId)?.tasks ?? [];
      if (activeColumnId === overColumnId) {
        await onReorderTask(
          activeTaskData.id,
          activeStatusId,
          targetTasks.length,
        );
      } else {
        await onMoveTask(
          activeTaskData.id,
          overStatusId,
          overColumnId,
          targetTasks.length,
        );
      }
      return;
    }

    const overTask = taskMap.get(String(over.id));
    if (!overTask) return;

    const targetColumn = columns.find((c) => c.id === overColumnId);

    if (!targetColumn) return;

    const overIndex = targetColumn.tasks.findIndex((t) => t.id === overTask.id);

    const safeIndex = overIndex >= 0 ? overIndex : targetColumn.tasks.length;

    if (activeColumnId === overColumnId) {
      // Reorder — nếu kéo xuống thì +1
      const activeIndex = targetColumn.tasks.findIndex(
        (t) => t.id === activeTaskData.id,
      );
      const insertIndex = activeIndex < overIndex ? overIndex : overIndex;
      await onReorderTask(activeTaskData.id, overStatusId, insertIndex);
    } else {
      await onMoveTask(
        activeTaskData.id,
        overStatusId,
        overColumnId,
        safeIndex,
      );
    }
  };

  if (!columns.length) {
    return (
      <div className="wf-empty-board">
        <button className="wf-empty-board__add">+</button>
        <p>No columns found. Create a board column to get started.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="wf-board">
        {columns.map((column) => (
          <WorkflowColumn
            key={column.id}
            column={column}
            isDragOver={false}
            draggingTask={activeTask}
            onTaskClick={handleTaskClick}
            selectedTaskId={selectedTaskId}
            isSelectedColumn={selectedColumnId === column.id}
            hasActiveSelection={selectedColumnId !== null}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="workflow-drag-overlay">
            <WorkflowTaskCard
              task={activeTask}
              onClick={() => {}}
              isDragging={true}
              isSelected={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
