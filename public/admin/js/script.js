// Lấy alement của nút button - dùng querySelectorAll - Th này trả về node list
const buttonStatus = document.querySelectorAll("[button-status]") // attribute tự định nghĩa thì phải thêm dấu []

if(buttonStatus.length > 0){
    let url = new URL(window.location.href)
    
    
    buttonStatus.forEach(button => {
        button.addEventListener("click", ()=> {
            const status = button.getAttribute("button-status") // Lấy ra attribute của button
            console.log(status)
            
            if(status) {
                url.searchParams.set("status", status)
            }else {
                url.searchParams.delete("status")

            }
            console.log(url.href)

            // Chuyển hướng sang trang khác
            window.location.href = url.href
        })
    })

}
// Chức năng tìm kiến sản phẩm sự vào keyword
const formSearch = document.getElementById("form-search")
if(formSearch){
    let url = new URL(window.location.href)

    formSearch.addEventListener("submit", (e)=> {
        e.preventDefault()
        const keyword = e.target.elements.keyword.value
        if(keyword){
            url.searchParams.set("keyword", keyword)
        }else {
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}