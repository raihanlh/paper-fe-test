const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const bcrypt = require("bcrypt");
const v4 = require("uuid").v4;
const jwt = require("jsonwebtoken");
const jwtSecret = "SUPERSECRETE20220";
const moment = require("moment");

const saltRounds = 10;
const url = "mongodb://localhost:27017";
const dbName = "paper-fe-test";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

function findUser(db, username, callback) {
  const collection = db.collection("user");
  collection.findOne({ username }, callback);
}

function createUser(db, username, password, name, callback) {
  const collection = db.collection("user");
  let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    collection.insertOne(
      {
        userId: v4(),
        username,
        password: hash,
        name,
        last_login: date
      },
      function (err, userCreated) {
        assert.equal(err, null);
        callback(userCreated);
      }
    );
  });
}

export default (req, res) => {
  if (req.method === "POST") {
    // signup
    try {
      assert.notEqual(null, req.body.username, "Username required");
      assert.notEqual(null, req.body.password, "Password required");
      assert.notEqual(null, req.body.name, "Name required");
    } catch (bodyError) {
      res.status(403).json({ error: true, message: bodyError.message });
    }

    // verify username does not exist already
    client.connect(function (err) {
      assert.equal(null, err);
      console.log("Connected to MongoDB server =>");
      const db = client.db(dbName);
      const username = req.body.username;
      const password = req.body.password;
      const name = req.body.name;

      findUser(db, username, function (err, user) {
        if (err) {
          res.status(500).json({ error: true, message: "Error finding User" });
          return;
        }
        if (!user) {
          // proceed to Create
          createUser(db, username, password, name, function (creationResult) {
            if (creationResult.ops.length === 1) {
              const user = creationResult.ops[0];
              const token = jwt.sign(
                { userId: user.userId, username: user.username },
                jwtSecret,
                {
                  expiresIn: 3000 //50 minutes
                }
              );
              res.status(200).json({ token });
              return;
            }
          });
        } else {
          // User exists
          res.status(403).json({ error: true, message: "username exists" });
          return;
        }
      });
    });
  } else {
    // Handle any other HTTP method
    res.status(200).json({ users: ["John Doe"] });
  }
};
