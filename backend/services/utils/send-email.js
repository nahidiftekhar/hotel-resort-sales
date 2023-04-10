const nodemailer = require("nodemailer");
const mailConfig = require("../../configs/mail.config");

async function sendSingleEmail(emailId, messageBody, mailSubject) {
  console.log('Trying mail...');
  const transporter = nodemailer.createTransport({
    name: mailConfig.mailConfig.SERVER_NAME,
    host: mailConfig.mailConfig.EMAIL_HOST,
    port: mailConfig.mailConfig.EMAIL_PORT,
    auth: {
      user: mailConfig.mailConfig.EMAIL_USERNAME,
      pass: mailConfig.mailConfig.EMAIL_PASSWORD,
    },
    secure: true,
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take new messages");
    }
  });

  var mailOptions = {
    from: mailConfig.mailConfig.EMAIL_USERNAME,
    to: emailId,
    // replyTo: emailId,
    subject: mailSubject,
    text: mailConfig.mailConfig.DEFAULT_TEXT,
    attachments: [{
      filename: 'logo.png',
      path: __dirname +'/logo.png',
      cid: 'logo'
  }],
    html: messageBody,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return ({
        status: 0,
        message: err,
      })
      // res.json({yo: 'error'});
      // res.sendStatus(500);
    } else {
      console.log('Message sent successfully' + info.response);
      // res.status(200).json({"msg": "mesage  has been sent"})
      return ({
        status: 1,
        message: "Mail sent successfully",
      });
    }
  });

  // return res;
}

module.exports = {
  sendSingleEmail,
};
