let mongoose = require("mongoose");
let {ObjectId}=require("bson")
let Schema =mongoose.Schema;
let messageSchema=new Schema({
    message:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        required:true
    },
    threadId:{
        type:ObjectId,
        required:true
    },
    user:{
        type:String,
        required:true
    }
})
let messageModel = mongoose.model("messages",messageSchema);
module.exports=messageModel;