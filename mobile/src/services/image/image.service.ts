import axios from 'axios';
import {setAxiosBaseUrlFromSettings} from '../api';

function setBaseUrl() {
    setAxiosBaseUrlFromSettings();
}

// export async function uploadImage(clientId: string): Promise<LoginResponse> {
//     setBaseUrl();

//     const form = new FormData();

//     try {
//         const formData = new FData();
//         formData.append('image', {});

//         const response = await axios.post('/3/image', formData, {
//             headers: {
//                 Authorization: `Client-ID ${clientId}`,
//                 'Content-Type': 'multipart/form-data',
//             },
//         });

//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// }
