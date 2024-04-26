const usermongoose = require("mongoose");

const useraccount = usermongoose.Schema({
    accountID: {type: usermongoose.Schema.Types.Mixed, require: true},
    accountType: {type: usermongoose.Schema.Types.Mixed, require: true},
    accountName: {
        firstname: {type: usermongoose.Schema.Types.Mixed, require: true},
        middlename: {type: usermongoose.Schema.Types.Mixed},
        lastname: {type: usermongoose.Schema.Types.Mixed, require: true}
    },
    dateCreated: {type: usermongoose.Schema.Types.Mixed, require: true},
    createdBy: {
        accountID: {type: usermongoose.Schema.Types.Mixed, require: true},
        deviceID: {type: usermongoose.Schema.Types.Mixed, require: true}
    }
});

module.exports = usermongoose.model("UserAccount", useraccount, "useraccounts");