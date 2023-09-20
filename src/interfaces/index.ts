export interface IRegisterUser {
    email: string;
    password: string;
    name: string;
    phone: string;
}

export interface ILogin {
    email: string;
    password: string;
    remember: boolean;
}
