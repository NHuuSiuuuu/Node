const Chat = require("../../models/chat.model");

const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
    res.render("client/pages/rooms-chat/index.pug",{
        pageTitle: "Danh sách phòng"
    })
}