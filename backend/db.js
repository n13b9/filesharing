const mongoose = require('mongoose');
require('dotenv').config()

const MONGODB_URL=process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, {
    dbName:'fileshare'
}).then(
    ()=>{
        console.log("connected to DB");
    }
).catch((err)=>{
    console.log('error in connection to db'+ err);
})

