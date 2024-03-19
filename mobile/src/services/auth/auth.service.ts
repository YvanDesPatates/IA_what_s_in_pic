import axios from 'axios';
import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
} from '../../types/auth';
import {setAxiosBaseUrlFromSettings} from '../api';

function setBaseUrl() {
    setAxiosBaseUrlFromSettings();
}

export async function login(
    loginPayload: LoginPayload,
): Promise<LoginResponse> {
    setBaseUrl();

    try {
        const payload: LoginPayload = {
            email: loginPayload.email,
            pwd: loginPayload.pwd,
        };
        const response = await axios.post<LoginResponse>('/api/login', payload);

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(
                `Login failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Invalid username or password');
            } else {
                throw new Error(
                    `An error occurred during the login process: ${error.message}`,
                );
            }
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}

export async function register(
    registerPayload: RegisterPayload,
): Promise<RegisterResponse> {
    setBaseUrl();

    try {
        const response = await axios.post<RegisterResponse>(
            '/api/accounts',
            registerPayload,
        );

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(
                `Register failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {            
            if (error.response?.status === 400) {
                throw new Error('Invalid registration data');
            } else {
                throw new Error(
                    `An error occurred during the registration process: ${error.message}`,
                );
            }
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}
