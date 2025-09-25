const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const genreateJwtToekn = require("../utiles/jwtToken")



const signup = async (req, res) => {
  try {
     console.log("Signup request body:", req.body); 
    const { username, email, password } = req.body;

    if (!email  || !username || !password) {
      return res.status(402).json({
        success: false,
        message: "All fields are required", 
      });
    }

    // ✅ check if user already exists
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    } 
    if (password.length<6) {
        return res.status(400).json({
        success: false,
        message: "PassWord must be atlest 6 chachter",
      });
    }
    // ✅ hash password
    const hashpassword = await bcrypt.hash(password, 10);

    // // ✅ default profile pic
    // let boyProfile = `avatar.iran.liara.run/public/boy?username=${username}`;
    // let girlProfile = `avatar.iran.liara.run/public/girl?username=${username}`;

    // ✅ create new user
    const newUser = await User.create({
      username,
      email,
      password: hashpassword,
     
    });

    /// jwt 
    genreateJwtToekn(newUser._id , res)

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while registering the account",
      error: error.message,
    });
  }
};

const login = async(req,res)=>{
  try {
        
    let {email ,password} =req.body;

  //  check all fields
    if (!email||!password) {
   return   res.status(400).json({
        success :false,
        message : "All fields are required"
      })
    }
    if (password.length<6) {
        return res.status(400).json({
        success: false,
        message: "Password length should be atlest 6 chachter",
      });
    }
// check user exit or not
  let user = await User.findOne({email});
  if (!user) {
   return res.status(400).json({
      success : false,
      message : "user is not exit"
    })
  }
 console.log("user : " , user)
  // verify password

  let isMatchPassword = await bcrypt.compare(password,user.password);
  if (!isMatchPassword) {
       return res.status(400).json({
      success : false,
      message : "incorrect passoword while login user"
    })
  }

    console.log("enter 3  in login")
    /// jwt 
 let token=   genreateJwtToekn(user._id , res)


 console.log("enter 4  in login")

   return res.status(201).json({
      success: true,
      message: "User login successfully",
      user: user,
     token : token
    });
  } catch (error) {
            res.status(500).json({
      success: false,
      message: "User login while occur some error",
      errorMessage: error.message,
    });
  }
}

const logout = async(req,res)=>{
  try {
   res.clearCookie("token");  // ye cookie ko clear kr dega
       res.status(200).json({
      success: true,
      message: "User log out",
      
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: "User logout white occur some error",
      errorMessage: error.message,
    });
  }
}
module.exports = { signup ,login ,logout };
