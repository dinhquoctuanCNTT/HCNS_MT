# 🔧 Fix Mobile Login - Không lấy được data từ Backend

**Status**: Planning → Implementation

## 📋 Steps (1/5 completed):

- [ ] **1. Fix axios baseURL** in `mobile/src/api/axiosClient.ts`
  - Change: `http://10.0.2.2:3001` → `http://10.0.2.2:3002/api`
- [ ] **2. Kill conflicting port 3001**

  ```
  netstat -ano | findstr :3001
  taskkill /PID <PID_NUMBER> /F
  ```

- [ ] **3. Restart Backend on port 3002**

  ```
  cd backend
  npm start
  # Expected log: "Server is running at http://localhost:3002"
  ```

- [ ] **4. Test Mobile Login**
  - Open Expo/Emulator
  - Login with valid phone/password
  - Check network (Flipper/Reactotron) → 200 OK + token

- [ ] **5. Verify data fetches** (Attendance/HomeScreen APIs)

## Root Causes:

| Issue       | Mobile                        | Backend           | Fix                 |
| ----------- | ----------------------------- | ----------------- | ------------------- |
| **Port**    | 3001                          | 3002              | Change baseURL port |
| **Path**    | `/auth/login`                 | `/api/auth/login` | Add `/api` prefix   |
| **Network** | 10.0.2.2 (emulator localhost) | localhost         | ✅ Correct alias    |

**Next**: Edit axiosClient.ts → Mark step 1 ✓
