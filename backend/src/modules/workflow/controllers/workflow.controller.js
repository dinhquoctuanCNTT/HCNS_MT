import * as workflowService from "../services/workflow.service.js";

export async function getProjects(req, res, next) {
  try {
    console.log("req.user in getProjects =", req.user);

    const data = await workflowService.getProjects(req.user?.id);
    console.log("getProjects data =", data);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getProjectBoard(req, res, next) {
  try {
    console.log("req.params:", req.params);
    console.log("req.query:", req.query);
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);
    const projectId = Number(req.params.projectId);
    const filters = {
      keyword: req.query.keyword || "",
      assigneeId: req.query.assigneeId ? Number(req.query.assigneeId) : null,
      priorityId: req.query.priorityId ? Number(req.query.priorityId) : null,
    };

    const data = await workflowService.getProjectBoard(projectId, filters);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getProjectMembers(req, res, next) {
  try {
    const data = await workflowService.getProjectMembers(
      Number(req.params.projectId),
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getProjectLabels(req, res, next) {
  try {
    const data = await workflowService.getProjectLabels(
      Number(req.params.projectId),
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getProjectStatuses(req, res, next) {
  try {
    const data = await workflowService.getProjectStatuses(
      Number(req.params.projectId),
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getProjectPriorities(req, res, next) {
  try {
    const data = await workflowService.getProjectPriorities();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getProjectTaskTypes(req, res, next) {
  try {
    const data = await workflowService.getProjectTaskTypes();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// ================= Project Member Management =================
export async function createProject(req, res, next) {
  try {
    console.log("=== CREATE PROJECT ===");
    console.log("req.body:", req.body);
    console.log("req.headers:", req.headers);
    console.log("req.user:", req.user);
    const data = await workflowService.createProject(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export const getProjectDetail = async (req, res, next) => {
  try {
    console.log("params:", req.params);
    console.log("user:", req.user);

    const projectId = req.params.projectId;
    console.log("projectId:", projectId);

    const result = await workflowService.getProjectDetail(projectId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export async function updateProject(req, res, next) {
  try {
    const data = await workflowService.updateProject(
      Number(req.params.projectId),
      req.body,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const data = await workflowService.deleteProject(
      Number(req.params.projectId),
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// Quản lý thành viên dự án
export async function addProjectMember(req, res, next) {
  try {
    const data = await workflowService.addProjectMember(
      Number(req.params.projectId),
      req.body,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
export async function removeProjectMember(req, res, next) {
  try {
    const data = await workflowService.removeProjectMember(
      Number(req.params.projectId),
      Number(req.params.userId),
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
export async function updateProjectMemberRole(req, res, next) {
  try {
    const data = await workflowService.updateProjectMemberRole(
      Number(req.params.projectId),
      Number(req.params.userId),
      req.body.newRole,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// ===============Label=================
export async function createProjectLabel(req, res, next) {
  try {
    const data = await workflowService.createProjectLabel(
      Number(req.params.projectId),
      req.body,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateProjectLabel(req, res, next) {
  try {
    const data = await workflowService.updateProjectLabel(
      Number(req.params.projectId),
      Number(req.params.labelId),
      req.body,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
export async function deleteProjectLabel(req, res, next) {
  try {
    const data = await workflowService.deleteProjectLabel(
      Number(req.params.projectId),
      Number(req.params.labelId),
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

//================== Status =================
export async function createProjectStatus(req, res, next) {
  try {
    const data = await workflowService.createProjectStatus(
      Number(req.params.projectId),
      req.body,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
export async function updateProjectStatus(req, res, next) {
  try {
    const data = await workflowService.updateProjectStatus(
      Number(req.params.projectId),
      Number(req.params.statusId),
      req.body,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteProjectStatus(req, res, next) {
  try {
    const data = await workflowService.deleteProjectStatus(
      Number(req.params.projectId),
      Number(req.params.statusId),
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// ================== Board columns =================
export async function createBoardColumn(req, res, next) {
  try {
    const data = await workflowService.createBoardColumn(
      Number(req.params.projectId),
      req.body,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
export async function updateBoardColumn(req, res, next) {
  try {
    const data = await workflowService.updateBoardColumn(
      Number(req.params.projectId),
      Number(req.params.columnId),
      req.body,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
export async function deleteBoardColumn(req, res, next) {
  try {
    const data = await workflowService.deleteBoardColumn(
      Number(req.params.priorityId),
      Number(req.params.columnId),
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// ================== Completed Tasks =================

// ✅ THÊM MỚI
export async function getCompletedTasks(req, res, next) {
  try {
    const projectId = Number(req.params.projectId);
    if (!projectId || isNaN(projectId)) {
      return res
        .status(400)
        .json({ success: false, message: "projectId không hợp lệ" });
    }
    const data = await workflowService.getCompletedTasks(projectId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function completeTask(req, res, next) {
  try {
    const data = await workflowService.completeTask(
      Number(req.params.taskId),
      req.body,
      req.user?.id,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function uncompleteTask(req, res, next) {
  try {
    const data = await workflowService.uncompleteTask(
      Number(req.params.taskId),
      req.user?.id,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
