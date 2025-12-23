const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name:{type:String,requires:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    password:{type:String,required:true,minlength:6},
    refreshToken:{type:String}
    
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();

});
userSchema.methods.matchPassword = function(entered){
    return bcrypt.compare(entered,this.password);
};
module.exports=mongoose.model("user",userSchema);