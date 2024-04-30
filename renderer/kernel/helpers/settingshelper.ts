import establishconnection from "../utils/establishconnection";

import UserPermission from '../schemas/userpermission';
import { makeID } from "../reusables/generatefns";

async function createPermissionID(initID: string) {
	return await establishconnection().then( async () => {
		return await UserPermission.find({ permissionID: initID }).then((result) => {
            if(result.length > 0){
                const generatedAccountID = "PRM_ID_" + makeID(15);
                createPermissionID(generatedAccountID);
            }
            else{
                return initID;
            }
        }).catch((err) => {
            throw new Error(err);
        })
	}).catch((err) => {
		console.log(err);
        throw new Error(err);
	})
}

export {
    createPermissionID
}