import  express  from "express";
import { login, register,registerAdmin, resetPassword, sendEmail } from "../controllers/auth.controller.js";

const router =express.Router();


//register
router.post("/register", register );

//LOGIN
router.post("/login", login);

//register as admin
router.post("/register-admin", registerAdmin);
//send email
router.post("/send-email",sendEmail);
//reset password
router.post("/reset-password",resetPassword)

export default router; 