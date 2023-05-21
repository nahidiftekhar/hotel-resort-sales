const sendMail = require('./utils/send-email');

async function sendSingleMail(req, res, next) {
  const { toEmail, mailBody, mailSubject } = req.body;
  const mailRes = await sendMail.sendSingleEmail(
    toEmail,
    mailBody,
    mailSubject
  );
  return res.json(mailRes);
}

module.exports = {
  sendSingleMail,
};
