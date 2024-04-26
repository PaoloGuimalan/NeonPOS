import { NextApiResponse, NextApiRequest } from 'next';
import establishconnection from "../../../kernel/utils/establishconnection";

import UserAccount from '../../../kernel/schemas/useracccount';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
	establishconnection().then(() => {
		const accountID = req.body.accountID;
		const password = req.body.password;
		UserAccount.findOne({ accountID: accountID, password: password }).then((result) => {
			res.send({ status: true, result: result });
		}).catch((err) => {
			res.send({ status: false, result: err });
		})
	}).catch((err) => {
		console.log(err);
	})
}