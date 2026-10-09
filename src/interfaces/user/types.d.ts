export interface UserObj {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string | null;
    // "admin" | "coach" | "client". Missing on sessions saved before roles existed.
    role?: 'admin' | 'coach' | 'client';
}
export interface UserAuthState {
    success?: boolean;
    errors?: string[];
    user?: UserObj;
    token?: string;
    refreshToken?: string;
}
