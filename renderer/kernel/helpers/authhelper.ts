import establishconnection from "../utils/establishconnection";

import UserAccount from '../schemas/useracccount';
import { makeID } from "../reusables/generatefns";

async function createUniqueAccountID(initID: string) {
	return await establishconnection().then( async () => {
		return await UserAccount.find({ accountID: initID }).then((result) => {
            if(result.length > 0){
                const generatedAccountID = "ACC_ID_" + makeID(15);
                createUniqueAccountID(generatedAccountID);
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
    createUniqueAccountID
}