'use strict';

const express = require('express');
const stripeLiveHuf = require('stripe')("sk_test_51Mtsz9BDk24l55XelH2Jx903NJ0mTfZuXagQOuFuTjBBk7rDTWKha8Ze01vH1OUQ78zUuzykOL2zN974VdkqM9BZ00Jioz6Ie4");
const stripeTestEur = require('stripe')("sk_test_51Mtsz9BDk24l55XelH2Jx903NJ0mTfZuXagQOuFuTjBBk7rDTWKha8Ze01vH1OUQ78zUuzykOL2zN974VdkqM9BZ00Jioz6Ie4");
const cors = require('cors');
const app = express();

var allowlist = ['https://work.rmail.hu', "http://localhost:3000"]; 
var corsOptions = {
  origin: function (origin, callback) {
    if (allowlist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
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

app.listen(process.env.PORT || 8080);