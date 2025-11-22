const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let permissions = [];

    const rows = tablePermissions.querySelectorAll("[data-name]");
    // console.log(rows)
    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      //   Lấy ra các ô input đêt lặp qua
      const inputs = row.querySelectorAll("input");
      //   console.log(inputs);

      // Nếu hàng là id: Lấy tất cả ID trong hàng đầu tiên
      if (name == "id") {
        // id = id
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: [],
          });
        });
        // Sau bước 1 sẽ lấy được mảng như này { id: "abc", permissions: [] },
      } else {
        // Khi tick các ô input
        // Lặp qua từng hàng - hàng có 2 ô input - index là từng ô input
        inputs.forEach((input, index) => {
          const checked = input.checked; // lấy ra các trường đc tick
          /**
             * // permissions trước khi push:
            permissions = [
            { id: "A_id", permissions: [] },
            { id: "B_id", permissions: [] },
            { id: "C_id", permissions: [] }
            ]

            // checkbox tick ở cột 0, name = "view"
            permissions[0].permissions.push("view")

            // permissions sau khi push:
            permissions = [
            { id: "A_id", permissions: ["view"] },
            { id: "B_id", permissions: [] },
            { id: "C_id", permissions: [] }
            ]
            */
          if (checked) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });
    console.log(permissions);
    if (permissions.length > 0) {
      const formChangePermissions = document.querySelector(
        "#form-change-permissions"
      );
      const inputPermissions = formChangePermissions.querySelector(
        "input[name='permissions']"
      );
      inputPermissions.value = JSON.stringify(permissions);
      // console.log(inputPermissions.value )
      formChangePermissions.submit();
    }
  });
}

const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records")); // convert về mảng
  const tablePermissions = document.querySelector("[table-permissions]");

  records.forEach((record, index) => {
    const permissions = record.permissions;

    // console.log(permissions)

    permissions.forEach((permission) => {
      const row = tablePermissions.querySelector(`[data-name=${permission}]`);
      const input = row.querySelectorAll("input")[index];

      input.checked = true;

      console.log(permission);
      console.log(index);
    });
    console.log("-----------");
  });
}
