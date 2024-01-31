import Role from "../models/Role.js"
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import  jwt  from "jsonwebtoken";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import UserToken from "../models/UserToken.js";
import nodemailer from "nodemailer";

export const register = async (req,res, next)=>{
    try {
        const role = await Role.find({role:'User'});
        const salt = await bcrypt.genSalt(10);
        const hashPassword= await bcrypt.hash(req.body.password, salt);
        const newUser= new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Username: req.body.Username,
        email: req.body.email,
        password: hashPassword,
        roles: role
        });
        console.log(newUser);

    await newUser.save();
    //return next(CreateSuccess(200,"User registered successfully!"));
    return res.status(200).json("User registered successfully!");  

         
    } 
    catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong !");  
    }
}

export const login = async (req,res, next)=>{
    try {
        const user = await User.findOne({ email: req.body.email})

        .populate("roles","role");

        const{roles}= user;
        if (!user){
            return res.status(400).send("User not found!");
        }
        const isPasswordCorrect= await bcrypt.compare(req.body.password,user.password);

        if(!isPasswordCorrect){
            return res.status(400).send("Password not correct!");
        }
        const token = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin, roles: roles},
            process.env.JWT_SECRET
        );
        res.cookie("access_token",token,{httpOnly:true})
        .status(200)
        .json({
            status: 200,
            message :"Login success",
            data: user

        });

        //return next(CreateSuccess(200,"Login Success!"));

    } 
    catch (error) {
        console.log(error);
        return res.status(500).send('Something went wrong');
        
    }
}
export const registerAdmin = async (req,res, next)=>{
    try {
        const role = await Role.find({});
        const salt = await bcrypt.genSalt(10);
        const hashPassword= await bcrypt.hash(req.body.password, salt);
        const newUser= new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Username: req.body.Username,
        email: req.body.email,
        password: hashPassword,
        isAdmin:true,
        roles: role

        });
    await newUser.save();
    return res.status(200).json("Admin registered successfully!");
        
    } 
    catch (error) {
        return res.status(500).send("Something went wrong !");  
    }
}
export const sendEmail= async(req,res,next)=>{
    const email = req.body.email;
    const user = await User.findOne({email: {$regex:'^'+email+'$',$options:'i'}});
    if(!user){
        next.CreateError(404,"USER NOT FOUND!")
    }
    const payload={
        email:user.email
    }
    const expiryTime=300;
    const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: expiryTime});

    const newToken=new UserToken({
        userId: user._id,
        token: token

    });
    const mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:"h.benyoussef123@gmail.com",
            pass:"cfyhrfjjktukgtxo"
        }
    });
    let mailDetails={
        from:"h.benyoussef123@gmail.com",
        to: email,
        subject: "Reset Password",
        html : `
<html>
<head>
    <title>Password Reset Request</title>
</head>
<body>
    <h1>Password Reset Request</h1>
    <p>Dear ${user.Username},</p>
    <p>We have received a request to reset your password for your account with Floussek. To complete the password reset process, please click on the button below :</p>
    <a href = ${process.env.LIVE_URL}/reset/${token}> <button style"background-color: #4CAF50; color: white; padding: 14px 20px; border: none;cursor: pointer; border-radius: 4px; ">Reset Password</button>                                                                                                                                         
<p>Please note that this link is only valid for a 5 minutes. If you did not request a password reset, please disregard this message.</p>
<p>Thank you,</p>
<p> FLOUSSEK Team</p>
</body>
</html>`,

    };
    mailTransporter.sendMail(mailDetails,async(err,data)=>{
        if (err){
            console.log(err);
            return next(CreateError(500,"Something went wrong while sending the email !"))
        }else{
            await newToken.save();
            return next(CreateSuccess(200,"Mail sent successfully !"))
        }
    })

}
export const resetPassword=(req,res,next)=>{
    const token = req.body.token;
    const newPassword= req.body.password;

    jwt.verify(token,process.env.JWT_SECRET,async(err,data)=>{

        if(err){
            return next(CreateError(500,"Reset Link is Expired !"))

        }else{
           const response = data;
           const user = await User.findOne({email: {$regex:'^'+response.email+'$',$options:'i'}});
           const salt = await bcrypt.genSalt(10);
           const encryptedPassword = await bcrypt.hash(newPassword,salt);
           user.password =encryptedPassword;
           try {
                const updateUser = await User.findOneAndUpdate(
                    {_id: user._id},
                    {$set:user},
                    {new:true}
                )
                return next(CreateSuccess(200,"Password Reset Success"));
           } catch (error) {
                return next(CreateError(500,"Something went wrong while resetting the password!"))

            
           }

        }
    })
        
    
}