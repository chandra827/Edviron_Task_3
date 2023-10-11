const client = require("../../../config/mongoose");

module.exports.disbursing = async function (req, res) {
  const db = client.db("test");
  const transactionCollection = db.collection("transactions");
  let paymentForSchools = {};

  const successTransactions = await transactionCollection
    .find({ status: { $in: ["SUCCESS", "Success"] } })
    .toArray();

  for (const trans of successTransactions) {
    let paymentStatus = "UNKONWN";

    if (trans.payment_mode === "ONLINE" || trans.payment_mode === "CASH") {
      paymentStatus = "CLEARED";
    }

    if (trans.payment_mode === "CHEQUE") {
      const cheque = await db
        .collection("cheques")
        .findOne({ _id: trans.cheque });
      if (cheque && cheque.status === "CLEARED") {
        paymentStatus = "CLEARED";
      }
    } else if (trans.payment_mode === "DEMAND_DRAFT") {
      const DD = await db.collection("demanddrafts").findOne({ _id: trans.dd });
      if (DD && DD.status === "CLEARED") {
        paymentStatus = "CLEARED";
      }
    }

    if (paymentStatus === "CLEARED") {
      if (paymentForSchools.hasOwnProperty(trans.school)) {
        paymentForSchools[trans.school] += trans.amount || 0;
      } else {
        paymentForSchools[trans.school] = trans.amount || 0;
      }
    }
  }

  res.status(200).json({
    message: "Payment to each school based on schoollID",
    paymentForSchools,
  });
};
