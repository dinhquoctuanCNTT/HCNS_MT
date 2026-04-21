import * as taskRepository from "../repositories/task.repository.js";

// GET /api/workflow/tasks/:taskId/assignees
export async function getTaskAssignees(req, res) {
  try {
    const { taskId } = req.params;
    const data = await taskRepository.findAssigneesByTaskId(Number(taskId));
    res.json({ success: true, data });
  } catch (err) {
    console.error("getTaskAssignees error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// POST /api/workflow/tasks/:taskId/assignees
export async function addTaskAssignee(req, res) {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId là bắt buộc" });
    await taskRepository.addTaskAssignee(Number(taskId), Number(userId));
    const data = await taskRepository.findAssigneesByTaskId(Number(taskId));
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("addTaskAssignee error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// DELETE /api/workflow/tasks/:taskId/assignees/:userId
export async function removeTaskAssignee(req, res) {
  try {
    const { taskId, userId } = req.params;
    await taskRepository.removeTaskAssignee(Number(taskId), Number(userId));
    res.json({ success: true });
  } catch (err) {
    console.error("removeTaskAssignee error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}
