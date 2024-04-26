const ordermongoose = require("mongoose");

const order = ordermongoose.Schema({
    orderID: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
    orderSet: [{type: userpermissionmongoose.Schema.Types.Mixed, require: true}],
    dateMade: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
    totalAmount: Number,
    receivedAmount: Number,
    orderMadeBy: {
        accountID: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
        deviceID: {type: userpermissionmongoose.Schema.Types.Mixed, require: true}
    },
    dateUpdated: {type: userpermissionmongoose.Schema.Types.Mixed, require: true}
});

module.exports = ordermongoose.model("Order", order, "orders");