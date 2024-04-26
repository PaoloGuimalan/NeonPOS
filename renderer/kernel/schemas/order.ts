import ordermongoose from "mongoose";

const order = new ordermongoose.Schema({
    orderID: {type: ordermongoose.Schema.Types.Mixed, require: true},
    orderSet: [{type: ordermongoose.Schema.Types.Mixed, require: true}],
    dateMade: {type: ordermongoose.Schema.Types.Mixed, require: true},
    totalAmount: Number,
    receivedAmount: Number,
    orderMadeBy: {
        accountID: {type: ordermongoose.Schema.Types.Mixed, require: true},
        deviceID: {type: ordermongoose.Schema.Types.Mixed, require: true}
    },
    dateUpdated: {type: ordermongoose.Schema.Types.Mixed, require: true}
});

export default ordermongoose.model("Order", order, "orders");