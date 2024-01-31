import  express  from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import cookieParser from 'cookie-parser';
import cors from'cors';
const app= express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
//app.use(cors());

app.use(cors({ 
       origin:'http://localhost:4200',
       credentials:true
 }))
app.use("/api/role",roleRoute);
app.use("/api/auth", authRoute );
app.use("/api/user", userRoute);


//Response Handler MiddleWare

app.use((obj,req,res,next)=>{
    const statusCode=obj.status || 500;
    const message= obj.message || "something went wrong !";
    return res.status(statusCode).json({
        success: [200,201,204].some(a=> a ===obj.status ) ? true : false ,
        status: statusCode,
        message: message,
        data :obj.data
        
    });
});


//db connection
const connectMongodb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to db");
    } catch (error) {
        throw error;

    }
}




 
app.listen(8800, ()=>{
    connectMongodb();
    console.log("connected to backend");
})
