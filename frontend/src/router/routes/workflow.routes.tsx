import { Route } from "react-router-dom";
import WorkflowPage from "@modules/workflow/workflow/WorkflowPage";
import WorkflowHistoryPage from "@modules/workflow/workflowHistory/WorkflowhistoryPage";

const workflowRoutes = [
  <Route key="workflow"         path="workflow"                      element={<WorkflowPage />} />,
  <Route key="workflow-history" path="workflow/:projectId/history"   element={<WorkflowHistoryPage />} />,
];

export default workflowRoutes;
