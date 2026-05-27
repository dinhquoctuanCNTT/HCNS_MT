export function validateShift(body) {
  const { name, start_time, end_time, days_of_week, grace_minutes } = body;
  const errors = [];

  if (!name || !name.trim()) errors.push("Tên ca làm việc không được để trống");
  if (!start_time || !/^\d{2}:\d{2}$/.test(start_time)) errors.push("Giờ bắt đầu không hợp lệ (HH:mm)");
  if (!end_time || !/^\d{2}:\d{2}$/.test(end_time)) errors.push("Giờ kết thúc không hợp lệ (HH:mm)");
  if (!days_of_week || !days_of_week.trim()) errors.push("Ngày làm việc không được để trống");
  if (grace_minutes !== undefined && (isNaN(grace_minutes) || grace_minutes < 0 || grace_minutes > 60)) {
    errors.push("Thời gian ân hạn phải từ 0 đến 60 phút");
  }

  return errors;
}
