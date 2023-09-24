export interface IRegisterUser {
    email: string;
    password: string;
    name: string;
    phone: string;
    gender: boolean;
    birthday: Date;
}

export interface ILogin {
    email: string;
    password: string;
    remember: boolean;
}
