import { NextApiResponse, NextApiRequest } from 'next';
import establishconnection from "../../../kernel/utils/establishconnection";

import Product from '../../../kernel/schemas/product';
import { dateGetter, makeID } from '../../../kernel/reusables/generatefns';
import { createUniqueProductID } from '../../../kernel/helpers/producthelpers';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
	establishconnection().then(async () => {
        const productName = req.body.productName;
        const productPrice = req.body.productPrice;
        const productQuantity = req.body.productQuantity;
        const category = req.body.category;

        const accountID = req.body.accountID;

        const newProductID = await createUniqueProductID("PRD_ID_" + makeID(15));
        const newproduct = new Product({
            productID: newProductID,
            productName: productName,
            productPrice: productPrice,
            productQuantity: productQuantity,
            category: category,
            previews: [
                "https://firebasestorage.googleapis.com/v0/b/neon-systems.appspot.com/o/pos%2Fproducts%2F214-2143190_food-plate-black-and-white-hd-png-download.png?alt=media&token=615ad1b6-7598-4a35-accc-a2cc6150c6fa"
            ],
            addedBy: {
                accountID: accountID,
                deviceID: "DVC_47497429610967951139"
            },
            dateAdded: dateGetter()
        })

        newproduct.save().then(() => {
            res.send({ status: true, message: "Product creation has been successful" });
        }).catch((err) => {
            console.log(err);
            res.send({ status: false, message: "Error saving product" });
        })

        // res.send({ status: true, message: "Account creation has been stalled" });
	}).catch((err) => {
		console.log(err);
        res.send({ status: false, message: "Error establishing connection" });
	})
}