import { useEffect, useRef, useState } from "react";
import { workflowApi } from "../api/workflow.api";

type MetaErrors = {
  project?: string;
  members?: string;
  labels?: string;
  statuses?: string;
  priorities?: string;
  issueTypes?: string;
};

type WorkflowMetaState = {
  project: any;
  members: any[];
  labels: any[];
  statuses: any[];
  priorities: any[];
  issueTypes: any[];
};

// Cache cho global data (priorities, issueTypes) — không đổi theo projectId
// Không cần refetch mỗi lần đổi project
const globalCache: {
  priorities?: any[];
  issueTypes?: any[];
} = {};

const EMPTY_META: WorkflowMetaState = {
  project: null,
  members: [],
  labels: [],
  statuses: [],
  priorities: [],
  issueTypes: [],
};

export default function useWorkflowMeta(projectId?: number) {
  const [meta, setMeta] = useState<WorkflowMetaState>(EMPTY_META);
  const [loading, setLoading] = useState(false);
  // BUG FIX: tách errors riêng từng field thay vì 1 string chung
  // → UI biết chính xác cái nào lỗi, không bị reset toàn bộ khi 1 API fail
  const [errors, setErrors] = useState<MetaErrors>({});

  // Dùng ref để cancel fetch cũ nếu projectId đổi trước khi fetch xong
  const abortRef = useRef(false);

  useEffect(() => {
    if (!projectId) {
      setMeta(EMPTY_META);
      setErrors({});
      return;
    }

    abortRef.current = false;

    const fetchMeta = async () => {
      setLoading(true);
      setErrors({});

      // FIX: Dùng allSettled thay vì all
      // → 1 API lỗi không làm crash toàn bộ, các field khác vẫn hiển thị
      const [
        projectResult,
        membersResult,
        labelsResult,
        statusesResult,
        prioritiesResult,
        taskTypesResult,
      ] = await Promise.allSettled([
        workflowApi.getProjectDetail(projectId),
        workflowApi.getMembers(projectId),
        workflowApi.getLabels(projectId),
        workflowApi.getStatuses(projectId),

        // FIX: Dùng cache cho global data — priorities không thay đổi theo project
        globalCache.priorities
          ? Promise.resolve({ data: { data: globalCache.priorities } })
          : workflowApi.getPriorities(projectId),

        // FIX: Tương tự cho issueTypes
        globalCache.issueTypes
          ? Promise.resolve({ data: { data: globalCache.issueTypes } })
          : workflowApi.getTaskTypes(projectId),
      ]);

      if (abortRef.current) return;

      const newErrors: MetaErrors = {};

      const extract = (
        result: PromiseSettledResult<any>,
        key: keyof MetaErrors,
      ) => {
        if (result.status === "fulfilled") {
          return result.value?.data?.data ?? result.value?.data ?? null;
        }
        newErrors[key] =
          result.reason?.response?.data?.message || `Không lấy được ${key}`;
        return null;
      };

      const project = extract(projectResult, "project");
      const members = extract(membersResult, "members");
      const labels = extract(labelsResult, "labels");
      const statuses = extract(statusesResult, "statuses");
      let priorities = extract(prioritiesResult, "priorities");
      let issueTypes = extract(taskTypesResult, "issueTypes");

      // Ghi cache nếu fetch thành công
      if (priorities && prioritiesResult.status === "fulfilled") {
        globalCache.priorities = priorities;
      } else if (!priorities && globalCache.priorities) {
        // Fallback về cache cũ nếu lần này lỗi
        priorities = globalCache.priorities;
        delete newErrors.priorities;
      }

      if (issueTypes && taskTypesResult.status === "fulfilled") {
        globalCache.issueTypes = issueTypes;
      } else if (!issueTypes && globalCache.issueTypes) {
        issueTypes = globalCache.issueTypes;
        delete newErrors.issueTypes;
      }

      setErrors(newErrors);

      // FIX: Chỉ update field thành công, giữ nguyên field cũ nếu lỗi
      // → Không reset toàn bộ về [] khi 1 trong 6 API fail
      setMeta((prev) => ({
        project: project ?? prev.project,
        members: Array.isArray(members) ? members : prev.members,
        labels: Array.isArray(labels) ? labels : prev.labels,
        statuses: Array.isArray(statuses) ? statuses : prev.statuses,
        priorities: Array.isArray(priorities) ? priorities : prev.priorities,
        issueTypes: Array.isArray(issueTypes) ? issueTypes : prev.issueTypes,
      }));

      setLoading(false);
    };

    fetchMeta();

    return () => {
      // Cancel nếu component unmount hoặc projectId đổi trước khi xong
      abortRef.current = true;
    };
  }, [projectId]);

  // Convenience: có lỗi nào không
  const hasError = Object.keys(errors).length > 0;

  return {
    ...meta,
    loading,
    errors,
    hasError,
  };
}
