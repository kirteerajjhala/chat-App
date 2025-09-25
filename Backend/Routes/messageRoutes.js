const express = require("express");
const messageRouter = express.Router();
const isAuth = require("../middlewares/isAuth");
const upload = require("../middlewares/multer");
const {sendMessage,getMessages} = require("../controller/messageContoller")



messageRouter.post("/send/:receiver" ,isAuth ,upload.single("image") ,sendMessage)

messageRouter.get("/get/:receiver" ,isAuth  ,getMessages)
module.exports = messageRouter;
