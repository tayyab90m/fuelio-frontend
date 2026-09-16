export interface UserObj {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string | null;
}
export interface UserAuthState {
    success?: boolean;
    errors?: string[];
    user?: UserObj;
    token?: string;
    refreshToken?: string;
}
