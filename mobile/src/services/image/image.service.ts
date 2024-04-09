import axios from 'axios';
import {setAxiosBaseUrlFromSettings} from '../api';

export type ImageUpload = {
    name: string;
    path: string;
    date: Date;
    albums: Number[];
    tags: string[];
    // imageByte: Buffer;
};

function setBaseUrl() {
    setAxiosBaseUrlFromSettings();
}

export async function uploadImage(imageUpload: ImageUpload): Promise<any> {
    setBaseUrl();

    try {
        const formData = new FormData();
        formData.append('image', {
            uri: imageUpload.path,
            name: imageUpload.name,
            type: 'image/webp',
        });

        formData.append('name', imageUpload.name);
        formData.append('date', imageUpload.date.toISOString());
        formData.append('albums', JSON.stringify(imageUpload.albums));
        formData.append('tags', JSON.stringify(imageUpload.tags));

        const response = await axios.post('/api/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}
