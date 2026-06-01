-- Migration: thêm cột địa điểm vào bảng Attendance
-- Chạy một lần trên SQL Server HCNS_MT

-- Kiểm tra và thêm check_in_address
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'Attendance' AND COLUMN_NAME = 'check_in_address'
)
BEGIN
  ALTER TABLE Attendance ADD check_in_address NVARCHAR(500) NULL;
  PRINT 'check_in_address column added';
END
ELSE
  PRINT 'check_in_address already exists';

-- Kiểm tra và thêm check_out_address
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'Attendance' AND COLUMN_NAME = 'check_out_address'
)
BEGIN
  ALTER TABLE Attendance ADD check_out_address NVARCHAR(500) NULL;
  PRINT 'check_out_address column added';
END
ELSE
  PRINT 'check_out_address already exists';

-- Kiểm tra và thêm latitude (nếu chưa có)
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'Attendance' AND COLUMN_NAME = 'latitude'
)
BEGIN
  ALTER TABLE Attendance ADD latitude FLOAT NULL;
  PRINT 'latitude column added';
END
ELSE
  PRINT 'latitude already exists';

-- Kiểm tra và thêm longitude (nếu chưa có)
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'Attendance' AND COLUMN_NAME = 'longitude'
)
BEGIN
  ALTER TABLE Attendance ADD longitude FLOAT NULL;
  PRINT 'longitude column added';
END
ELSE
  PRINT 'longitude already exists';

PRINT 'Migration 002 completed.';
