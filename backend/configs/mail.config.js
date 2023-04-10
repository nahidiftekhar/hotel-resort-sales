const mailConfig = {
    EMAIL_USERNAME: 'jogfol@bdlancelimited.com',
    EMAIL_PASSWORD: 'rjD9%iSH#fRL',
    EMAIL_PORT: '465', //may depend on mail server
    EMAIL_HOST: 'server107.web-hosting.com',
    // SERVER_NAME: 'www.smarttaps.co', --required for bluehost. may be some other hosts
    EMAIL_TO: 'nahid.iftekhar@codemarshal.com',// for default receipient if any 'nahid.iftekhar@codemarshal.com',
    DEFAULT_TEXT: 'This mail is generated from backend with nodemailer'
    }

module.exports = {
    mailConfig
}