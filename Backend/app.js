const  express = require('express');
const {app ,server} = require("./socketio/socket")
const mongoDb = require("./DataBase/db")
const cors =require("cors")
const dotenv = require("dotenv")
const authRouter = require("./Routes/auth.Router")
const userRouter =require("./Routes/userRoutes")


const path = require("path")
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT ;


app.use("/public", express.static(path.join(__dirname, "public")));

const cookieParser = require("cookie-parser");
const messageRouter = require('./Routes/messageRoutes');
  
app.use(cookieParser());

app.use(cors(
  {
    origin : "http://localhost:5173",
    credentials :true
  }

))


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth" ,authRouter)
app.use("/api/user" ,userRouter)
app.use("/api/message" , messageRouter)
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

server.listen(PORT, () => {
  console.log('Server is running on port: ', PORT);
});
mongoDb ();
