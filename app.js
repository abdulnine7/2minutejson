const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const util = require("./util");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Insert json in DB
app.post("/", async (req, res) => {
  util.removeOld(); //deleting data older than 2 minute
  const otp = await util.generateOTP();
  const data = await util.insertOne(otp, req.body.json);
  delete data._id;

  res.status(201).send({ data: data });
});

// Fetch json from DB
app.get("/:otp", async (req, res) => {
  util.removeOld(); //deleting data older than 2 minute
  const data = await util.fetchOne(parseInt(req.params.otp));
  util.removeOne(parseInt(req.params.otp));

  if (data == null) res.status(410).send({ error: "invalid otp or timeout." });
  else res.status(200).send(data);
});

// Handle production
if (process.env.NODE_ENV === "production") {
  // Static folder
  app.use(express.static(__dirname + "/public/"));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
