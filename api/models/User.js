import mongoose, {Schema} from "mongoose";


const UserSchema =mongoose.Schema(
    {
        FirstName:{
            type : String,
            required: true
        },
        LastName: {
            type : String,
            required: true
        },
        Username: {
            type: String,
            required: true,
            unique :true
        },
        email: {
            type: String,
            required: true,
            unique :true
        },
        password: {
            type: String,
            required: true
        },
        profileImage:{
            type: String,
            required: false,
            default: "https://icons.veryicon.com/png/o/business/multi-color-financial-and-business-icons/user-139.png://www.flaticon.com/free-icons/user"
        },
        isAdmin:{
            type: Boolean,
            default: false
        },
        roles:{
            type: [Schema.Types.ObjectId],
            required : true,
            ref: "Role"

        }
        
    },
    {
        timestamps: true
    }
);
export default mongoose.model("User",UserSchema);