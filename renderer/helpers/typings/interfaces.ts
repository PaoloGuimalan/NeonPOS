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
        userID: string,
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
    pendingID?: number;
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
    connectionToken: string;
}

export interface GetFilesListResponseNeonRemoteInterface{
    token: string;
}

export interface SettingsInterface {
    userID: string;
    deviceID: string;
    connectionToken: string;
    setup: string;
}

export interface InvoiceInterface {
    cartlist: CartItemInterface[];
    total: number;
    amountreceived: number;
    change: number;
}

export interface CreateOrderRequestInterface {
    orderSet: CartItemInterface[];
    totalAmount: number,
    receivedAmount: number,
    timeMade: string,
    status?: string,
    voidedFrom?: string,
    discount?: string,
    orderMadeBy: {
        accountID: string,
        userID: string,
        deviceID: string
    }
}

export interface ReceiptHolderInterface {
    cashier: string;
    orderID: string;
    deviceID: string;
    date: string;
    time: string;
    cartlist: CartItemInterface[];
    total: string;
    amount: string;
    change: string;
}

export interface OrdersListInterface {
    orderID: string,
    orderSet: CartItemInterface[],
    dateMade: string,
    timeMade?: string,
    totalAmount: number,
    receivedAmount: number,
    orderMadeBy: {
        accountID: string,
        userID: string,
        deviceID: string
    },
    dateUpdated: string,
    status?: string,
    voidedFrom?: string,
    discount?: string,
}

export interface CategoriesListInterface {
    categoryID: string;
    preview: string;
    categoryName: string,
    from: {
        accountID: string,
        userID: string,
        deviceID: string
    }
}