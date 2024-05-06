export interface LoginPayloadInterface {
    accountID: string;
    password: string;
    userID: string;
}

export interface RegisterAccountInterface {
    firstname: string;
    middlename: string;
    lastname: string;
    accountType: string;
    password: string;
    creatorAccountID: string;
    userID: string;
    deviceID: string;
}

export interface AddProductRequestInterface {
    productName: string;
    productPrice: number;
    productQuantity: number;
    accountID: string;
    category: string;
    deviceID: string;
    userID: string;
}

export interface CreateNewPermissionPayloadInterface {
    permissionType: string;
    allowedUsers: string[];
    userID: string;
    deviceID: string;
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

export interface ProductDataInterface {
    addedBy: {
        accountID: string, 
        deviceID: string
    }
    category: string;
    dateAdded: string;
    previews: string[];
    productID: string;
    productName: string;
    productPrice: number;
    productQuantity: number;
}

export interface CartItemInterface {
    product: ProductDataInterface;
    quantity: number;
}

export interface AlertsItem {
    id: number;
    type: string;
    content: string;
}

export interface InitialSetupDeviceVerificationRequestInterface {
    userID: string;
    deviceID: string;
}

export interface SettingsInterface {
    userID: string;
    deviceID: string;
    setup: string;
}