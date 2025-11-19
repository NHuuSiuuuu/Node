// 1. Chức năng thay đổi trạng thái sản phẩm

// Lấy ra type của selecy
const buttonChangeStatus = document.querySelectorAll("[button-change-status]"); // lấy thuộc tính của button
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  //  Lấy ra đường dẫn trang dựa vào thuôck tính data path
  const path = formChangeStatus.getAttribute("data-path");
  console.log(path);

  // Thêm sự kiện cho button
  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      // Lấy id của sản phẩm từ data-id
      const id = button.getAttribute("data-id");

      // Logic thay đổi trạng thái sản phảm
      let statusChange = statusCurrent == "active" ? "inactive" : "active";
      console.log(statusChange);

      // Gán action trong form - status truyềgn vào là phải đã thay đổi rồi
      const action = path + `/${statusChange}/${id}?_method=PATCH`; // thay đổi phương thức
      // console.log(action)
      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}

//2. Chức năg thay đổi trạng thái nhiều sản phẩm
// - Làm logic check
// + Click vào check all các nút input khác được tích
// + Click vào các input thì nút check all được tích = length của các nút input = length các nút ĐƯỢC check

// Logic - Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  // Lấy nút check all
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      // Nếu checked = true ==> các nút check sẽ tick true
      inputsId.forEach((item) => {
        item.checked = true;
      });
    } else {
      inputsId.forEach((item) => {
        item.checked = false;
      });
    }
  });

  // Logic - nút check
  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length; // checked lấy các input đang được tick
      if (inputsId.length == countChecked) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    // Lấy ra value select
    const typeChange = e.target.elements.type.value;
    if (typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này!");

      if (!isConfirm) {
        return;
      }
    }

    if (inputChecked.length > 0) {
      let ids = [];
      // Lấy ra input để insert chuỗi vào (ô input)
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputChecked.forEach((input) => {
        const id = input.value; // hoặc ghi là input.getAttribute("value")

        // Chức năng vị trị sản phẩm (bình thường thì chỉ cần push id, nhưng chức năng thay đổi vị trí và phải push thêm position)
        if (typeChange == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value; //Đi lên cha gần nhất là thẻ <tr> chứa checkbox đó.
          // Trong element thì value vẫn là thế nhưng nó ngầm hiểu là thay đổi
          // gửi chuỗi này sang backend
          ids.push(`${id}-${position}`);
          // console.log(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });
      // ô intut không lưu được dạng arr, convert từ mảng sang chuỗi

      // Gán value cho input
      // id động thường dùng cách nối chuỗi
      inputIds.value = ids.join(",");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi!");
    }
  });
}

// End form Change Multi

// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-status");
  const path = formDeleteItem.getAttribute("data-path");

  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");

        const action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.action = action;
        console.log(action);
        formDeleteItem.submit();
      }
    });
  });
}
// End Delete Item

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}

// End Show Alert

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  // Nút xóa
  const deleteImagePreview = document.querySelector("[delete-image-preview]");

  // Lắng nghe sự kiện onchange trong ô input
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
  deleteImagePreview.addEventListener("click", () => {
    uploadImageInput.value = "";
    uploadImagePreview.src = "";
  });
}

// Sort
const sort = document.querySelector("[sort]");
if(sort) {

const sortSelect = document.querySelector("[sort-select]");
const sortClear = document.querySelector("[sort-clear]");
let url = new URL(window.location.href);
sortSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  // console.log(value.split("-")) //  ['position', 'asc']
  const [sortKey, sortValue] = value.split("-"); // Dùng destructuring

  console.log(sortKey);
  console.log(sortValue);

  url.searchParams.set("sortKey", sortKey);
  url.searchParams.set("sortValue", sortValue);

  window.location.href = url.href;
});

// Xóa sắp xếp
sortClear.addEventListener("click", () => {
  let url = new URL(window.location.href);
  url.searchParams.delete("sortKey");
  url.searchParams.delete("sortValue");

  window.location.href = url.href;
});

// Thêm selected cho option
const sortKey = url.searchParams.get("sortKey")
const sortValue = url.searchParams.get("sortValue")

if(sortKey && sortValue) {
  const stringSort = `${sortKey}-${sortValue}`
  console.log(stringSort)
  const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`)
  optionSelected.selected = true
}


}

// End Sort
