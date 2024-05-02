import { NextApiResponse, NextApiRequest } from 'next';
import establishconnection from "../../../kernel/utils/establishconnection";

import Product from '../../../kernel/schemas/product';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
	establishconnection().then(async () => {
        Product.find({}).then((result) => {
            res.send({ status: true, result: result });
        }).catch((err) => {
            res.send({ status: false, message: "Error fetching product list" });
        })

        // res.send({ status: true, message: "Account creation has been stalled" });
	}).catch((err) => {
		console.log(err);
        res.send({ status: false, message: "Error establishing connection" });
	})
}