import { NextApiResponse, NextApiRequest } from 'next';
import establishconnection from "../../../kernel/utils/establishconnection";

import UserAccount from '../../../kernel/schemas/useracccount';
import { createUniqueAccountID } from '../../../kernel/helpers/authhelper';
import { dateGetter, makeID } from '../../../kernel/reusables/generatefns';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
	establishconnection().then(async () => {
        const firstname = req.body.firstname;
        const middlename = req.body.middlename;
        const lastname = req.body.lastname;

        const accountType = req.body.accountType;
        const password = req.body.password;

        const creatorAccountID = req.body.creatorAccountID;

        const newAccountID = await createUniqueAccountID("ACC_ID_" + makeID(15));
		const newaccount = new UserAccount({
            accountID: newAccountID,
            accountType: accountType,
            accountName: {
                firstname: firstname,
                middlename: middlename,
                lastname: lastname
            },
            password: password,
            dateCreated: dateGetter(),
            createdBy: {
                accountID: creatorAccountID,
                deviceID: "DVC_47497429610967951139"
            }
        })

        // res.send({ status: true, message: "Account creation has been stalled" });

        newaccount.save().then(() => {
            res.send({ status: true, message: "Admin account has been created" })
        })
	}).catch((err) => {
		console.log(err);
        res.send({ status: false, message: "Error creating account" });
	})
}