const nodemailer = require('nodemailer');

async function sendMail(recerivermail,code){

    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 465,
        secure: false,
        auth: {
          user: "a23dfef7e67ece",
          pass: "c51157e83cdbc4",
        },
      });

    const mailOptions = {
        from: "File share",
        to: recerivermail,
        subject: "OTP for verification",
        text: "Your OTP is" + code,
        html:"<b> Your OPT is" + code + "</b>"
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
      host: "sandbox.smtp.mailtrap.io",
      port: 465,
      secure: false,
      auth: {
        user: "a23dfef7e67ece",
        pass: "c51157e83cdbc4",
      },
    });

  const mailOptions = {
      from: "File share",
      to: recerivermail,
      subject: "new file",
      text: "u received a mail from" + filesenderemail,
      html:"<b> You received a file from" + filesenderemail + "</b>"
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