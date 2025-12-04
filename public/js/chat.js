import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    console.log(content);

    // Nếu người dùng nhập data thì mới gửi lên server
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}

// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const myId = document.querySelector("[my-id]").getAttribute("my-id"); // lấy được id user từ element

  const div = document.createElement("div");

  let htmlFullName = "";

  // Nếu id trùng vs id user
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    div.classList.add("inner-incoming");
  }

  div.innerHTML = `
 ${htmlFullName}
  <div class="inner-content">${data.content}</div>
  `;

  body.appendChild(div);
  body.scrollTop = bodyChat.scrollHeight; // Bằng chiều cao thằng scroll
});

// End SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  // Cách top bao nhiêu
  bodyChat.scrollTop = bodyChat.scrollHeight; // Bằng chiều cao thằng scroll
}

// End Scroll Chat To Bottom

// Show Icon Chat
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");

  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}
// End Show Icon Chat

// Insert Icon to Input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  // Lấy ra input
  const inputChat = document.querySelector(".inner-form input[name='content']");
  console.log(inputChat);

  emojiPicker.addEventListener("emoji-click", (e) => {
    const icon = e.detail.unicode;
    inputChat.value = inputChat.value + icon;
  });

  // Input Keyup
  inputChat.addEventListener("keyup", () => {
    // Gửi lên server 1 cái sự kiện
    socket.emit("CLIENT_SEND_TYPING", "show");
  });
  // End Input Keyup
}
// End Insert Icon to Input

// SERVER_RETURN_TYPING
socket.on("SERVER_RETURN_TYPING", (data) => {
  console.log(data);
});

// End SERVER_RETURN_TYPING
