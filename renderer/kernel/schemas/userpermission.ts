const userpermissionmongoose = require("mongoose");

const userpermission = userpermissionmongoose.Schema({
    permissionID: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
    permissionType: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
    allowedUsers: [{type: userpermissionmongoose.Schema.Types.Mixed, require: true}],
    isEnabled: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
});

module.exports = userpermissionmongoose.model("UserPermission", userpermission, "userpermissions");