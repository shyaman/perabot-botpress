let google = require('googleapis');

// //**comment when deploying
// let privatekey = require("./privatekey.json");  //private key of service account(not required for deployed app)
// // configure a JWT auth client
// let jwtClient = new google.auth.JWT(
//   privatekey.client_email,
//   null,
//   privatekey.private_key,
//   ['https://www.googleapis.com/auth/calendar']);

  let jwtClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY.replace(/\\n/g, '\n') ,
    ['https://www.googleapis.com/auth/calendar']);

console.log(process.env.CLIENT_EMAIL,process.env.PRIVATE_KEY);

    //authenticate request
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log(err);
        return;
      }else {
        console.log("successfully connected");
      }
    });

    module.exports = jwtClient;
