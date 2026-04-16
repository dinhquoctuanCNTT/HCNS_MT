# Fix Lỗi "Conversion failed varchar 'active' to tinyint" khi tạo tài khoản

## Status: FIXED IN CODE - NEEDS TESTING

- [x] 1. Tạo TODO file
- [x] 2. Sửa auth.service.js: đổi status='active' thành status=1
- [x] 3. Sửa auth.controller.js: cập nhật check status !== 1
- [x] 4. Cập nhật database.sql cho tương lai
- [ ] 5. Test với Postman/cURL (see command above)
- [ ] 6. Hoàn thành task & remove TODO
