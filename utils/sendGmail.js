const nodemailer = require('nodemailer');

const sendGmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.EMAIL_SERVICE_USER}`,
    pass: `${process.env.GMAIL_PASSWORD}`
  },
  tls: { rejectUnauthorized: false }
});


module.exports = sendGmail;



// smtp
// const sendGmail = nodemailer.createTransport({
//   host: 'smtp.purchasejunction.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: `${process.env.GMAIL_EMAIL}`,
//     pass: `${process.env.GMAIL_PASSWORD}`
//   },
//   tls: { rejectUnauthorized: false }
// });


//  <script src="https://smtpjs.com/v3/smtp.js"></script>
// function send(message) {
//     Email.send({
//         Host: "smtp.elasticemail.com",
//         Username: "t@gmail.com",
//         Password: "tEB82E5CB451B6F855854D040731BD383AA57t",
//         To: 't@gmail.com',
//         From: "t@gmail.com",
//         Subject: "New user getting a message from chatbot",
//         Body: message

//     }).then(
//         // message => alert(message)
//     );
// }