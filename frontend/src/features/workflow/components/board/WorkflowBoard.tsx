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
};

export default function WorkflowBoard({
  columns,
  onTaskClick,
  onMoveTask,
  onReorderTask,
}: Props) {
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    console.log("handleDragStart", event);
    const activeId = String(event.active.id);
    const task = taskMap.get(activeId) || null;
    setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    console.log("handleDragEnd", event);

    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      console.log("No drop target");
      return;
    }

    if (String(active.id) === String(over.id)) {
      console.log("Dropped on same item");
      return;
    }

    const activeTaskData = active.data.current?.task as BoardTask | undefined;
    console.log("active.data.current", active.data.current);
    console.log("over.data.current", over.data.current);

    if (!activeTaskData) return;

    const activeColumnId = Number(active.data.current?.columnId);
    const activeStatusId = Number(active.data.current?.statusId);

    if (!activeColumnId) return;

    const overType = over.data.current?.type as "column" | "task" | undefined;
    const overColumnId = Number(over.data.current?.columnId);
    const overStatusId = Number(over.data.current?.statusId);

    if (!overColumnId) return;

    if (overType === "column") {
      if (activeColumnId === overColumnId) {
        await onReorderTask(
          activeTaskData.id,
          activeStatusId,
          columns.find((c) => c.id === activeColumnId)?.tasks.length ?? 0,
        );
      } else {
        await onMoveTask(
          activeTaskData.id,
          overStatusId,
          overColumnId,
          columns.find((c) => c.id === overColumnId)?.tasks.length ?? 0,
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
      await onReorderTask(activeTaskData.id, overStatusId, safeIndex);
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
            onTaskClick={onTaskClick}
            onDragStart={() => {}}
            onDragEnter={() => {}}
            onDrop={() => {}}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="workflow-drag-overlay">
            <WorkflowTaskCard
              task={activeTask}
              columnId={0}
              statusId={activeTask.status_id}
              index={0}
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
