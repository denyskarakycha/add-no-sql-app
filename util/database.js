const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db; // the underscore is only here to signal that this will only be used internally in this file

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://denys:295q6722822@cluster0.fk2cpgo.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db()
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

