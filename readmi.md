Chức năng chưa làm:
0. Làm trang sửa thông tin user bên client
1. Làm phần quản lý user bên admin (Tương tự phần quản lý tài khoản)
2. Thêm phần phân quyền cho danh mục Quản lý user bên admin

Hướng dẫn làm chứ năng kết banj
- Phân tích bài toán : Có 2 người A và B
1. Khi A gửi Yêu cầu cho B
-- Thêm id của A vào acceptFriends của B
-- Thêm id của B và request Friends của A

2. Khi A hủy gửi yêu cầu cho B
-- Xóa id của A trong acceptFriends của B
-- Xóa id của B trong requestFriends của A

3.  Khi B từ chối kết bạn của A (Tương tự A hủy yêu cầu cho B)
-- Xóa id của A trong acceptFriends của B
-- Xóa id của B trong requestFriends của A

4. Khi B chấp nhận kết bạn của A
-- Thêm {user_id, room_chat_id} của A vào friendsList của B
-- Thêm {user_id, room_chat_id} của B vào friendsList của A
-- Xóa id của A trong acceptFirends của B
-- Xóa id của B trong requestFirends của A
-- Lưu ý: room_chat_id phải trùng nhau (Tạm thời chưa dùng đến)