-- =============================================================
-- CẬP NHẬT MÀU SẮC TRẠNG THÁI CÔNG VIỆC (Workflow Status Colors)
-- Chạy script này trong SQL Server để cập nhật các project đã có
-- =============================================================

-- Xem màu hiện tại trước khi update
SELECT id, project_id, name, category, color, position
FROM statuses
ORDER BY project_id, position;
GO

-- ---------------------------------------------------------------
-- UPDATE màu theo TÊN STATUS (áp dụng cho tất cả project)
-- ---------------------------------------------------------------

-- To do → Tím Indigo #6366F1
UPDATE statuses
SET color = '#6366F1'
WHERE LOWER(name) IN ('to do', 'todo');
GO

-- In Progress → Xanh Sky #0EA5E9
UPDATE statuses
SET color = '#0EA5E9'
WHERE LOWER(name) = 'in progress';
GO

-- Code Review → Cam vàng #F59E0B (giữ nguyên, nhưng update để đảm bảo)
UPDATE statuses
SET color = '#F59E0B'
WHERE LOWER(name) IN ('code review', 'in review', 'review');
GO

-- Done / Hoàn thành → Xanh lá tươi #22C55E
UPDATE statuses
SET color = '#22C55E'
WHERE LOWER(name) IN ('done', 'hoàn thành', 'completed');
GO

-- ---------------------------------------------------------------
-- Kiểm tra kết quả sau khi update
-- ---------------------------------------------------------------
SELECT id, project_id, name, category, color, position
FROM statuses
ORDER BY project_id, position;
GO
