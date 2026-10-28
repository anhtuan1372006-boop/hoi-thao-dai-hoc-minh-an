# Hội thảo khoa học 2026 · Đại học Minh An

Trang web giới thiệu hội thảo **“Chuyển đổi số và phát triển bền vững”** (bài tập thực hành).

## Chức năng

- Trang chủ: giới thiệu hội thảo, thông tin ngày giờ – địa điểm, 3 chủ đề (bấm để xem chi tiết và phiên liên quan).
- Diễn giả: thẻ diễn giả, hộp thông tin chi tiết, danh sách tất cả diễn giả.
- Chương trình: lịch trình cả ngày, bấm tên diễn giả để xem thông tin, làm nổi bật phiên theo chủ đề.
- Đăng ký tham dự: kiểm tra dữ liệu trực tiếp (họ tên, email hợp lệ & không trùng, số điện thoại 10 số bắt đầu bằng 0, đơn vị, đối tượng, hình thức, chủ đề, ghi chú ≤ 300 ký tự, đồng ý điều khoản).
- Kết quả: thẻ đăng ký thành công, thống kê (tổng / trực tiếp / trực tuyến), danh sách đã lưu có tìm kiếm (không phân biệt dấu), sửa và xóa (có hộp xác nhận).
- Liên hệ, chân trang, menu điện thoại, giao diện responsive.

Dữ liệu đăng ký chỉ lưu trong `localStorage` của trình duyệt, không gửi đi đâu. Thời gian, địa điểm và diễn giả là dữ liệu minh họa.

## Chạy thử

Mở `index.html` bằng trình duyệt, hoặc chạy một máy chủ tĩnh, ví dụ:

```bash
python -m http.server 8000
```
