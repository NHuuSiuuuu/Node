// Cập nhật số lượng trong giỏ hàng
const inputQuantity = document.querySelectorAll("input[name='quantity']");
if (inputQuantity.length > 0) {
  inputQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const quantity = e.target.value;
      const productId = input.getAttribute("product-id");

      console.log(quantity);
      console.log(productId);

      window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  });
}
