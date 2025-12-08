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
    1️⃣ { _id: { $ne: userId } }

    $ne = "not equal" = khác

    Loại bỏ chính bạn khỏi danh sách người dùng.

    ➡️ Không hiển thị chính mình trong danh sách "người không phải bạn bè".

    2️⃣ { _id: { $nin: requestFriends } }

    $nin = "NOT IN" = không thuộc trong danh sách

    requestFriends là danh sách những người bạn đã gửi lời mời kết bạn cho họ.

    ➡️ Nghĩa là loại luôn những người bạn đã gửi request, để tránh trùng lặp.

3.  Khi B từ chối kết bạn của A (Tương tự A hủy yêu cầu cho B)
-- Xóa id của A trong acceptFriends của B
-- Xóa id của B trong requestFriends của A

4. Khi B chấp nhận kết bạn của A
-- Thêm {user_id, room_chat_id} của A vào friendsList của B
-- Thêm {user_id, room_chat_id} của B vào friendsList của A
-- trong acceptFirends của B Xóa id của A ( vì a là request)
-- trong requestFirends của A Xóa id của B 
-- Lưu ý: room_chat_id phải trùng nhau (Tạm thời chưa dùng đến)

Giả sử:

    A gửi lời mời kết bạn cho B

    B nhấn chấp nhận

    Khi đó:

    Ở phía B (myUserID):

    B phải xóa A khỏi acceptFriends

    Ở phía A (userId):

    A phải xóa B khỏi requestFriends