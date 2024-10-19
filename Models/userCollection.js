import mongoose from "mongoose";
let UserSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    uploadedFile:[{
        type:String
    }]
})
export const User=mongoose.model('User',UserSchema)