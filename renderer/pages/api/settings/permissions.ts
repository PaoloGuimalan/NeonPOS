import { NextApiResponse, NextApiRequest } from 'next';
import establishconnection from "../../../kernel/utils/establishconnection";

import UserPermission from '../../../kernel/schemas/userpermission';
import { makeID } from '../../../kernel/reusables/generatefns';
import { createPermissionID } from '../../../kernel/helpers/settingshelper';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
	establishconnection().then(async () => {
		const newPermissionID = await createPermissionID("PRM_ID_" + makeID(15));
		const newpermission = new UserPermission({
            permissionID: newPermissionID,
            permissionType: "navigate_account",
            allowedUsers: ["Admin", "Manager"],
            isEnabled: true,
        })

        res.send({ status: true, message: "Permission creation has been stalled" });

        // newpermission.save().then(() => {
        //     res.send({ status: true, message: "Permission has been created" })
        // })
	}).catch((err) => {
		console.log(err);
        res.send({ status: false, message: "Error creating permission" });
	})
}