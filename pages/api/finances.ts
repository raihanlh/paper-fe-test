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

function getSequenceNextValue(collection, callback) {
  collection.findOneAndUpdate(
    { _id: "col_id" },
    { $inc: { seq_val: 1 } },
    { new: true }
  );
  collection.findOne({ _id: "col_id" }, callback);
}

function createFinance(
  db,
  title,
  debit_amount,
  credit_amount,
  description,
  finance_account_id,
  userId,
  callback
) {
  let collection = db.collection("finance");
  let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  getSequenceNextValue(collection, function (err, queryResult) {
    let id = queryResult.seq_val;
    collection.insertOne(
      {
        _id: id,
        title,
        debit_amount,
        credit_amount,
        description,
        finance_account_id,
        last_modified: date,
        created_at: date,
        deleted_at: null,
        userId
      },
      function (err, financeAccountCreated) {
        assert.equal(err, null);
        callback(financeAccountCreated);
      }
    );
  });
}

function findFinances(db, userId, callback) {
  let collection = db.collection("finance");
  collection.find({ userId }).toArray(callback);
}

export default (req, res) => {
  if (req.method === "GET") {
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

          findFinances(db, decoded.userId, function (err, result) {
            if (err) {
              res.status(500).json({
                error: true,
                message: "Error finding Finances"
              });
              return;
            }

            console.log("Result:");
            let data = [];
            result.forEach(record => {
              const {
                _id,
                title,
                debit_amount,
                credit_amount,
                description,
                finance_account_id,
                last_modified,
                created_at,
                deleted_at
              } = record;

              data.push({
                id: _id,
                title,
                debit_amount,
                credit_amount,
                description,
                finance_account_id,
                last_modified,
                created_at,
                deleted_at
              });
            });
            console.log(data);
            res.status(200).send({ data, total: data.length });
          });
        });
        return;
      } else {
        res.status(401).json({ error: true, message: "Unable to auth" });
      }
    }
  } else if (req.method === "POST") {
    if (!req.headers.authorization) {
      res.status(400).json({
        error: {
          code: 400,
          message: "access token required"
        }
      });
    }
    try {
      assert.notEqual(null, req.body.title, "Username required");
      assert.notEqual(null, req.body.debit_amount, "Password required");
      assert.notEqual(null, req.body.credit_amount, "Credit Amount required");
      assert.notEqual(null, req.body.description, "Description required");
      // assert.notEqual(null, req.body.finance_account_type, "Finance Account Type required");
      // assert.notEqual(null, req.body.finance_account_name, "Finance Account Name required");
      assert.notEqual(
        null,
        req.body.finance_account_id,
        "Finance Account Id required"
      );
    } catch (bodyError) {
      res.status(403).json({ error: true, message: bodyError.message });
    }
    // console.log(req);
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
          const title = req.body.title;
          const debit_amount = req.body.debit_amount;
          const credit_amount = req.body.credit_amount;
          const description = req.body.description;
          const finance_account_id = req.body.finance_account_id;
          const userId = decoded.userId;

          createFinance(
            db,
            title,
            debit_amount,
            credit_amount,
            description,
            finance_account_id,
            userId,
            function (creationResult) {
              if (creationResult.ops.length === 1) {
                res.status(204).json(creationResult.ops[0]);
                console.log(creationResult.ops[0]);
                return;
              }
            }
          );
        });
        return;
      } else {
        res.status(401).json({ error: true, message: "Unable to auth" });
      }
    } else {
      res.status(400).json({ error: true, message: "Authentication failed" });
    }
  }
};
