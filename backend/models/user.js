import { response } from "express";
import mongoose from "mongoose";

const teammateSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    
    role: {
        type: String,
        default: "Member"
    },
    response: {
        text: { type: String, default: "" },
        timestamp: { type: Date, default: Date.now }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const user = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    response:{
        text: { type:String, default:"" },
        timestamp: { type:Date, default:Date.now }
    },
    teammates: [teammateSchema],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export default mongoose.model("User", user);
