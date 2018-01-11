var nodemailer = require('nodemailer');

// //comment this when deploy
// let mailAuth = require("./mailPass.json");
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: mailAuth.mail,
//     pass: mailAuth.pass
//   }
// });


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD
  }
});

module.exports = (message,mailAddr,subject) =>{

  var mailOptions = {
    from: 'perabot.acc@gmail.com',
    to: mailAddr,
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
     console.log('Email sent: ' + info.response);
    }
  });
}
