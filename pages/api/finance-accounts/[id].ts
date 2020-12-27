import { type } from "os";
import { decode } from "punycode";

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const jwt = require("jsonwebtoken");
const jwtSecret = "SUPERSECRETE20220";
const moment = require("moment");

const url = "mongodb://localhost:27017";
const dbName = "paper-fe-test";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const findFinanceAccount = (db, userId, id, callback) => {
  let collection = db.collection("finance_account");
  collection.findOne({ _id: parseInt(id), userId }, callback);
};

const updateFinanceAccount = (
  db,
  userId,
  id,
  name,
  description,
  type,
  callback
) => {
  let collection = db.collection("finance_account");
  let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  collection.findOneAndUpdate(
    { _id: parseInt(id), userId },
    {
      $set: {
        name,
        description,
        type,
        last_modified: date
      }
    },
    { new: true },
    callback
  );
};

const deleteFinanceAccount = (db, userId, id, callback) => {
  let collection = db.collection("finance_account");
  // collection.deleteOne({ _id: parseInt(id), userId }, callback);
  let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  collection.findOneAndUpdate(
    { _id: parseInt(id), userId },
    {
      $set: {
        deleted_at: date
      }
    },
    { new: true },
    callback
  );
};

export default (req, res) => {
  if (req.method === "GET") {
    const accountId = req.query.id;
    if (!req.headers.authorization) {
      res.status(400).json({
        error: {
          code: 400,
          message: "access token required"
        }
      });
    }
    let auth = req.headers.authorization.split(" ");
    if (auth[0] === "Bearer") {
      let decoded;
      if (auth[1]) {
        try {
          decoded = jwt.verify(auth[1], jwtSecret);
        } catch (e) {
          console.error(e);
        }
      }
      if (decoded) {
        client.connect(function (err) {
          assert.equal(null, err);
          console.log("Connected to MongoDB server =>");
          const db = client.db(dbName);

          findFinanceAccount(db, decoded.userId, accountId, (err, account) => {
            if (err) {
              res.status(500).json({
                error: true,
                message: "Error finding Finance Account"
              });
              return;
            }
            if (!account) {
              res
                .status(404)
                .json({ error: true, message: "Account not found" });
              return;
            } else {
              res.status(200).json({
                name: account.name,
                description: account.description,
                type: account.type,
                last_modified: account.last_modified,
                created_at: account.created_at,
                deleted_at: account.deleted_at
              });
              return;
            }
          });
        });
      } else {
        res.status(401).json({ error: true, message: "Unable to auth" });
      }
    }
  } else if (req.method === "PATCH") {
    try {
      assert.notEqual(null, req.body.name, "Username required");
      assert.notEqual(null, req.body.description, "Description required");
      assert.notEqual(null, req.body.type, "Type required");
    } catch (bodyError) {
      res.status(403).json({ error: true, message: bodyError.message });
    }
    if (!req.headers.authorization) {
      res.status(400).json({
        error: {
          code: 400,
          message: "access token required"
        }
      });
    }
    const accountId = req.query.id;
    let auth = req.headers.authorization.split(" ");
    if (auth[0] === "Bearer") {
      let decoded;
      if (auth[1]) {
        try {
          decoded = jwt.verify(auth[1], jwtSecret);
        } catch (e) {
          console.error(e);
        }
      }
      if (decoded) {
        client.connect(function (err) {
          assert.equal(null, err);
          console.log("Connected to MongoDB server =>");
          const db = client.db(dbName);
          const name = req.body.name;
          const description = req.body.description;
          const type = req.body.type;

          updateFinanceAccount(
            db,
            decoded.userId,
            accountId,
            name,
            description,
            type,
            (err, account) => {
              if (err) {
                res.status(500).json({
                  error: true,
                  message: "Error finding Finance Account"
                });
                return;
              }
              if (!account) {
                res
                  .status(404)
                  .json({ error: true, message: "Account not found" });
                return;
              } else {
                res.status(204).json({});
                return;
              }
            }
          );
        });
      } else {
        res.status(401).json({ error: true, message: "Unable to auth" });
      }
    }
  } else if (req.method === "DELETE") {
    if (!req.headers.authorization) {
      res.status(400).json({
        error: {
          code: 400,
          message: "access token required"
        }
      });
    }
    const accountId = req.query.id;
    let auth = req.headers.authorization.split(" ");
    if (auth[0] === "Bearer") {
      let decoded;
      if (auth[1]) {
        try {
          decoded = jwt.verify(auth[1], jwtSecret);
        } catch (e) {
          console.error(e);
        }
      }
      if (decoded) {
        client.connect(function (err) {
          assert.equal(null, err);
          console.log("Connected to MongoDB server =>");
          const db = client.db(dbName);

          deleteFinanceAccount(db, decoded.userId, accountId, (err, result) => {
            if (err) {
              res.status(500).json({
                error: true,
                message: "Error finding Finance Account"
              });
              return;
            }
            if (!result) {
              res
                .status(404)
                .json({ error: true, message: "Account not found" });
              return;
            } else {
              res.status(204).json({});
              return;
            }
          });
        });
      } else {
        res.status(401).json({ error: true, message: "Unable to auth" });
      }
    }
  }
};
