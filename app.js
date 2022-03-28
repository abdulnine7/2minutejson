const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const util = require('./util')

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});

// Insert json in DB
app.post('/', async (req, res) => {
  const collection = await util.loadJSONCollection();
  const otp = await util.generateOTP();
  await collection.insertOne({
    otp: otp,
    json: req.body.json,
    createdAt: new Date(),

  });
  res.status(201).send({ otp: otp });
});

// Fetch json from DB
app.get('/:otp', async (req, res) => {
  const collection = await util.loadJSONCollection();
  const data = await collection.findOneAndDelete({ otp: parseInt(req.params.otp) });
  // console.log(data.value);
  if(data.value == null){
    res.status(410).send({"error": "invalid otp or timeout."})
  }else {
    res.status(200).send(data.value);
  }
});

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));