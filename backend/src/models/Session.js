const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    type:{type:String,enum:["technical","behavioral"],required:true},
    text:{type:String,required:true }
});

const sessionSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    role:{type:String,required:true},
    seniority:{type:String,required:true},
    skills:[String],
    questions:[questionSchema],
    status:{type:String,enum:["active","completed"],default:"active"}
},{timestamps:true});

module.exports = mongoose.model("session",sessionSchema);