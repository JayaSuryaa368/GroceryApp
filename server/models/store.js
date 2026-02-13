import mongoose from "mongoose"

const storeSchema = new mongoose.Schema(
    {
        shopName : {
            type : String,
            required : true,
            unique : true,
        },

        ownerName : {
            type : String,
            required : true,
        },

        email : {
            type : String,
            lowercase : true,
            required : true,
            unique : true,
        },

        phoneNumber : {
            type : String,
            required : true,
            unique: true,
        },
        password : {
            type : String,
            required : true,
        },

        gstNumber : {
            type : String,
            uppercase : true,
            unique : true,
        },

        address : {
            type : String,
            required : true,
        },

        pincode :{
            type : Number,
            required : true,
        },
        isApproved : {
            type : String,
            enum : ["approved","pending","rejected"],
            default : "pending",
        },

        role : {
            type : String,
            default : "store"
        }
    },

    {
        timestamps : true,
    }
)

export default mongoose.model("store", storeSchema);