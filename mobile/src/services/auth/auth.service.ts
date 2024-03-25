import axios from 'axios';
import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
} from '../../types/auth';
import {setAxiosBaseUrlFromSettings, withErrorCatch} from '../api';

function setBaseUrl() {
    setAxiosBaseUrlFromSettings();
}

export const login = async (
    loginPayload: LoginPayload,
): Promise<LoginResponse> =>
    withErrorCatch(async () => {
        setBaseUrl();

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
    });

export const register = async (
    registerPayload: RegisterPayload,
): Promise<RegisterResponse> =>
    withErrorCatch(async () => {
        setBaseUrl();

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
    });
