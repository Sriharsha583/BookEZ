import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from"./routes/auth.js"
import usersRoute from"./routes/users.js"
import hotelsRoute from"./routes/hotels.js"
import roomsRoute from"./routes/rooms.js"
import cookieParser from "cookie-parser";
import contactRoute from "./routes/contact.js"
import confirmbRoute from "./routes/confirmb.js"



const app=express()
dotenv.config()


const connect=async() =>{


    try {

        await mongoose.connect('mongodb+srv://shreyan:shreyan@cluster0.rp30nr2.mongodb.net/booking?retryWrites=true&w=majority');
        console.log("connected to mongodb")
    } catch (error) {
        throw error;
    }

};

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('/', (req, res) => {
      app.use(express.static(path.resolve(__dirname, 'client', 'build')));
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

 
mongoose.connection.on("disconnected",()=>{
    console.log("mongodb disconnected")
    
    
})

mongoose.connection.on("connected",()=>{
    console.log("mongodb connected")
})

app.get('/', (req, res) =>{
    res.send("Hello")

})


//middlewares
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/hotels",hotelsRoute);
app.use("/api/rooms",roomsRoute);
app.use("/api/contact",contactRoute)
app.use("/api/confirmb",confirmbRoute)

app.use((err,req,res,next)=>{
    const errorStatus=err.status || 500;
    const errorMessage=err.message || "Something went wrong"
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack
    })
})

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "/");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });





const port = process.env.PORT || 8800;
const host = '0.0.0.0'
  
app.listen(port,host,()=>{
    connect()
    console.log("connected to backend")
})