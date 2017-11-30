let google = require('googleapis');
let privatekey = require("./privatekey.json");  //private key of service account(not required for deployed app)


// configure a JWT auth client
let jwtClient = new google.auth.JWT(
       process.env.CLIENT_EMAIL || privatekey.client_email,
       null,
       process.env.PRIVATE_KEY || privatekey.private_key,
       ['https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
 if (err) {
   console.log(err);
   return;
 } else {
   console.log("API Successfully connected!");
 }
});

module.exports = jwtClient;
