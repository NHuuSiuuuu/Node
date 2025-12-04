// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    console.log(content)

    // Nếu người dùng nhập data thì mới gửi lên server
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = ""
    }
  });
}

// End CLIENT_SEND_MESSAGE
