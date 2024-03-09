const nodemailer = require('nodemailer');


async function sendMail(recerivermail,code){

    const transporter = nodemailer.createTransport({
          service: "Gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD,
        },
      });

    const mailOptions = {
        from: "File share",
        to: recerivermail,
        subject: "OTP for verification",
        text: "Your OTP is" + code,
        html:"<b> Your OPT is  " + code + "</b>"
      };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
        }
      });
}


module.exports = sendMail;
  

async function sendMails(recerivermail,filesenderemail){

  const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.APP_PASSWORD,
      },
    });

  const mailOptions = {
      from: "File share",
      to: recerivermail,
      subject: "new file",
      text: "u received a mail from  " + filesenderemail,
      html:"<b> You received a file from   " + filesenderemail + "</b>"
    };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });
}

module.exports = sendMails;