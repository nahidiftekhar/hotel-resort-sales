const nodemailer = require('nodemailer');
const mailConfig = require('../../configs/mail.config');

async function sendSingleEmail(emailId, messageBody, mailSubject) {
  console.log('\n\nSending mail to: ' + emailId + '\n\n');
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
      console.log('Server is ready to take new messages');
    }
  });

  var mailOptions = {
    from: mailConfig.mailConfig.EMAIL_USERNAME,
    to: emailId,
    // replyTo: emailId,
    subject: mailSubject,
    text: mailConfig.mailConfig.DEFAULT_TEXT,
    html: messageBody,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return {
        status: 0,
        message: err,
      };
    } else {
      console.log('Message sent successfully' + info.response);
      return {
        status: 1,
        message: 'Mail sent successfully',
      };
    }
  });
}

module.exports = {
  sendSingleEmail,
};
