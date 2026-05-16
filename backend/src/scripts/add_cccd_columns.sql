-- ============================================================
-- Migration: Thêm cột cccd_date và cccd_place vào bảng users
-- Chạy script này 1 lần duy nhất trên SQL Server
-- ============================================================

-- Thêm cột ngày cấp CCCD (nếu chưa tồn tại)
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'cccd_date'
)
BEGIN
  ALTER TABLE users ADD cccd_date DATE NULL;
  PRINT 'Column cccd_date added successfully.';
END
ELSE
BEGIN
  PRINT 'Column cccd_date already exists, skipped.';
END

-- Thêm cột nơi cấp CCCD (nếu chưa tồn tại)
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'cccd_place'
)
BEGIN
  ALTER TABLE users ADD cccd_place NVARCHAR(200) NULL;
  PRINT 'Column cccd_place added successfully.';
END
ELSE
BEGIN
  PRINT 'Column cccd_place already exists, skipped.';
END

GO
