const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const util = require("./util");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Static folder
app.use(express.static(__dirname + "/public/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Insert json in DB
app.post("/", async (req, res) => {
  util.removeOld(); //deleting data older than 2 minute
  const otp = await util.generateOTP();
  const data = await util.insertOne(otp, req.body.json);
  if (data != null) delete data._id;

  if (data == null)
    res
      .status(503)
      .send({ error: "unable to process request at this moment." });
  else res.status(201).send({ data: data });
});

// Fetch json from DB
app.get("/json/", async (req, res) => {
  util.removeOld(); //deleting data older than 2 minute
  const data = await util.fetchOne(parseInt(req.query.otp));
  if (data != null) delete data._id;
  util.removeOne(parseInt(req.query.otp));

  if (data == null) res.status(410).send({ error: "invalid otp or timeout." });
  else res.status(200).send(data);
});

// Handle SPA
app.get(/.*/, (req, res) => {
  res.redirect(301, req.protocol + "://" + req.get("host"));
});

//const port = process.env.PORT || 5000;
//app.listen(port, () => console.log(`Server started on port ${port}`));

app.listen(process.env.PORT || 5000, function() {
  console.log(
    "2Minute{JSON} Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});

