import { NextApiResponse, NextApiRequest } from 'next';
import establishconnection from "../../../kernel/utils/establishconnection";

import UserAccount from '../../../kernel/schemas/useracccount';
import { createUniqueAccountID } from '../../../kernel/helpers/authhelper';
import { makeID } from '../../../kernel/reusables/generatefns';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
	establishconnection().then(async () => {
        const newAccountID = await createUniqueAccountID("ACC_ID_" + makeID(15));
		const newaccount = new UserAccount({
            accountID: newAccountID,
            accountType: "Admin",
            accountName: {
                firstname: "John Paulo Ramil",
                middlename: "Portes",
                lastname: "Guimalan"
            },
            password: "123456789",
            dateCreated: "04/26/2024",
            createdBy: {
                accountID: newAccountID,
                deviceID: "DVC_47497429610967951139"
            }
        })

        res.send({ status: true, message: "Account creation has been stalled" });

        // newaccount.save().then(() => {
        //     res.send({ status: true, message: "Admin account has been created" })
        // })
	}).catch((err) => {
		console.log(err);
        res.send({ status: false, message: "Error creating account" });
	})
}