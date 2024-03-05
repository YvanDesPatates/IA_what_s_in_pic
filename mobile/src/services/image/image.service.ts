import axios from 'axios';
import {setAxiosBaseUrl} from '../api';
import FData from 'form-data';
import {Asset} from 'react-native-image-picker';
import {LoginResponse} from '../../types/auth';

function setBaseUrl() {
    setAxiosBaseUrl('http://localhost:3000/');
}

export async function uploadImage(
    clientId: string,
): Promise<LoginResponse> {
    setBaseUrl();

    const form = new FormData();

    try {
        const formData = new FData();
        formData.append('image', {});

        const response = await axios.post('/3/image', formData, {
            headers: {
                Authorization: `Client-ID ${clientId}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}
