import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    message:{
        text: { type:String, default:"" },
        timestamp: { type:Date, default:Date.now }
    },
    responseStatus:{
        type:String,
        enum:['Unresolved', 'Resolved'],
        default: 'Unresolved'
    },
    responseText:{
        type:String,
        default:''
    },
    responseTime:{
        type:Date,
    },
    assignedTeammate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teammate',
        default: null
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export default mongoose.model("FormSubmission", formSubmissionSchema);
