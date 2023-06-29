'use strict';

const express = require('express');
const stripeLiveHuf = require('stripe')("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");
const stripeTestEur = require('stripe')("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");
const cors = require('cors');
const app = express();

var allowlist = ['https://work.rmail.hu', "http://localhost:3000", "https://insoulland.com"]; 
var corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
    /*if (allowlist.indexOf(origin) !== -1) {
    } else {
      callback(new Error('Not allowed by CORS'))
    }*/
  }
};

app.use(express.static('./public'));
app.use(express.json());
app.use(cors(corsOptions));
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({ message: err.message });
});

app.post('/create-payment-intent', function(request, res, next) {
  const amount = request.body.amount;
  const currency = request.body.currency;

  stripeLiveHuf.paymentIntents.create({ amount, currency }).
    then(intent => res.json({ secret: intent['client_secret'] })).
    catch(next);
});

app.post('/create-payment-intent-test', function(request, res, next) {
  const amount = request.body.amount;
  const currency = request.body.currency;

  stripeTestEur.paymentIntents.create({ amount, currency }).
    then(intent => res.json({ secret: intent['client_secret'] })).
    catch(next);
});

app.get('/test-me', function(req, res, next) {
  res.send("online");
});

app.get("/create-subscription", async (req, res) => {
  console.log(req.query.priceId);
  const session = await stripeTestEur.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: req.query.priceId,
        quantity: 1,
      },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: 'http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:8080/canceled',
  });

  res.redirect(303, session.url);
});

app.listen(process.env.PORT || 8080);