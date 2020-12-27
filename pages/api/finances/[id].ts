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

const findFinance = (db, userId, id, callback) => {
  let collection = db.collection("finance");
  collection.findOne({ _id: parseInt(id), userId }, callback);
};

async function findFinanceAccountById(db, id) {
  let collection = db.collection("finance_account");
  try {
    const result = await collection.findOne({ _id: parseInt(id) });

    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
}

const updateFinance = (
  db,
  id,
  userId,
  title,
  debit_amount,
  credit_amount,
  description,
  finance_account_id,
  callback
) => {
  let collection = db.collection("finance");
  let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  collection.findOneAndUpdate(
    { _id: parseInt(id), userId },
    {
      $set: {
        title,
        debit_amount,
        credit_amount,
        description,
        finance_account_id
      }
    },
    { new: true },
    callback
  );
};

const deleteFinance = (db, userId, id, callback) => {
  let collection = db.collection("finance");
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
  if (!req.headers.authorization) {
    res.status(400).json({
      error: {
        code: 400,
        message: "access token required"
      }
    });
  }
  if (req.method === "GET") {
    const financeId = req.query.id;
    let auth = req.headers.authorization.split(" ");
    if (auth[0] === "Bearer") {
      let decoded;
      if (auth[1]) {
        try {
          decoded = jwt.verify(auth[1], jwtSecret);
        } catch (e) {
          console.log(e);
        }
      }
      if (decoded) {
        client.connect(function (err) {
          assert.equal(null, err);
          console.log("Connected to MongoDB server =>");
          const db = client.db(dbName);

          findFinance(db, decoded.userId, financeId, (err, finance) => {
            if (err) {
              res.status(500).json({
                error: true,
                message: "Error finding Finance"
              });
              return;
            }
            if (!finance) {
              res
                .status(404)
                .json({ error: true, message: "Finance not found" });
              return;
            } else {
              res.status(200).json({
                title: finance.title,
                debit_amount: finance.debit_amount,
                credit_amount: finance.credit_amount,
                description: finance.description,
                finance_account_id: finance.finance_account_id,
                last_modified: finance.last_modified,
                created_at: finance.created_at,
                deleted_at: finance.deleted_at
              });
              return;
            }
          });
        });
      } else {
        res.status(401).json({ error: true, message: "Unable to auth" });
      }
    }
  }
  if (req.method === "PATCH") {
    const financeId = req.query.id;
    let auth = req.headers.authorization.split(" ");
    if (auth[0] === "Bearer") {
      let decoded;
      if (auth[1]) {
        try {
          decoded = jwt.verify(auth[1], jwtSecret);
        } catch (e) {
          console.log(e);
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

          updateFinance(
            db,
            decoded.userId,
            financeId,
            title,
            debit_amount,
            credit_amount,
            description,
            finance_account_id,
            (err, finance) => {
              if (err) {
                res.status(500).json({
                  error: true,
                  message: "Error finding Finance"
                });
                return;
              }
              if (!finance) {
                res
                  .status(404)
                  .json({ error: true, message: "Finance not found" });
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
  }
  if (req.method === "DELETE") {
    const financeId = req.query.id;
    let auth = req.headers.authorization.split(" ");
    if (auth[0] === "Bearer") {
      let decoded;
      if (auth[1]) {
        try {
          decoded = jwt.verify(auth[1], jwtSecret);
        } catch (e) {
          console.log(e);
        }
      }
      if (decoded) {
        client.connect(function (err) {
          assert.equal(null, err);
          console.log("Connected to MongoDB server =>");
          const db = client.db(dbName);

          deleteFinance(db, decoded.userId, financeId, (err, finance) => {
            if (err) {
              res.status(500).json({
                error: true,
                message: "Error finding Finance"
              });
              return;
            }
            if (!finance) {
              res
                .status(404)
                .json({ error: true, message: "Finance not found" });
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
