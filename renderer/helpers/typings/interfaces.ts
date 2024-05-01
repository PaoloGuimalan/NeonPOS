export interface LoginPayloadInterface {
    accountID: string;
    password: string;
}

export interface RegisterAccountInterface {
    firstname: string;
    middlename: string;
    lastname: string;
    accountType: string;
    password: string;
    creatorAccountID: string;
}

export interface CreateNewPermissionPayloadInterface {
    permissionType: string;
    allowedUsers: string[];
}

export interface AuthenticationInterface {
    auth: boolean | null,
    user: {
        accountID: string,
        accountType: string,
        accountName: {
            firstname: string,
            middlename: string,
            lastname: string
        },
        permissions: string[],
        dateCreated: string,
        createdBy: {
            accountID: string,
            deviceID: string
        }
    }
}

export interface PermissionInterface {
    permissionID: string;
    permissionType: string;
    allowedUsers: string[];
    isEnabled: boolean;
}

export interface UserAccountInterface {
    accountID: string,
    accountType: string,
    accountName: {
        firstname: string,
        middlename: string,
        lastname: string
    },
    dateCreated: string,
    createdBy: {
        accountID: string,
        deviceID: string
    }
}