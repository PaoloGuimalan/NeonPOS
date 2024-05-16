import { OrdersListInterface } from "./interfaces";

export interface ActionProp {
    type: string,
    payload: any;
}

export interface ReusableModalProp {
    shaded: boolean;
    padded: boolean;
    children: React.ReactNode;
}

export interface OrdersItemProp {
    mp: OrdersListInterface;
}