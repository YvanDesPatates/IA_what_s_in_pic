import axios from 'axios';
import {setAxiosBaseUrlFromSettings, withErrorCatch} from '../api';

function setBaseUrl() {
    setAxiosBaseUrlFromSettings();
}

export const getAlbums = async (): Promise<any[]> =>
    withErrorCatch(async () => {
        setBaseUrl();

        const response = await axios.get('/api/albums');

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(
                `getAlbums failed with status code: ${response.status}`,
            );
        }
    });

export const createAlbum = async (album: any): Promise<any> =>
    withErrorCatch(async () => {
        setBaseUrl();

        const response = await axios.post('/api/albums', album);

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(
                `createAlbum failed with status code: ${response.status}`,
            );
        }
    });

export const updateAlbum = async (album: any): Promise<any> =>
    withErrorCatch(async () => {
        setBaseUrl();

        const response = await axios.put(`/api/albums/${album.id}`, album);

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(
                `updateAlbum failed with status code: ${response.status}`,
            );
        }
    });

export const deleteAlbum = async (album: any): Promise<any> =>
    withErrorCatch(async () => {
        setBaseUrl();

        const response = await axios.delete(`/api/albums/${album.id}`);

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(
                `deleteAlbum failed with status code: ${response.status}`,
            );
        }
    });

