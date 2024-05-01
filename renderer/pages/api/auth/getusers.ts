import { NextApiResponse, NextApiRequest } from 'next';
import establishconnection from "../../../kernel/utils/establishconnection";

import UserAccount from '../../../kernel/schemas/useracccount';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
	establishconnection().then(async () => {
        UserAccount.find({}, { password: 0 }).then((result) => {
            res.send({ status: true, result: result });
        }).catch((err) => {
            console.log(err);
            res.send({ status: false, message: "Error fetching accounts" });
        })
	}).catch((err) => {
		console.log(err);
        res.send({ status: false, message: "Error establishing connection" });
	})
}