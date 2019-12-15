require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const app = express();
const port = process.env.PORT || 4000;
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  forceTLS: true
});

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // for POST route - incoming remote resources
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
}

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/*
 *   - POST Route -
 *  The frontend app will send requests to this route containing mouse events,
 *  and other data required to show updates to other users.
 *
 *  The request body will be sent as the data for the triggered Pusher event.
 *  The same object will be sent as a response to the user.
 *
 *  The trigger is achieved using the trigger method which takes the trigger identifier
 *  (painting), an event name (draw), and a payload.
 */
app.post('/paint', (req, res) => {
    console.log("paint event received")
    pusher.trigger('painting', 'action', req.body);
    res.json(req.body);
    console.log("paint events dispatched to sibling clients")
})


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});