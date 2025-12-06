import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".inner-form");
let images = [];
if (formSendData) {
  // File-upload-with-preview
  document
    .querySelector("#upload-images")
    .addEventListener("change", function (e) {
      const preview = document.querySelector("#preview-images");
      preview.innerHTML = ""; // xoá preview cũ

      images = [...e.target.files];

      images.forEach((file) => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.width = "80px";
        img.style.marginRight = "8px";
        img.style.marginTop = "8px";
        img.style.borderRadius = "8px";
        preview.appendChild(img);
      });
    });
  // End File-upload-with-preview
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    console.log(content);
    console.log(images);

    // Nếu người dùng nhập data thì mới gửi lên server
    if (content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });
      e.target.elements.content.value = "";
      // 🔥 RESET hình ảnh sau khi gửi
      images = []; // xoá mảng ảnh
      document.querySelector("#upload-images").value = ""; // reset input file
      document.querySelector("#preview-images").innerHTML = ""; // xóa preview

      // Sau khi gửi xong thì gọi luôn hàm này để ẩn luôn typing
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}

// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const myId = document.querySelector("[my-id]").getAttribute("my-id"); // lấy được id user từ element

  const div = document.createElement("div");

  const boxTyping = document.querySelector(".inner-list-typing");

  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";

  // Nếu id trùng vs id user
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    div.classList.add("inner-incoming");
  }
  if (data.content) {
    htmlContent = `
      <div class="inner-content">${data.content}</div>
  `;
  }
  // <div class="inner-images">
  //   <img src="https://res.cloudinary.com/dhvyer5es/image/upload/v1765033297/yfcildqav0gmhcqvsre5.jpg">
  // </div>
  // Dùng += để nối thêm. nó không bị ghi đè mà thêm nối đuôi vào chuỗi
  if (data.image.length > 0) {
    htmlImages += `<div class="inner-images">`;

    for (const image of data.image) {
      htmlImages += `<img src="${image}">`;
    }

    htmlImages += `</div>`;
  }

  // htmlFullName = <div class="inner-name">${data.fullName}</div>
  div.innerHTML = `
      ${htmlFullName} 
      ${htmlContent}
      ${htmlImages}
  `;

  body.insertBefore(div, boxTyping); // tức là thằng div luôn đứng trước thằng boxTyping

  // Preview Images - viewjs xem toàn màn hình
  const gallery = new Viewer(div); // ;ắng nghe cho thẻ dic mới tạo này thôi không cầ lắng nghe cả body


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
var timeOut;
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  // Lấy ra input
  const inputChat = document.querySelector(".inner-form input[name='content']");
  // console.log(inputChat);

  emojiPicker.addEventListener("emoji-click", (e) => {
    const icon = e.detail.unicode;
    inputChat.value = inputChat.value + icon;

    inputChat.setSelectionRange(inputChat.value.length, inputChat.value.length); // luôn bắt đầu ở vị trí cuối
    inputChat.focus();

    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut); // Mỗi lần gõ là clear đi timeout

    // Ban đầu: Mỗi lần nhấn phím, sẽ tạo ra 1 timeout mới mà không xóa timeout cũ - vì vậy sau 3s tất cả timeout đều chạy gây lỗi ==> Phải clear đi trước khi tạo timeout mới
    timeOut = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
  });

  // Input Keyup
  inputChat.addEventListener("keyup", () => {
    // Gửi lên server 1 cái sự kiện
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut); // Mỗi lần gõ là clear đi timeout

    // Ban đầu: Mỗi lần nhấn phím, sẽ tạo ra 1 timeout mới mà không xóa timeout cũ - vì vậy sau 3s tất cả timeout đều chạy gây lỗi ==> Phải clear đi trước khi tạo timeout mới
    timeOut = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
  });
  // End Input Keyup
}
// End Insert Icon to Input

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".inner-list-typing");
if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    console.log(data);
    if (data.type == "show") {
      const existTyping = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );

      // Nếu chưa tồn tại thì vẽ ra còn tồn tại id rồi thì thôi
      if (!existTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `
                  <div class="inner-name">${data.fullName}</div>     
                  <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
      `;
        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight; // Bằng chiều cao thằng scroll
      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );
      // Nếu tồn tại thì clear nó đi
      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove); // Đơn giản là ở thẻ cha xóa đi thẻ con mà thôi
      }
    }
  });
}

// End SERVER_RETURN_TYPING

// Preview Full Image
const bodyChatPreviewImage = document.querySelector(".chat .inner-body");
if (bodyChatPreviewImage) {
  const gallery = new Viewer(bodyChatPreviewImage);
}

// End Preview Full Image
