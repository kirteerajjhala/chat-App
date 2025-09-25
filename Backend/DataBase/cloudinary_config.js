const cloudinary = require("cloudinary").v2;
const fs = require("fs")
const uploadOnCloudinary = async(filepath)=>{
    cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,   // Cloudinary dashboard
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

try {
    const uploadResult = await cloudinary.uploader.upload(filepath)
 
    // delete local file after upload
     fs.unlinkSync(filepath);  

    return uploadResult.secure_url
} catch (error) {
    console.log(`clodinary error while upload image ${error.message}`)
    s.unlink(filepath)
}
}

module.exports = uploadOnCloudinary;
