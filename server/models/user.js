import mongoose from "mongoose"

const userSchema= new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },

        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true
        },

        phoneNumber : {
            type : String,
            required : true,
            unique : true,
        },

        password : {
            type : String,
            required : true,
        },

        address : {
            type : String,
            required : true,
        },
        
        pincode :{
            type : Number,
            required : true,
        },
        
        role : {
            type : String,
            enum : ["user","store","admin"],
            default : "user"
        },
    },

    {
        timestamps : true,
    }
);

export default mongoose.model("User",userSchema);