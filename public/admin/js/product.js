// 1. Chức năng thay đổi trạng thái sản phẩm

const buttonChangeStatus = document.querySelectorAll("[button-change-status]"); // lấy thuộc tính của button
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  //  Lấy ra đường dẫn trang dựa vào thuôck tính data path
  const path = formChangeStatus.getAttribute("data-path");
  console.log(path)

  // Thêm sự kiện cho button
  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      // Lấy id của sản phẩm từ data-id
      const id = button.getAttribute("data-id");
      console.log(statusCurrent);

      // Logic thay đổi trạng thái sản phảm
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


//2. Chức năg thay đổi trạng thái nhiều sản phẩm
// - Làm logic check
// + Click vào check all các nút input khác được tích
// + Click vào các input thì nút check all được tích = length của các nút input = length các nút ĐƯỢC check

// Logic - Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti) {
  // Lấy nút check all
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']")
  
  inputCheckAll.addEventListener("click", ()=>{
    if(inputCheckAll.checked){
      // Nếu checked = true ==> các nút check sẽ tick true
      inputsId.forEach(item =>{
        item.checked = true
      } )
    }else {
        inputsId.forEach(item =>{
        item.checked = false
      } )

    }
  })

  // Logic - nút check  
  inputsId.forEach(input => {
    input.addEventListener("click", ()=> {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length // checked lấy các input đang được tick
      if(inputsId.length == countChecked){
        inputCheckAll.checked = true
      }else {
        inputCheckAll.checked = false

      }
    })
  })
}

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti) {
  formChangeMulti.addEventListener("submit", e => {
    e.preventDefault()

    const checkboxMulti = document.querySelector("[checkbox-multi]")
    const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")
    if(inputChecked.length > 0){
      let ids = []
      // Lấy ra input để insert chuỗi vào (ô input)
      const inputIds = formChangeMulti.querySelector("input[name='ids']")
      inputChecked.forEach(input => {
        const id = input.value // hoặc ghi là input.getAttribute("value")
        ids.push(id)
        
      })
      // ô intut không lưu được dạng arr, convert từ mảng sang chuỗi

      // Gán value cho input
      // id động thường dùng cách nối chuỗi
      inputIds.value = (ids.join(","))

      formChangeMulti.submit()

    }else {
      alert("Vui lòng chọn ít nhất 1 bản ghi!")
    }

  })
}

// End form Change Multi

// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]")
if(buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-status")
  const path = formDeleteItem.getAttribute("data-path")

  buttonDelete.forEach(button => {
    button.addEventListener("click", ()=> {
      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này?")
      if(isConfirm) {
        const id = button.getAttribute("data-id")
        
        const action = `${path}/${id}?_method=DELETE`
        formDeleteItem.action = action
        console.log(action)
        formDeleteItem.submit()
      }
    })
  })
}



// End Delete Item