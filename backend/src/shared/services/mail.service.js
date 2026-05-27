import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ── SVG Icons ────────────────────────────────────────────
const icons = {
  bell: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
    stroke="#E24B4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>`,

  check: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`,

  calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>`,

  user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`,

  arrow: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>`,

  clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#E24B4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>`,

  warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>`,
};

// ── Helper: tính số ngày còn lại ─────────────────────────
function getDiffDays(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.round((due - today) / (1000 * 60 * 60 * 24));
}

// ── Email task đến hạn / sắp đến hạn ────────────────────
export async function sendOverdueEmail({ to, taskTitle, dueDate, roleText }) {
  const diffDays = getDiffDays(dueDate);
  const isTomorrow = diffDays >= 1;
  const isToday = diffDays === 0;

  const subject = isTomorrow
    ? `[Sắp đến hạn] ${taskTitle}`
    : isToday
      ? `[Đến hạn hôm nay] ${taskTitle}`
      : `[Quá hạn] ${taskTitle}`;

  const headerColor = isTomorrow ? "#f59e0b" : "#E24B4A";
  const headerIcon = isTomorrow ? icons.warning : icons.bell;
  const headerText = isTomorrow
    ? "Task sắp đến hạn"
    : isToday
      ? "Task đến hạn hôm nay"
      : "Task đã quá hạn";
  const dateColor = isTomorrow ? "#f59e0b" : "#E24B4A";
  const bgColor = isTomorrow ? "#fffbeb" : "#fff5f5";
  const borderColor = isTomorrow ? "#f59e0b" : "#E24B4A";

  await transporter.sendMail({
    from: '"Công ty Sơn MT" <dinhtuna30@gmail.com>',
    to,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
        <div style="background:${headerColor};padding:24px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:50%;padding:12px;margin-bottom:12px;">
            ${headerIcon}
          </div>
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:600;">${headerText}</h2>
        </div>
        <div style="padding:28px 24px;">
          <div style="background:${bgColor};border-left:4px solid ${borderColor};border-radius:4px;padding:16px;margin-bottom:20px;">
            <p style="margin:0;font-size:16px;font-weight:600;color:#111;">${taskTitle}</p>
            <p style="margin:6px 0 0;font-size:13px;color:#666;">Task ${roleText}</p>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;padding:12px;background:#fafafa;border-radius:8px;">
            <span style="display:inline-block;vertical-align:middle;">${icons.clock}</span>
            <span style="font-size:14px;color:${dateColor};font-weight:600;">
              Hạn: ${new Date(dueDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
              ${isTomorrow ? " (còn 1 ngày)" : " (hôm nay)"}
            </span>
          </div>
          <div style="text-align:center;">
            <a href="${process.env.FRONTEND_URL}/admin/workflow"
              style="display:inline-flex;align-items:center;gap:8px;background:${headerColor};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              Xem task ngay ${icons.arrow}
            </a>
          </div>
        </div>
        <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
          <small style="color:#888;font-size:12px;">© Công ty Sơn MT — Hệ thống quản lý công việc</small>
        </div>
      </div>
    `,
  });
  console.log(
    `📧 Gửi email [${isTomorrow ? "sắp đến hạn" : "đến hạn"}] → ${to}`,
  );
}

// ── Email task mới ───────────────────────────────────────
export async function sendNewTaskEmail({
  to,
  taskTitle,
  assigneeName,
  dueDate,
}) {
  await transporter.sendMail({
    from: '"Công ty Sơn MT" <dinhtuna30@gmail.com>',
    to,
    subject: `[Task mới] ${taskTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
        <div style="background:#22c55e;padding:24px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:50%;padding:12px;margin-bottom:12px;">
            ${icons.check}
          </div>
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:600;">Task mới được giao</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="font-size:15px;color:#333;margin:0 0 20px;">
            Xin chào <strong>${assigneeName}</strong>, bạn vừa được giao một task mới.
          </p>
          <div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:4px;padding:16px;margin-bottom:20px;">
            <p style="margin:0;font-size:16px;font-weight:600;color:#111;">${taskTitle}</p>
            ${
              dueDate
                ? `<div style="display:flex;align-items:center;gap:6px;margin-top:8px;">
              <span style="display:inline-block;vertical-align:middle;">${icons.calendar}</span>
              <span style="font-size:13px;color:#16a34a;font-weight:500;">
                Hạn: ${new Date(dueDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
              </span>
            </div>`
                : ""
            }
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;padding:12px;background:#fafafa;border-radius:8px;">
            <span style="display:inline-block;vertical-align:middle;">${icons.user}</span>
            <span style="font-size:14px;color:#555;">Được giao cho: <strong>${assigneeName}</strong></span>
          </div>
          <div style="text-align:center;">
            <a href="${process.env.FRONTEND_URL}/admin/workflow"
              style="display:inline-flex;align-items:center;gap:8px;background:#22c55e;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              Xem task ngay ${icons.arrow}
            </a>
          </div>
        </div>
        <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
          <small style="color:#888;font-size:12px;">© Công ty Sơn MT — Hệ thống quản lý công việc</small>
        </div>
      </div>
    `,
  });
  console.log(`📧 Gửi email task mới → ${to}`);
}

// ── Email giao việc cho assignee ─────────────────────────
export async function sendTaskAssignedEmail({
  to,
  assigneeName,
  reporterName,
  taskTitle,
  taskKey,
  dueDate,
}) {
  await transporter.sendMail({
    from: '"Công ty Sơn MT" <dinhtuna30@gmail.com>',
    to,
    subject: `[Được giao việc] ${taskKey} - ${taskTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
        <div style="background:#0052cc;padding:24px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:50%;padding:12px;margin-bottom:12px;">
            ${icons.check}
          </div>
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:600;">Bạn được giao việc mới</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="font-size:15px;color:#333;margin:0 0 20px;">
            Xin chào <strong>${assigneeName}</strong>, <strong>${reporterName}</strong> đã giao task cho bạn.
          </p>
          <div style="background:#f0f4ff;border-left:4px solid #0052cc;border-radius:4px;padding:16px;margin-bottom:20px;">
            <span style="font-size:12px;font-weight:700;color:#0052cc;background:#e8f0fe;padding:2px 6px;border-radius:3px;">${taskKey}</span>
            <p style="margin:8px 0 0;font-size:16px;font-weight:600;color:#111;">${taskTitle}</p>
            ${
              dueDate
                ? `<div style="margin-top:8px;font-size:13px;color:#0052cc;font-weight:500;">
              Hạn: ${new Date(dueDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
            </div>`
                : ""
            }
          </div>
          <div style="text-align:center;">
            <a href="${process.env.FRONTEND_URL}/admin/workflow"
              style="display:inline-flex;align-items:center;gap:8px;background:#0052cc;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              Xem task ngay ${icons.arrow}
            </a>
          </div>
        </div>
        <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
          <small style="color:#888;font-size:12px;">© Công ty Sơn MT — Hệ thống quản lý công việc</small>
        </div>
      </div>
    `,
  });
  console.log(`📧 Gửi email giao việc → ${to}`);
}

// ── Email có comment mới ──────────────────────────────────
export async function sendTaskCommentEmail({
  to,
  userName,
  commenterName,
  taskTitle,
  taskKey,
  comment,
}) {
  await transporter.sendMail({
    from: '"Công ty Sơn MT" <dinhtuna30@gmail.com>',
    to,
    subject: `[Bình luận mới] ${taskKey} - ${taskTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
        <div style="background:#7c3aed;padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:600;">💬 Bình luận mới</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="font-size:15px;color:#333;margin:0 0 20px;">
            Xin chào <strong>${userName}</strong>, <strong>${commenterName}</strong> đã bình luận trong task của bạn.
          </p>
          <div style="background:#f5f3ff;border-left:4px solid #7c3aed;border-radius:4px;padding:16px;margin-bottom:20px;">
            <span style="font-size:12px;font-weight:700;color:#7c3aed;background:#ede9fe;padding:2px 6px;border-radius:3px;">${taskKey}</span>
            <p style="margin:8px 0 0;font-size:15px;font-weight:600;color:#111;">${taskTitle}</p>
            ${comment ? `<p style="margin:10px 0 0;font-size:13px;color:#555;font-style:italic;">"${comment}"</p>` : ""}
          </div>
          <div style="text-align:center;">
            <a href="${process.env.FRONTEND_URL}/admin/workflow"
              style="display:inline-flex;align-items:center;gap:8px;background:#7c3aed;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              Xem bình luận ${icons.arrow}
            </a>
          </div>
        </div>
        <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
          <small style="color:#888;font-size:12px;">© Công ty Sơn MT — Hệ thống quản lý công việc</small>
        </div>
      </div>
    `,
  });
  console.log(`📧 Gửi email comment → ${to}`);
}

// ── Email task hoàn thành ─────────────────────────────────
export async function sendTaskCompletedEmail({
  to,
  reporterName,
  completedByName,
  taskTitle,
  taskKey,
}) {
  await transporter.sendMail({
    from: '"Công ty Sơn MT" <dinhtuna30@gmail.com>',
    to,
    subject: `[Hoàn thành] ${taskKey} - ${taskTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
        <div style="background:#16a34a;padding:24px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:50%;padding:12px;margin-bottom:12px;">
            ${icons.check}
          </div>
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:600;">🎉 Task đã hoàn thành</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="font-size:15px;color:#333;margin:0 0 20px;">
            Xin chào <strong>${reporterName}</strong>, <strong>${completedByName}</strong> đã hoàn thành task.
          </p>
          <div style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:4px;padding:16px;margin-bottom:20px;">
            <span style="font-size:12px;font-weight:700;color:#16a34a;background:#dcfce7;padding:2px 6px;border-radius:3px;">${taskKey}</span>
            <p style="margin:8px 0 0;font-size:16px;font-weight:600;color:#111;">${taskTitle}</p>
          </div>
          <div style="text-align:center;">
            <a href="${process.env.FRONTEND_URL}/admin/workflow"
              style="display:inline-flex;align-items:center;gap:8px;background:#16a34a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              Xem chi tiết ${icons.arrow}
            </a>
          </div>
        </div>
        <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
          <small style="color:#888;font-size:12px;">© Công ty Sơn MT — Hệ thống quản lý công việc</small>
        </div>
      </div>
    `,
  });
  console.log(`📧 Gửi email hoàn thành → ${to}`);
}

// ── Email cảnh báo nghỉ không phép ───────────────────────
export async function sendAbsenceWarningEmail({ to, employeeName, absenceDate, warningCount }) {
  const isFirst = warningCount === 1;
  const subject = isFirst
    ? `[Cảnh báo] Nghỉ không phép ngày ${absenceDate}`
    : `[Vi phạm] Nghỉ không phép lần ${warningCount} - Xem xét kỷ luật`;

  await transporter.sendMail({
    from: '"P.HCNS - MT Holdings" <dinhtuna30@gmail.com>',
    to,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
        <div style="background:${isFirst ? "#f59e0b" : "#ef4444"};padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:600;">
            ${isFirst ? "⚠️ Cảnh báo nghỉ không phép" : "🚨 Vi phạm - Xem xét kỷ luật"}
          </h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="font-size:15px;color:#333;">Xin chào <strong>${employeeName}</strong>,</p>
          <p style="font-size:14px;color:#555;">
            Phòng HCNS ghi nhận bạn <strong>nghỉ không phép</strong> vào ngày <strong>${absenceDate}</strong>.
          </p>
          <div style="background:${isFirst ? "#fffbeb" : "#fff5f5"};border-left:4px solid ${isFirst ? "#f59e0b" : "#ef4444"};border-radius:4px;padding:16px;margin:20px 0;">
            <p style="margin:0;font-size:14px;color:#111;">
              Đây là lần vi phạm thứ <strong>${warningCount}</strong> trong tháng này.
            </p>
            ${!isFirst ? `<p style="margin:8px 0 0;font-size:13px;color:#ef4444;font-weight:600;">
              Trường hợp này sẽ được xem xét xử lý kỷ luật theo quy định công ty.
            </p>` : ""}
          </div>
          <p style="font-size:13px;color:#666;">
            Nếu có lý do chính đáng, vui lòng liên hệ ngay với Phòng HCNS để giải trình.
          </p>
        </div>
        <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
          <small style="color:#888;font-size:12px;">© MT Holdings — Phòng Hành chính Nhân sự</small>
        </div>
      </div>
    `,
  });
  console.log(`📧 Gửi cảnh báo nghỉ không phép → ${to}`);
}

// ── Email nhắc HCNS hoàn thiện bảng công ─────────────────
export async function sendHcnsReminderEmail({ to, month, year }) {
  await transporter.sendMail({
    from: '"Hệ thống HCNS - MT Holdings" <dinhtuna30@gmail.com>',
    to,
    subject: `[Nhắc nhở] Hoàn thiện bảng chấm công tháng ${month}/${year} trước 12h ngày 3`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
        <div style="background:#2563eb;padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:600;">📋 Nhắc nhở hoàn thiện bảng công</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="font-size:15px;color:#333;">Xin chào,</p>
          <p style="font-size:14px;color:#555;">
            Đây là nhắc nhở tự động: bạn cần hoàn thiện <strong>bảng chấm công tháng ${month}/${year}</strong>
            (bao gồm đầy đủ giải trình và xác nhận công với CBNV).
          </p>
          <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:4px;padding:16px;margin:20px 0;">
            <p style="margin:0;font-size:14px;font-weight:600;color:#1d4ed8;">
              ⏰ Deadline: Trước 12:00 ngày 03/${String(month + 1).padStart(2,"0")}/${year}
            </p>
          </div>
          <p style="font-size:13px;color:#666;">
            Vui lòng đăng nhập hệ thống để kiểm tra và xác nhận các trường hợp còn thiếu.
          </p>
        </div>
        <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
          <small style="color:#888;font-size:12px;">© MT Holdings — Hệ thống HCNS tự động</small>
        </div>
      </div>
    `,
  });
  console.log(`📧 Gửi nhắc HCNS tháng ${month}/${year} → ${to}`);
}

// ── Email thông báo đơn nghỉ phép ────────────────────────
export async function sendLeaveRequestEmail({ to, employeeName, fromDate, toDate, totalDays, leaveType, status, note }) {
  const statusMap = {
    tbp_approved: { text: "Trưởng BP đã duyệt (chờ HCNS)", color: "#f59e0b" },
    approved:     { text: "Đã được duyệt hoàn toàn",        color: "#22c55e" },
    rejected:     { text: "Bị từ chối",                     color: "#ef4444" },
  };
  const s = statusMap[status] ?? { text: status, color: "#6b7280" };

  await transporter.sendMail({
    from: '"P.HCNS - MT Holdings" <dinhtuna30@gmail.com>',
    to,
    subject: `[Đơn nghỉ phép] ${s.text}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
        <div style="background:${s.color};padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:600;">Đơn nghỉ phép: ${s.text}</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="font-size:15px;color:#333;">Xin chào <strong>${employeeName}</strong>,</p>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0 0 8px;font-size:14px;"><strong>Loại nghỉ:</strong> ${leaveType}</p>
            <p style="margin:0 0 8px;font-size:14px;"><strong>Từ ngày:</strong> ${fromDate}</p>
            <p style="margin:0 0 8px;font-size:14px;"><strong>Đến ngày:</strong> ${toDate}</p>
            <p style="margin:0;font-size:14px;"><strong>Số ngày:</strong> ${totalDays} ngày</p>
          </div>
          ${note ? `<p style="font-size:13px;color:#555;font-style:italic;">Ghi chú: ${note}</p>` : ""}
        </div>
        <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
          <small style="color:#888;font-size:12px;">© MT Holdings — Phòng Hành chính Nhân sự</small>
        </div>
      </div>
    `,
  });
  console.log(`📧 Gửi thông báo đơn nghỉ phép → ${to}`);
}
