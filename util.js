const mongodb = require('mongodb');
const dbUrl = 'mongodb+srv://2minjson:coolworld@cluster0.do5w4.mongodb.net/Cluster0?retryWrites=true&w=majority';

// DB Connection
async function loadJSONCollection() {
  const client = await mongodb.MongoClient.connect(dbUrl,{ useNewUrlParser: true });
  return client.db('2minDb').collection('data');
}

// Generate 4 Digit OTP
async function generateOTP() {
  const collection = await loadJSONCollection();
  var otp = null;
  do {
    otp = Math.floor((Math.random() * 8999) + 1000); // random 4 digit no
  } while (await collection.findOne({ otp: otp }) != null);

  return otp;
}

// async function test(){
//   const collection = await loadJSONCollection();
//   const jsondata = await collection.findOneAndDelete({ otp: 8712});
//   console.log(jsondata);
// }
// test();

module.exports = {
  loadJSONCollection,
  generateOTP
}