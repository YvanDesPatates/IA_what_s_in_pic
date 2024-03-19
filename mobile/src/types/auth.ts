export interface LoginPayload {
    email: string;
    pwd: string;
}

export interface LoginResponse {
    email: string;
    name: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    pwd: string;
}

export interface RegisterResponse {
    email: string;
    name: string;
}
