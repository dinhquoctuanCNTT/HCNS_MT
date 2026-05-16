function validateCreateTaskPayload(payload) {
  const errors = [];

  if (!payload?.projectId) errors.push("projectId là bắt buộc");
  if (!payload?.boardId) errors.push("boardId là bắt buộc");
  if (!payload?.title || !String(payload.title).trim()) {
    errors.push("title là bắt buộc");
  }
  if (!payload?.statusId) errors.push("statusId là bắt buộc");

  return errors;
}

function validateMoveTaskPayload(payload) {
  const errors = [];

  if (!payload?.toStatusId) errors.push("toStatusId là bắt buộc");
  if (payload?.newPosition === undefined || payload?.newPosition === null) {
    errors.push("newPosition là bắt buộc");
  }

  return errors;
}

export { validateCreateTaskPayload, validateMoveTaskPayload };
