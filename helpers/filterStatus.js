// Đoạn code này để cập nhật thằng status các giá trị trong obj filterStatus
module.exports = (query) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];

// query tức là thằng req.query
  if (query.status) {
    //2. Lấy ra index đagn được active
    const index = filterStatus.findIndex((item) => item.status == query.status);
    filterStatus[index].class = "active";
    // console.log(index);
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    filterStatus[index].class = "active";
  }
  
  return filterStatus

};
