import  express  from "express";
import { createRole, deleteRole, getAllRoles, updateRole } from "../controllers/role.controller.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router =  express.Router();

//create new role
router.post('/create',verifyAdmin, createRole);

//update role
router.put('/update/:id',verifyAdmin,updateRole);

//Get all the roles from db

router.get('/getAll',verifyAdmin,getAllRoles)

//Delete Route from Db
router.delete("/deleteRole/:id",verifyAdmin,deleteRole);
export default router;
