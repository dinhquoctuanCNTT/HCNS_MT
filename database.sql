CREATE DATABASE FullstackAuth;
GO

USE FullstackAuth;
GO

CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    phone NVARCHAR(20) NULL,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'user',\n    status TINYINT NOT NULL DEFAULT 1 /* 1=active, 0=inactive */,
    otp_code NVARCHAR(10) NULL,
    otp_expired_at DATETIME NULL,
    is_verified BIT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
GO