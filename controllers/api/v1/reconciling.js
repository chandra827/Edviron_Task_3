const client = require("../../../config/mongoose");

let reconciledTransaction = [];

module.exports.reconciling = async function (req, res) {
  const db = client.db("test");
  const transactionCollection = db.collection("transactions");

  //reconcilled cheque Transaction

  const chequesTransaction = await transactionCollection
    .find({ payment_mode: "CHEQUE" })
    .toArray();

  chequesTransaction.map(async (chequeTransaction) => {
    const cheque = await db
      .collection("cheques")
      .find({ _id: chequeTransaction.cheque })
      .toArray();

    if (cheque && cheque.length > 0) {
      if (
        (cheque[0].status == "BOUNCED" &&
          chequeTransaction.status != "FAILED") ||
        (cheque[0].status == "CLEARED" &&
          chequeTransaction.status != "SUCCESS") ||
        (cheque[0].status == "PENDING" && chequeTransaction.status != "PENDING")
      ) {
        const trans = {
          transaction_id: chequeTransaction._id,
          transaction_status: chequeTransaction.status,
          cheque_status: cheque[0].status,
        };

        reconciledTransaction.push(trans);
      }
    } else {
      const trans = {
        transaction_id: chequeTransaction._id,
        transaction_status: chequeTransaction.status,
        cheque_status: "Cheque Status not found",
      };

      reconciledTransaction.push(trans);
    }
  });

  //reconcilled DD Transaction
  const DDTransaction = await transactionCollection
    .find({ payment_mode: "DEMAND_DRAFT" })
    .toArray();
  DDTransaction.map(async (DDTransaction) => {
    const DD = await db
      .collection("demanddrafts")
      .find({ _id: DDTransaction.dd })
      .toArray();

    if (DD && DD.length > 0) {
      if (
        (DD[0].status == "BOUNCED" && DDTransaction.status != "FAILED") ||
        (DD[0].status == "CLEARED" && DDTransaction.status != "SUCCESS") ||
        (DD[0].status == "PENDING" && DDTransaction.status != "PENDING")
      ) {
        const trans = {
          transaction_id: DDTransaction._id,
          transaction_status: DDTransaction.status,
          DD_status: DD[0].status,
        };

        reconciledTransaction.push(trans);
      }
    } else {
      const trans = {
        transaction_id: DDTransaction._id,
        transaction_status: DDTransaction.status,
        DD_status: "DD Status not found",
      };

      reconciledTransaction.push(trans);
    }
  });

  res.status(200).json({
    message: "Here are the reconciling transaction through check and DD",
    reconciledTransaction,
  });
};
