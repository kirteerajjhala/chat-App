const express = require("express");
const userRouter = express.Router();
const {getCurrentUser, Profile ,getOtherUsers ,search} = require("../controller/usercontroller");
const isAuth = require("../middlewares/isAuth");
const upload = require("../middlewares/multer");

// Current user
userRouter.get("/current", isAuth, getCurrentUser);

// Edit profile with image
userRouter.put("/editProfile", isAuth, upload.single("image"), Profile);

// other users get route

userRouter.get("/others" ,isAuth ,getOtherUsers)



userRouter.get("/search" ,isAuth ,search)
module.exports = userRouter;
