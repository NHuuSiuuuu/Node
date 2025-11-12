//3. Chức năng tìm kiếm key

// query tức là thằng req.query
module.exports = (query)=> {
    let objectSearch = {
        keyword : "",
        // regex: ""

    }

    
    if (query.keyword) {
        // update lại keyword
      objectSearch.keyword = query.keyword.trim();
    
      // MôngDB tìm những bản ghi có title giống với title trong database
      // Dùng thằng regex MongDB sẽ tìm những bản ghi có trường title có chứa chuỗi mà người dùng nhập vào ở bất kỳ đâu trong văn bản
      const regex = new RegExp(objectSearch.keyword, "i"); // i - ko phân biệt chữ hoa chữ thường
    // Nếu có regex truyền vào thì them key regex 
      objectSearch.regex = regex; // Thằng regex này tạo trong server
    }

    return objectSearch
}
