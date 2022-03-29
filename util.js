const nedb = require("nedb");

db = new nedb({ filename: "ne.db", autoload: true });
db.ensureIndex(
  {
    fieldName: "otp",
    unique: true,
    sparse: true,
  },
  function (err) {}
);

async function generateOTP() {
  var otp = null;
  do {
    otp = Math.floor(Math.random() * 8999 + 1000); // random 4 digit no
  } while ((await fetchOne(otp)) != null);

  return otp;
}

async function insertOne(otp, json) {
  return new Promise((resolve, reject) => {
    const tempJSON = {
      otp: parseInt(otp),
      createdAt: new Date().getTime(),
      json: json,
    };

    db.insert(tempJSON, function (err, newdoc) {
      if (err !== null) reject(error);
      resolve(newdoc);
    });
  });
}

async function fetchOne(otp) {
  return new Promise((resolve, reject) => {
    db.findOne({ otp: parseInt(otp) }, function (err, doc) {
      if (err !== null) reject(error);
      resolve(doc);
    });
  });
}

async function removeOne(otp) {
  return new Promise((resolve, reject) => {
    db.remove({ otp: parseInt(otp) }, {}, function (err, numRemoved) {
      if (err !== null) reject(error);
      resolve(numRemoved);
    });
  });
}

async function removeOld() {
  return new Promise((resolve, reject) => {
    const twoMinAgo = new Date().getTime() - 120000;
    db.remove(
      { createdAt: { $lt: twoMinAgo } },
      { multi: true },
      function (err, numRemoved) {
        if (err !== null) reject(error);
        resolve(numRemoved);
      }
    );
  });
}

module.exports = {
  generateOTP,
  insertOne,
  fetchOne,
  removeOne,
  removeOld,
};
