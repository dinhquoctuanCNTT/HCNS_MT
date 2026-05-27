import { PERMISSIONS, ROLE_HIERARCHY } from "../config/roles.js";

// Cho phép các role cụ thể
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Yêu cầu role: ${allowedRoles.join(", ")}. Role hiện tại: ${req.user.role}`,
      });
    }
    next();
  };
};

// Yêu cầu role tối thiểu theo hierarchy
export const requireMinRole = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] ?? 0;
    const minLevel = ROLE_HIERARCHY[minRole] ?? 0;

    if (userLevel < minLevel) {
      return res.status(403).json({
        success: false,
        message: "Bạn không đủ quyền hạn để thực hiện thao tác này",
      });
    }
    next();
  };
};

// Kiểm tra permission cụ thể
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userPermissions = PERMISSIONS[req.user.role] ?? [];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Bạn không có quyền: ${permission}`,
      });
    }
    next();
  };
};
