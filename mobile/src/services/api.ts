import {QueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {store} from '../stores/store';

export const queryClient = new QueryClient();

function getBaseUrl() {
    const currentState = store.getState();
    const settingsState = currentState.settings;

    return settingsState.serverUrl;
}
export function setAxiosBaseUrl(url: string) {
    axios.defaults.baseURL = url;
}

export function setAxiosBaseUrlFromSettings() {
    const baseUrl = getBaseUrl();
    axios.defaults.baseURL = baseUrl;
}

export function withErrorCatch(callback: any) {
    return callback()
        .catch((error: any) => {
            // @ts-ignore
            const errorResponse = JSON.stringify(error?.response?.data);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error(`Unauthorized access ${errorResponse}`);
                } else {
                    throw new Error(
                        `An error occurred during the process: ${errorResponse}`,
                    );
                }
            } else {
                throw new Error(
                    `An unexpected error occurred: ${errorResponse}`,
                );
            }
        })
        .catch((error: any) => {
            console.error(error);
        });
}
