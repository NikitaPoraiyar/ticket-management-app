import mongoose from "mongoose";

const styleSchema = new mongoose.Schema({
    headerbgclr:{
        type: String,
        required: true,
    },
    bodybgclr:{
        type: String,
        required: true,
    },
    message1:{
        type: String,
        required: true,
    },
    message2:{
        type: String,
        required: true,
    },
    formlabelname:{
        type: String,
        required: true,
    },
    formlabelphone:{
        type: String,
        required: true,
    },
    formlabelemail:{
        type: String,
        required: true,
    },
    welcomemessage:{
        type: String,
        required: true,
    },
    missedchattime:{
        type: String,
        required: true,
        default: "60"
    }
})

export default mongoose.model("style", styleSchema);


