const express = require('express');
const User = require('../models/userModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const responseFunction = require('../utils/responseFunction');
const nodemailer = require('nodemailer');
const authTokenHandler = require('../middleware/checkAuthToken');
const sendMails = require('../utils/mailer')
const upload = require('../middleware/multer.middleware')
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const dotenv = require('dotenv')
dotenv.config();


const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})


router.get('/test', async (req,res)=>{
    // let imageUrl = await getObjectURL('feynman.jpeg')
    // console.log("working file")

    // res.send(
    //       '<img src="' + imageUrl + '"/>'
    //   );


    let ToUploadUrl = await postObjectURL('myfile','');
    res.json({
        url:ToUploadUrl
    })

})

const fileUploadFunction = (req,res,next) => {
    //console.log(req)
upload.single('clientfile')(req,res,(err)=>{
    if(err){
        return responseFunction(res,400,'file upload failed...uh',null,false)
    }
    next();
})
}


const getObjectURL = async (key) => {
  const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
  }
  return await getSignedUrl(s3Client, new GetObjectCommand(params));

}

const postObjectURL = async (filename,ct ) => {

  const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      ContentType: ct,
  }
  return await getSignedUrl(s3Client, new PutObjectCommand(params));
}

router.get('/generatepostobjecturl',authTokenHandler,async(req,res,next)=>{
      try {
        const timeinmins = new Date().getTime();
        const signedUrl = await postObjectURL(timeinmins.toString(),'')

        return responseFunction(res,200,'file upload', {
              signedUrl:signedUrl,
              filekey:timeinmins.toString()
        },true)

      } catch (error) {
        console.log(error)
      }
})


//upload file
// router.post('/sharefile',authTokenHandler,fileUploadFunction,async(req,res,next)=>{

router.post('/sharefile',authTokenHandler,async(req,res,next)=>{
    try {
      const {receiveremail,filename,filekey,fileType} = req.body
      console.log(req.body,"showing");
      let senderUser = await User.findOne({_id:req.userId})
      let receiverUser = await User.findOne({email:receiveremail})
      
      if(!senderUser){
        return responseFunction(res, 400, 'Sender email is not registered', null, false);
        //detele uploaded file
      }
      if(!receiverUser){
        return responseFunction(res, 400, 'Reciever email is not registered', null, false);
      }

      senderUser.files.push({
        senderemail:senderUser.email,
        receiveremail,
        filename:filename ? filename : new Date().toLocaleDateString,
        // fileurl:req.body.fileurl,
        fileurl:filekey,
        fileType:fileType,
        shareAt:Date.now()
      })

      receiverUser.files.push({
        senderemail:senderUser.email,
        receiveremail,
        filename:filename ? filename : new Date().toLocaleDateString,
        fileurl:filekey,
        fileType:fileType,
        shareAt:Date.now()
      })

      await senderUser.save();
      await receiverUser.save();
      await sendMails(receiveremail,senderUser.email);
      return responseFunction(res, 200, 'shared successfully', null, true);
        
    } catch (error) {
        next(error);
    }
})

//get file

router.get('/getfiles',authTokenHandler,async(req,res)=>{
  try {
    
    const user = await User.findById({_id:req.userId});
    
    return responseFunction(res,200,'details',user.files,true)

  } catch (error) {
    console.log(error)
  }
})


//share file 
//detele file

module.exports = router;