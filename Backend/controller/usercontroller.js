const User = require("../Models/userModel");
const uploadOnCludinary = require("../DataBase/cloudinary_config.js")
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User data found successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,  
      errormsg: error.message,
      message: "Current user error",
    });
  }
};


const Profile = async (req, res) => {
  try {
    const { name } = req.body;
    let image;

    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    console.log("req.userId:", req.userId);

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, ...(image && { image }) }, // Agar image hai to update
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, profile update failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Profile error",
      error: error.message,
    });
  }
};


const getOtherUsers = async (req,res)=>{
    console.log("userId : " ,req.userId);
    try {
        let users =await User.find({
            _id :{$ne :req.userId}
        }).select("-password")

        return res.status(200).json({
            data :users,
            success :true,
        })
    } catch (error) {
              return res.status(500).json({
            message :error.message,
            success :false,
        })
    }
}


const search =  async(req,res)=>{
  try {
    let {query} = req.query;
    if (!query) {
      return res.status(400).json({message : "qury is required for search"})
    }

    let users = await User.find({
      $or:[
        {name : {$regex : query , $options:"i"}},
        {username : {$regex : query , $options:"i"}},
      ]
    })

    return res.status(200).json(users)
  } catch (error) {
    
  }
}
module.exports = {getCurrentUser ,Profile ,getOtherUsers ,search};
