
const admin = require('firebase-admin');

const functions = require('firebase-functions');

const mailer = require('nodemailer');

// Require cors allowing cross origin resource sharing @see{https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS}
const cors = require('cors')({ origin: true });


admin.initializeApp();

// Get Google Cloud environment variables.
// NOTE: Make sure to configure the `gmail.email` and `gmail.password`.
const config = functions.config();

// Configure the email transport using the default SMTP transport and a GMail account.
// Make sure to setup an app password (https://support.google.com/accounts/answer/185833?hl=en)
// while enabling 2-step authentication for improved security
const transport = mailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmail.email,
    pass: config.gmail.password,
  },
});

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendFeedback = functions.https.onRequest( (req, res) => {
/*
  if(req.method !== 'GET') {
    return res.status(405).end();
  }
*/

  // Allows the broswer to handle cross reference sharing 
  return cors(req, res, () => {

    console.log('Query: ', req.query);

    //const from = !!req.body ? req.body.email : req.query.email;
    
    //if(!from) { return res.status(400).end(); }

    //const name = !!req.body ? req.body.name  : req.query.name;
    //const text = !!req.body ? req.body.text  : req.query.text;

    return transport.sendMail({
      from: 'me@email.com',
      to: 'hello@wizdm.io',
      subject: 'Feedback from Me',// + name,
      text: 'Seems to work, actually'
    }, 
    (err, info) => {

      if(err) {
        console.log('Error sending: ', err);
        res.status(500).end();
        return;
      }

      console.log('Sent: ', info)
      res.status(200).end()
    });
  });
});