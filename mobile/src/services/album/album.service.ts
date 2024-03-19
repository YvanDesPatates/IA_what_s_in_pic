import axios from 'axios';
import {setAxiosBaseUrlFromSettings} from '../api';

function setBaseUrl() {
    setAxiosBaseUrlFromSettings();
}

export async function getAlbums(): Promise<any[]> {
    setBaseUrl();

    try {
        const response = await axios.get('/api/albums');

        if (response.status === 200 || response.status === 201) {
            console.log(response.data);

            return response.data;
        } else {
            throw new Error(
                `Login failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized access');
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
