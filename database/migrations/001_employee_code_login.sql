-- Migration 001: Đăng nhập bằng mã nhân viên
-- Ngày: 2026-05-16
-- Chạy script này trên server database HCNS_MT

USE HCNS_MT;

-- 1. Bỏ UNIQUE constraint trên email (nếu còn)
DECLARE @constraintName NVARCHAR(200)
SELECT @constraintName = name
FROM sys.key_constraints
WHERE parent_object_id = OBJECT_ID('users')
  AND type = 'UQ'
  AND name LIKE '%email%'

IF @constraintName IS NOT NULL
BEGIN
    EXEC('ALTER TABLE users DROP CONSTRAINT ' + @constraintName)
    PRINT 'Đã xóa UNIQUE constraint email'
END

-- 2. Cho phép email = NULL
IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('users')
      AND name = 'email'
      AND is_nullable = 0
)
BEGIN
    ALTER TABLE users ALTER COLUMN email NVARCHAR(150) NULL
    PRINT 'Đã cho phép email = NULL'
END

-- 3. Thêm cột employee_code nếu chưa có
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('users') AND name = 'employee_code'
)
BEGIN
    ALTER TABLE users ADD employee_code NVARCHAR(20) NULL
    PRINT 'Đã thêm cột employee_code'
END

-- 4. Gán mã cho Đinh Quốc Tuấn
UPDATE users
SET employee_code = 'MTH67'
WHERE full_name LIKE N'%Đinh Quốc Tuấn%'
  AND (employee_code IS NULL OR employee_code = '')
PRINT 'Đã cập nhật MTH67'

-- 5. Thêm 6 nhân viên (bỏ qua nếu đã tồn tại)
DECLARE @hash NVARCHAR(255) = '$2a$10$zr3AYXWtYAZ4lwxwM7w4A.shoZ0r.k65QeCmZe3meI9uR7Vf0.aIi'

IF NOT EXISTS (SELECT 1 FROM users WHERE employee_code = 'MTH28')
    INSERT INTO users (full_name, employee_code, password_hash, role)
    VALUES (N'Vũ Tiến Minh', 'MTH28', @hash, 'employee')

IF NOT EXISTS (SELECT 1 FROM users WHERE employee_code = 'MTH72')
    INSERT INTO users (full_name, employee_code, password_hash, role)
    VALUES (N'Bùi Thị Vân', 'MTH72', @hash, 'employee')

IF NOT EXISTS (SELECT 1 FROM users WHERE employee_code = 'MTH73')
    INSERT INTO users (full_name, employee_code, password_hash, role)
    VALUES (N'Bùi Hải Đình', 'MTH73', @hash, 'employee')

IF NOT EXISTS (SELECT 1 FROM users WHERE employee_code = 'MTH65')
    INSERT INTO users (full_name, employee_code, password_hash, role)
    VALUES (N'Nguyễn Thị Ngân', 'MTH65', @hash, 'employee')

IF NOT EXISTS (SELECT 1 FROM users WHERE employee_code = 'MTH76')
    INSERT INTO users (full_name, employee_code, password_hash, role)
    VALUES (N'Trần Thị Thu Hương', 'MTH76', @hash, 'employee')

IF NOT EXISTS (SELECT 1 FROM users WHERE employee_code = 'MTH19')
    INSERT INTO users (full_name, employee_code, password_hash, role)
    VALUES (N'Đỗ Thanh Tùng', 'MTH19', @hash, 'employee')

PRINT 'Đã thêm nhân viên'

-- 6. Kiểm tra kết quả
SELECT id, employee_code, full_name, role
FROM users
WHERE employee_code IN ('MTH67','MTH28','MTH72','MTH73','MTH65','MTH76','MTH19')
ORDER BY employee_code
