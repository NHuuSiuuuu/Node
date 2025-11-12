const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  console.log(path)

  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      console.log(statusCurrent);

      let statusChange = statusCurrent == "active" ? "inactive" : "active";
      console.log(statusChange);


    // Gán action trong form - status truyềgn vào là phải đã thay đổi rồi
      const action = path + `/${statusChange}/${id}?_method=PATCH` // thay đổi phương thức
    // Gán action cho form (ban đầu set action rỗng)
      formChangeStatus.action = action

    // Bình thường form phải có nút bấm mới submit được nhưng js hỗ trợ hàm chỉ cần gọi nó tự submit
    formChangeStatus.submit()

    });
  });
}
