import productmongoose from "mongoose";

const product = new productmongoose.Schema({
    productID: {type: productmongoose.Schema.Types.Mixed, require: true},
    productName: {type: productmongoose.Schema.Types.Mixed, require: true},
    productPrice: Number,
    productQuantity: Number,
    previews: [{type: productmongoose.Schema.Types.Mixed, require: true}],
    addedBy: {
        accountID: {type: productmongoose.Schema.Types.Mixed, require: true},
        deviceID: {type: productmongoose.Schema.Types.Mixed, require: true}
    },
    dateAdded: {type: productmongoose.Schema.Types.Mixed, require: true}
});

export default productmongoose.models.Product || productmongoose.model("Product", product, "products");