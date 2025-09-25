let multer = require("multer")
let path = require("path")
// multer ka use tempoary time kr liye files ko public folder me save krna or unka filepath cloudinary ko dena cloudinary par upload ho jane ke bad vo ek url dega uska use krna or jo public folder me file save hi thi usko delete kr dena 



// Temporary file save in public folder


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve("D:/chat-App/Backend/public"); // absolute path
    console.log("Saving file to:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
module.exports = upload;


