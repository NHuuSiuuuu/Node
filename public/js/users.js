// Xử lý các yêu cầu kết bạn , hủy kết bạn

// Chức năng gửi yêu cầu 
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if(listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", ()=> {

           button.closest(".box-user").classList.add("add")

            const userId = button.getAttribute("btn-add-friend")
            // console.log(userId)

            // Gửi id lên server
            socket.emit("CLIENT_ADD_FRIEND", userId)


        })
    })
}


// Hết Chức năng gửi yêu cầu 