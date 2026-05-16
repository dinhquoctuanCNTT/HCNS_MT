import * as taskRepository from "../repositories/task.repository.js";

// GET /api/workflow/tasks/:taskId/dependencies
export async function getDependencies(req, res) {
  try {
    const { taskId } = req.params;
    const data = await taskRepository.findDependenciesByTaskId(Number(taskId));
    res.json({ success: true, data });
  } catch (err) {
    console.error("getDependencies error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// POST /api/workflow/tasks/:taskId/dependencies
export async function addDependency(req, res) {
  try {
    const { taskId } = req.params;
    const { dependsOnId } = req.body;
    if (!dependsOnId)
      return res.status(400).json({ message: "dependsOnId là bắt buộc" });
    if (Number(taskId) === Number(dependsOnId)) {
      return res
        .status(400)
        .json({ message: "Task không thể phụ thuộc vào chính nó" });
    }
    const data = await taskRepository.addTaskDependency(
      Number(taskId),
      Number(dependsOnId),
    );
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err.message?.includes("UNIQUE") || err.number === 2627) {
      return res.status(409).json({ message: "Dependency đã tồn tại" });
    }
    console.error("addDependency error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// DELETE /api/workflow/tasks/:taskId/dependencies/:dependsOnId
export async function removeDependency(req, res) {
  try {
    const { taskId, dependsOnId } = req.params;
    await taskRepository.removeTaskDependency(
      Number(taskId),
      Number(dependsOnId),
    );
    res.json({ success: true });
  } catch (err) {
    console.error("removeDependency error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}
