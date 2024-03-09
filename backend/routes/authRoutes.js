const express = require('express');
const User = require('../models/userModel');
const Verification = require('../models/verificationModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const responseFunction = require('../utils/responseFunction');
const fs = require('fs')
//const errorHandler = require('../middlewares/error.middleware');
const authTokenHandler = require('../middleware/checkAuthToken');
const sendMail = require('../utils/mailer')
const upload = require('../middleware/multer.middleware')



const fileUploadFunction = (req,res,next) => {
            //console.log(req)
        upload.single('clientfile')(req,res,(err)=>{
            if(err){
                return responseFunction(res,400,'file upload failed...uh',null,false)
            }
            next();
        })
}

router.post('/sendotp', async (req,res)=>{

   const {email} = req.body; 

    if(!email){
        return responseFunction(res,400,"email is required",null,false)
    }
    try {   
        await Verification.deleteOne({ email: email });

       const code = Math.floor(100000 + Math.random()*9000000)
       await sendMail(email,code); 

       const newVerification = new Verification({
            email:email,
            code:code,
       })
       await newVerification.save();
       return responseFunction(res, 200, 'OTP sent successfully', null, true);
        
    } catch (error) {
        console.log(error)
        return responseFunction(res, 500, 'internal server error', null, false);
    }
})


router.post('/register',fileUploadFunction, async(req,res,next)=>{

    try {
        const {name,email,password,otp,profilePic} = req.body
        const user = await User.findOne({email:email})
        const verificationQ = await Verification.findOne({email:email})
        if(user){
            responseFunction(res,400,"user already exists",null,false)
        }
        if(!verificationQ){
            responseFunction(res,400,"please send otp first",null,false)
        }
        const isMatch = await bcrypt.compare(otp, verificationQ.code);
        if (!isMatch) {
            return responseFunction(res, 400, 'Invalid OTP', null, false);
        }
        const newUser = new User({
            name,
            email,
            password,
            profilePic,
        })

        await newUser.save();
        await Verification.deleteOne({ email: email });
        return responseFunction(res, 200, 'registered successfully', null, true);

    } catch (error) {
        console.log(error,"in registering")
        return responseFunction(res,500, 'internal server errorr',null,false);
    }
})


router.post('/login',async(req,res,next)=>{
    try {

    const {email,password} = req.body;
    const user = await User.findOne({email:email});
    if(!user) {
        return responseFunction(res, 400, 'Invalid credentials..', null, false);
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) {
        return responseFunction(res, 400, 'Invalid credentials', null, false);
    }

    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' })
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '50m' });

    res.cookie('authToken',authToken,{
        sameSite: 'none',
            httpOnly: true,
            secure: true
    })
    res.cookie('refreshToken', refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true
    });
    return responseFunction(res, 200, 'Logged in successfully', {
        authToken: authToken,
        refreshToken: refreshToken
    }, true);

        
    } catch (error) {
        next(err)
    }
})

router.get('/checklogin',authTokenHandler, async(req,res,next)=>{
    res.json({
        ok:req.ok,
        message:req.message,
        userId:req.userId
    })
});

router.post('/logout',async(req,res,next)=>{
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.json({
        ok:true,
        message:'logout successful'
    })
})


router.get('/getuser',authTokenHandler,async(req,res,next)=>{
    try {
        const user = await User.findById(req.userId);
        if(!user){
            return responseFunction(res, 400, 'user not found', null, false);
        }
        return responseFunction(res, 200, 'User Found!', user, true);
    } catch (error) {
        console.log(error)
    }
})

// router.use(errorHandler)

module.exports = router;