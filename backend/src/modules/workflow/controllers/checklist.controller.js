import * as taskRepository from "../repositories/task.repository.js";

// GET /api/workflow/tasks/:taskId/checklists
export async function getChecklists(req, res) {
  try {
    const { taskId } = req.params;
    const data = await taskRepository.findChecklistsByTaskId(Number(taskId));
    res.json({ success: true, data });
  } catch (err) {
    console.error("getChecklists error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// POST /api/workflow/tasks/:taskId/checklists
export async function createChecklist(req, res) {
  try {
    const { taskId } = req.params;
    const { title, position } = req.body;
    if (!title?.trim())
      return res.status(400).json({ message: "Title là bắt buộc" });
    const data = await taskRepository.createChecklist(Number(taskId), {
      title: title.trim(),
      position,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("createChecklist error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// PUT /api/workflow/tasks/:taskId/checklists/:checklistId
export async function updateChecklist(req, res) {
  try {
    const { checklistId } = req.params;
    const { title, is_done } = req.body;
    const data = await taskRepository.updateChecklist(Number(checklistId), {
      title,
      is_done,
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error("updateChecklist error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// PATCH /api/workflow/tasks/:taskId/checklists/:checklistId/toggle
export async function toggleChecklist(req, res) {
  try {
    const { checklistId } = req.params;
    const { is_done } = req.body;
    const data = await taskRepository.toggleChecklist(
      Number(checklistId),
      is_done,
    );
    res.json({ success: true, data });
  } catch (err) {
    console.error("toggleChecklist error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// DELETE /api/workflow/tasks/:taskId/checklists/:checklistId
export async function deleteChecklist(req, res) {
  try {
    const { checklistId } = req.params;
    await taskRepository.deleteChecklist(Number(checklistId));
    res.json({ success: true });
  } catch (err) {
    console.error("deleteChecklist error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}
