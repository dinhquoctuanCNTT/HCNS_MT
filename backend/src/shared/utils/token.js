import { getPool } from "../config/db.js";

export const findUserByEmail = async (email) => {
  const pool = getPool();

  const result = await pool.request().input("email", email).query(`
      SELECT TOP 1 * 
      FROM users 
      WHERE email = @email
    `);

  return result.recordset[0];
};

export const createUser = async ({
  fullName,
  email,
  phone,
  passwordHash,
  otpCode,
  otpExpiredAt,
}) => {
  const pool = getPool();

  const result = await pool
    .request()
    .input("full_name", fullName)
    .input("email", email)
    .input("phone", phone)
    .input("password_hash", passwordHash)
    .input("otp_code", otpCode)
    .input("otp_expired_at", otpExpiredAt).query(`
      INSERT INTO users (full_name, email, phone, password_hash, role, status, otp_code, otp_expired_at, is_verified)
      OUTPUT INSERTED.*
      VALUES (@full_name, @email, @phone, @password_hash, 'user', 'active', @otp_code, @otp_expired_at, 0)
    `);

  return result.recordset[0];
};

export const updateUserOtp = async ({ email, otpCode, otpExpiredAt }) => {
  const pool = getPool();

  await pool
    .request()
    .input("email", email)
    .input("otp_code", otpCode)
    .input("otp_expired_at", otpExpiredAt).query(`
      UPDATE users
      SET otp_code = @otp_code,
          otp_expired_at = @otp_expired_at,
          updated_at = GETDATE()
      WHERE email = @email
    `);
};

export const verifyUserOtp = async ({ email }) => {
  const pool = getPool();

  await pool.request().input("email", email).query(`
      UPDATE users
      SET is_verified = 1,
          otp_code = NULL,
          otp_expired_at = NULL,
          updated_at = GETDATE()
      WHERE email = @email
    `);
};
