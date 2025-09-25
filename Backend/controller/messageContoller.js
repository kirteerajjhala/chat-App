const uploadOnCloudinary = require("../DataBase/cloudinary_config");
const Conversation = require("../Models/conversationModle");
const Message = require("../Models/messageModel");
const { getReceiverSocketId, io } = require("../socketio/socket");

const sendMessage = async (req, res) => {
    try {
        const sender = req.userId;
        const { receiver } = req.params;
        const { message } = req.body;
        let image = "";

        console.log("hello image image image .... inside sendMessage route", req.file);

        // Agar file hai, to Cloudinary upload aur image variable me store karo
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path); // ✅ Corrected assignment
        }

        // Conversation check
        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        });

        // Message create
        const newMessage = await Message.create({
            sender,
            receiver,
            message,
            image
        });

        // Agar conversation exist nahi karti to create karo, otherwise push new message
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, receiver],
                message: [newMessage._id]
            });
        } else {
            conversation.message.push(newMessage._id);
            await conversation.save();
        }

     const receiverSocketId = getReceiverSocketId(receiver)

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage" , newMessage)
    }
        return res.status(200).json({
            success: true,
            data: newMessage
        });

    } catch (error) {
        console.log("SendMessage Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMessages = async (req, res) => {
  try {
    const sender = req.userId; // JWT se aayega
    const { receiver } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("message");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        data: [], // Empty array return karo, error nahi
        message: "No conversation found",
      });
    }


    return res.status(200).json({
      success: true,
      data: conversation.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = { sendMessage, getMessages };
