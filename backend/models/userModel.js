
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const fileSchema = new mongoose.Schema({
    filename:{required:true,type:String},
    fileurl:{required:true,type:String},
    senderemail:{required:true,type:String},
    receiveremail:{required:true,type:String},
    fileType:{type:String},
    shareAt:{required:true,type:Date}
},{timestamps:true})

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'
    },
    files:{
        type:[fileSchema],
        default:[]
    },
    
},{timestamps:true})


userSchema.pre('save',async function(next){
    const user= this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,10)
    }
    next();
})

module.exports = mongoose.model("User",userSchema)