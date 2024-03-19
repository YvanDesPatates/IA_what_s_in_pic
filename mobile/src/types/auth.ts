export interface LoginPayload {
    email: string;
    pwd: string;
}

export interface LoginResponse {
    email: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface RegisterResponse {
    access_token: string;
}
