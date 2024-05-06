export interface ActionProp {
    type: string,
    payload: any;
}

export interface ReusableModalProp{
    shaded: boolean;
    padded: boolean;
    children: React.ReactNode;
}