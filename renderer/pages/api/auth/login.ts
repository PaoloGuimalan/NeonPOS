import { NextApiResponse, NextApiRequest } from 'next';
import establishconnection from "../../../kernel/utils/establishconnection";

import UserAccount from '../../../kernel/schemas/useracccount';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
	establishconnection().then(() => {
		const accountID = req.body.accountID;
		const password = req.body.password;
		UserAccount.aggregate([
			{
				$match: {
					$and: [
						{
							accountID: accountID
						},
						{
							password: password
						}
					]
				}
			},
			{
				$lookup: {
					from: "userpermissions",
					// localField: "accountType",
					// foreignField: "allowedUsers",
					let: { accountType: "$accountType" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $in: ["$$accountType", "$allowedUsers"] },
										{ $eq: [true, "$isEnabled"] }
									]
								}
							}
						}
					],
					as: "permissions"
				}
			},
			{
				$project: {
					"password": 0,
					"permissions._id": 0,
					"permissions.permissionID": 0,
					"permissions.allowedUsers": 0,
					"permissions.isEnabled": 0,
					"permissions.__v": 0
				}
			}
		]).then((result) => {
			res.send({ status: true, result: result });
		}).catch((err) => {
			res.send({ status: false, result: err });
		})
		// UserAccount.findOne({ accountID: accountID, password: password }, { password: 0 }).then((result) => {
		// 	res.send({ status: true, result: result });
		// }).catch((err) => {
		// 	res.send({ status: false, result: err });
		// })
	}).catch((err) => {
		console.log(err);
	})
}