// Xử lý các yêu cầu kết bạn , hủy kết bạn

// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");

      const userId = button.getAttribute("btn-add-friend");
      // console.log(userId)

      // Gửi id lên server
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}

// Hết Chức năng gửi yêu cầu

// Chức năng hủy yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");

      const userId = button.getAttribute("btn-cancel-friend");
      // console.log(userId)

      // Gửi id lên server
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}

// Hết Chức năng hủy yêu cầu

// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");

      const userId = button.getAttribute("btn-refuse-friend");
      // console.log(userId)

      // Gửi id lên server
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}

// Hết Chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");

      const userId = button.getAttribute("btn-accept-friend");
      // console.log(userId)

      // Gửi id lên server
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}

// Hết Chức năng chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_LENGTH
const badgeUsersAccept = document.querySelector("[badge-users-accept]");
if (badgeUsersAccept) {
  const userId = badgeUsersAccept.getAttribute("badge-users-accept");
  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    // Vì thằng emit.broadcast nó gửi hết cho A B C trừ chính nó. Làm cho thằng nào cũng nhận đươcc số lượng lời mời kết bạn
    // Vì thế tạo 1 cờ ở đây để check
    if (userId === data.userId) {
      badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
  });
}

// END SERVER_RETURN_LENGTH_ACCEPT_LENGTH

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  // Trang lời mời đã nhận
  const dataUserAccept = document.querySelector("[data-user-accept]");
  if (dataUserAccept) {
    const userId = dataUserAccept.getAttribute("data-user-accept");
    if (userId === data.userId) {
      const div = document.createElement("div");
      div.classList.add("col-6");
      div.setAttribute("user-id", data.infoUserA._id);

      div.innerHTML = `
              <div class="box-user">
                  <div class="inner-avatar">
                  </div>
                  <div class="inner-info">
                      <div class="inner-name">${data.infoUserA.fullName}</div>
                      <div class="inner-button">
                          <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoUserA._id}>
                              Chấp nhận
                          </button>
                          <button class="btn btn-sm btn-secondary mr-1"  btn-refuse-friend=${data.infoUserA._id}>
                              Xóa
                          </button>    
                      </div>
                  </div>
              </div>
    `;
      dataUserAccept.appendChild(div);

      //   Bắt sự kiện cho các button (vì đây là nhờ js vẽ ra giao diện chứ không load lại trang nên phải bắt sự kiện lần nữa)
      const buttonRefuse = div.querySelector("[btn-refuse-friend]");
      buttonRefuse.addEventListener("click", () => {
        buttonRefuse.closest(".box-user").classList.add("refuse");

        const userId = buttonRefuse.getAttribute("btn-refuse-friend");

        socket.emit("CLIENT_REFUSE_FRIEND", userId);
      });

      // Tương tự như thế làm cho nút chấp nhận
    }
  }

  // Trang danh sách người dùng
  const dataUserNotFriend = document.querySelector("[data-user-not-friend]");
  if (dataUserNotFriend) {
    const userId = dataUserNotFriend.getAttribute("data-user-not-friend");
    if (userId === data.userId) {
      const boxUserRemove = dataUserNotFriend.querySelector(
        `[user-id='${data.infoUserA._id}']`
      );
      if (boxUserRemove) {
        dataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});

// End SERVER_RETURN_INFO_ACCEPT_FRIEND

// Chức năng hủy kết bạn realtime
// Gắn id của user đó vào box để khi nhấn xóa hủy kết bạn thì trong danh sách xóa luôn thằng đấy
// Khi A ấn hủy kết bạn thì bên B tìm thẻ div của A và xóa nó đi
// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  // const userIdA = data.userIdA;
  const boxUserRemove = document.querySelector(`[user-id='${data.userIdA}']`);
  if (boxUserRemove) {
    const dataUserAccept = document.querySelector("[data-user-accept]");
    const userIdB = badgeUsersAccept.getAttribute("badge-users-accept");
    if (userIdB === data.userIdB) {
      dataUserAccept.removeChild(boxUserRemove);
    }
  }
});

//End SERVER_RETURN_USER_ID_CANCEL_FRIEND
