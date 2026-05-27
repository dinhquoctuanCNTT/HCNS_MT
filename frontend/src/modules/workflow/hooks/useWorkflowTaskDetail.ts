import { useMemo } from "react";
import { WorkflowTask } from "../types/workflow.types";

export default function useWorkflowTaskDetail(task: WorkflowTask | null) {
  const hasComments = useMemo(() => {
    return !!task?.comments?.length;
  }, [task]);

  const hasActivities = useMemo(() => {
    return !!task?.activities?.length;
  }, [task]);
  const labelText = useMemo(() => {
    if (!task?.labels?.length) return "";
    return task.labels.join(",");
  }, [task]);
  return {
    task,
    hasComments,
    hasActivities,
    labelText,
  };
}
