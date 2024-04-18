let mongoose = require("mongoose");
let Schema =mongoose.Schema;
let threadSchema=new Schema({
    users:{
        type:Array,
        required:true
    },
    subject:{
        type:String,
        required:true
    }
})
let threadModel = mongoose.model("threads",threadSchema);
module.exports=threadModel;