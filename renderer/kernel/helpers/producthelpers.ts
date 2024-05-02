import establishconnection from "../utils/establishconnection";

import Product from '../schemas/product';
import { makeID } from "../reusables/generatefns";

async function createUniqueProductID(initID: string) {
	return await establishconnection().then( async () => {
		return await Product.find({ productID: initID }).then((result) => {
            if(result.length > 0){
                const generatedAccountID = "PRD_ID_" + makeID(15);
                createUniqueProductID(generatedAccountID);
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
    createUniqueProductID
}