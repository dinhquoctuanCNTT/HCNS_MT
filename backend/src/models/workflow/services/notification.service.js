import { createNotification } from "../repositories/notification.repository.js";
import {
  sendTaskAssignedEmail,
  sendTaskCommentEmail,
  sendTaskCompletedEmail,
  sendOverdueEmail,
} from "../../../services/mail.service.js";
import { getPool, sql } from "../../../config/db.js";

async function getUserInfo(userId) {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input("userId", sql.BigInt, userId)
      .query(`SELECT full_name, email FROM users WHERE id = @userId`);
    return result.recordset[0] || null;
  } catch {
    return null;
  }
}

export async function notifyTaskAssigned({
  assigneeId,
  reporterName,
  taskKey,
  taskTitle,
  taskId,
  dueDate = null,
}) {
  if (!assigneeId) return;
  try {
    await createNotification({
      userId: assigneeId,
      type: "task_assigned",
      title: "Bạn được giao việc mới",
      message: `${reporterName} đã giao task [${taskKey}] "${taskTitle}" cho bạn`,
      taskId,
    });
    const user = await getUserInfo(assigneeId);
    if (user?.email) {
      await sendTaskAssignedEmail({
        to: user.email,
        assigneeName: user.full_name,
        reporterName,
        taskTitle,
        taskKey,
        dueDate,
      });
    }
  } catch (err) {
    console.error("notifyTaskAssigned error:", err.message);
  }
}

export async function notifyTaskUpdated({
  assigneeId,
  reporterId,
  updaterName,
  taskKey,
  taskTitle,
  taskId,
  fieldName,
}) {
  const targets = new Set();
  if (assigneeId) targets.add(Number(assigneeId));
  if (reporterId) targets.add(Number(reporterId));
  for (const userId of targets) {
    try {
      await createNotification({
        userId,
        type: "task_updated",
        title: "Task được cập nhật",
        message: `${updaterName} đã cập nhật ${fieldName ?? "thông tin"} của task [${taskKey}] "${taskTitle}"`,
        taskId,
      });
    } catch (err) {
      console.error("notifyTaskUpdated error:", err.message);
    }
  }
}

export async function notifyTaskComment({
  assigneeId,
  reporterId,
  commenterId,
  commenterName,
  taskKey,
  taskTitle,
  taskId,
  comment = "",
}) {
  const targets = new Set();
  if (assigneeId) targets.add(Number(assigneeId));
  if (reporterId) targets.add(Number(reporterId));
  targets.delete(Number(commenterId));
  for (const userId of targets) {
    try {
      await createNotification({
        userId,
        type: "task_comment",
        title: "Bình luận mới",
        message: `${commenterName} đã bình luận trong task [${taskKey}] "${taskTitle}"`,
        taskId,
      });
      const user = await getUserInfo(userId);
      if (user?.email) {
        await sendTaskCommentEmail({
          to: user.email,
          userName: user.full_name,
          commenterName,
          taskTitle,
          taskKey,
          comment,
        });
      }
    } catch (err) {
      console.error("notifyTaskComment error:", err.message);
    }
  }
}

export async function notifyTaskCompleted({
  reporterId,
  completedByName,
  taskKey,
  taskTitle,
  taskId,
}) {
  if (!reporterId) return;
  try {
    await createNotification({
      userId: reporterId,
      type: "task_completed",
      title: "Task hoàn thành",
      message: `${completedByName} đã hoàn thành task [${taskKey}] "${taskTitle}"`,
      taskId,
    });
    const user = await getUserInfo(reporterId);
    if (user?.email) {
      await sendTaskCompletedEmail({
        to: user.email,
        reporterName: user.full_name,
        completedByName,
        taskTitle,
        taskKey,
      });
    }
  } catch (err) {
    console.error("notifyTaskCompleted error:", err.message);
  }
}

export async function notifyTaskOverdue({
  assigneeId,
  reporterId,
  taskKey,
  taskTitle,
  taskId,
  dueDate,
  roleText = "của bạn",
}) {
  const targets = new Set();
  if (assigneeId) targets.add(Number(assigneeId));
  if (reporterId) targets.add(Number(reporterId));
  for (const userId of targets) {
    try {
      await createNotification({
        userId,
        type: "task_overdue",
        title: "Task quá hạn",
        message: `Task [${taskKey}] "${taskTitle}" đã quá hạn`,
        taskId,
      });
      const user = await getUserInfo(userId);
      if (user?.email) {
        await sendOverdueEmail({
          to: user.email,
          taskTitle,
          dueDate,
          roleText,
        });
      }
    } catch (err) {
      console.error("notifyTaskOverdue error:", err.message);
    }
  }
}
