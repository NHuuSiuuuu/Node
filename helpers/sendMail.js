const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, //Mật khẩu ứng dụng
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "nguyenhung2k4gh@gmail.com", // Gủi từ
    to: email,                         // Đến mail nào
    subject: subject,                  // Tiêu dề
    html: html,                        // Nội dung
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
