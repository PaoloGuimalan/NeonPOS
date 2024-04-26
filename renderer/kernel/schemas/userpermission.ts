import userpermissionmongoose from "mongoose";

const userpermission = new userpermissionmongoose.Schema({
    permissionID: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
    permissionType: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
    allowedUsers: [{type: userpermissionmongoose.Schema.Types.Mixed, require: true}],
    isEnabled: {type: userpermissionmongoose.Schema.Types.Mixed, require: true},
});

export default userpermissionmongoose.model("UserPermission", userpermission, "userpermissions");