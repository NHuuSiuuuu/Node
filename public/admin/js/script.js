// Lấy alement của nút button - dùng querySelectorAll - Th này trả về node list
const buttonStatus = document.querySelectorAll("[button-status]"); // attribute tự định nghĩa thì phải thêm dấu []

if (buttonStatus.length > 0) {
  // obj URL trang hiện tại
  let url = new URL(window.location.href);

  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status"); // Lấy ra attribute của button
      // console.log(status);

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      // console.log(url.href);

      // Chuyển hướng sang trang khác
      window.location.href = url.href;
    });
  });
}
// Chức năng tìm kiến sản phẩm sự vào keyword
const formSearch = document.getElementById("form-search");
if (formSearch) {
  // obj URL trang hiện tại
  let url = new URL(window.location.href);

  // Truyền keyword lên URL
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    // Lấy value từ keyword trong ô input
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}

// Phân trang
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if(buttonsPagination) {
  // obj URL trang hiện tại
  const url = new URL(window.location.href)
  buttonsPagination.forEach(button => {
    button.addEventListener("click", ()=> {
      const page = button.getAttribute("button-pagination")
      if(page) {
        url.searchParams.set("page", page)
      }else {
        url.searchParams.delete("page")

      }
      window.location.href = url.href
    })
  })
}
// console.log(buttonsPagination)