import { NextApiResponse, NextApiRequest } from 'next';
import establishconnection from "../../../kernel/utils/establishconnection";

import UserPermission from '../../../kernel/schemas/userpermission';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
	establishconnection().then(async () => {
		UserPermission.find({}).then((result) => {
            res.send({ status: true, result: result });
        }).catch((err) => {
            console.log(err);
            res.send({ status: false, message: "Error fetching permission" });
        })
	}).catch((err) => {
		console.log(err);
        res.send({ status: false, message: "Error establishing connection" });
	})
}