import { getPool } from "../../../config/db.js";
import * as taskService from "../services/task.service.js";
import {
  findLinksByTaskId,
  createTaskLink,
  updateTaskLink,
  deleteTaskLink,
} from "../repositories/task.repository.js";

async function createTask(req, res, next) {
  try {
    const payload = { ...req.body, reporterId: Number(req.user.id) };
    const data = await taskService.createTask(payload, req.user);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getTaskDetail(req, res, next) {
  try {
    const data = await taskService.getTaskDetail(Number(req.params.taskId));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const data = await taskService.updateTask(
      Number(req.params.taskId),
      req.body,
      req.user,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(Number(req.params.taskId), req.user);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

async function moveTask(req, res, next) {
  try {
    const data = await taskService.moveTask(
      Number(req.params.taskId),
      req.body,
      req.user,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function reorderTask(req, res, next) {
  try {
    const data = await taskService.reorderTask(
      Number(req.params.taskId),
      req.body,
      req.user,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// ====================== COMPLETE / UNCOMPLETE ======================
async function completeTask(req, res, next) {
  try {
    const { resolution, note } = req.body ?? {};
    const data = await taskService.completeTask(
      Number(req.params.taskId),
      req.user,
      { resolution, note },
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function uncompleteTask(req, res, next) {
  try {
    const data = await taskService.uncompleteTask(
      Number(req.params.taskId),
      req.user,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// ====================== ARCHIVE / UNARCHIVE ======================
async function archiveTask(req, res, next) {
  try {
    const data = await taskService.archiveTask(
      Number(req.params.taskId),
      req.user,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function unarchiveTask(req, res, next) {
  try {
    const data = await taskService.unarchiveTask(
      Number(req.params.taskId),
      req.user,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getTaskComments(req, res, next) {
  try {
    const data = await taskService.getTaskComments(Number(req.params.taskId));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function addTaskComment(req, res, next) {
  try {
    const data = await taskService.addTaskComment(
      Number(req.params.taskId),
      req.body,
      req.user,
    );
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getTaskActivities(req, res, next) {
  try {
    const data = await taskService.getTaskActivities(Number(req.params.taskId));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function updateTaskAssignee(req, res, next) {
  try {
    const data = await taskService.updateTaskAssignee(
      Number(req.params.taskId),
      Number(req.body.assigneeId),
      req.user,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function updateTaskDates(req, res, next) {
  try {
    const data = await taskService.updateTaskDates(
      Number(req.params.taskId),
      req.body,
      req.user,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function createSubTask(req, res, next) {
  try {
    const data = await taskService.createSubTask(
      Number(req.params.taskId),
      req.body,
      req.user,
    );
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getSubTasks(req, res, next) {
  try {
    const data = await taskService.getSubTasks(Number(req.params.taskId));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function addLabelToTask(req, res, next) {
  try {
    const data = await taskService.addLabelToTask(
      Number(req.params.taskId),
      Number(req.body.labelId),
      req.user,
    );
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function removeLabelFromTask(req, res, next) {
  try {
    await taskService.removeLabelFromTask(
      Number(req.params.taskId),
      Number(req.params.labelId),
      req.user,
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

// Lịch sử công việc
async function getCompletedTasks(req, res, next) {
  try {
    const data = await taskService.getCompletedTasks(
      Number(req.params.projectId),
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// ====================== LINKS ======================
async function getLinks(req, res, next) {
  try {
    const category = req.query.category ?? null;
    const data = await findLinksByTaskId(Number(req.params.taskId), category);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
async function addLink(req, res, next) {
  try {
    const { title, url, link_type } = req.body;
    if (!title?.trim() || !url?.trim())
      return res.status(400).json({ message: "Thiếu title hoặc url" });
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ message: "URL không hợp lệ" });
    }
    const createdBy = req.user?.full_name || req.user?.email || null;
    const data = await createTaskLink(
      Number(req.params.taskId),
      { title: title.trim(), url: url.trim(), link_type },
      createdBy,
    );
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function editLink(req, res, next) {
  try {
    const data = await updateTaskLink(
      Number(req.params.id),
      Number(req.params.taskId),
      req.body,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function removeLink(req, res, next) {
  try {
    await deleteTaskLink(Number(req.params.id), Number(req.params.taskId));
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
export {
  createTask,
  getTaskDetail,
  updateTask,
  deleteTask,
  moveTask,
  reorderTask,
  completeTask,
  uncompleteTask,
  archiveTask,
  unarchiveTask,
  getTaskComments,
  addTaskComment,
  getTaskActivities,
  updateTaskAssignee,
  updateTaskDates,
  createSubTask,
  getSubTasks,
  addLabelToTask,
  removeLabelFromTask,
  getCompletedTasks,
  getLinks,
  addLink,
  editLink,
  removeLink,
};
