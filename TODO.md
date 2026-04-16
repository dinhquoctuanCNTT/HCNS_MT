# TODO: Fix Red Underline Errors in WorkflowModule.tsx

- [x] 1. Fix hook typo in useWorkflowIssueDetail.ts and update return types
- [x] 2. Update destructuring in WorkflowModule.tsx to match hook returns (tasks->allTasks, boardLoading->loading, etc.)
- [ ] 3. Add proper TypeScript interfaces to hooks (useWorkflowBoard, useWorkflowMeta, useWorkflowIssueDetail)
- [ ] 4. Fix WorkflowTaskModal props to handle object arrays for members/priorities/issueTypes
- [ ] 5. Create missing components if needed (WorkflowHeader, WorkflowBoardHeader, etc.)
- [ ] 6. Run lint/fix and test frontend dev server
