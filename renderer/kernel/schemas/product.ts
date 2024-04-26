const productmongoose = require("mongoose");

const product = productmongoose.Schema({
    productID: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
    productName: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
    productPrice: Number,
    productQuantity: Number,
    previews: [{type: userpermissionmongoose.Schema.Types.Mixed, require: true}],
    addedBy: {
        accountID: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
        deviceID: {type: userpermissionmongoose.Schema.Types.Mixed, require: true}
    },
    dateAdded: {type: userpermissionmongoose.Schema.Types.Mixed, require: true}
});

module.exports = productmongoose.model("Product", product, "products")