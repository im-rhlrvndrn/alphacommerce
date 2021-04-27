import axios from 'axios';

export const instance = axios.create({
    baseURL: 'http://localhost:4000',
    withCredentials: true,
});

export const postRequest = async (url, data = {}) => {
    try {
        const response = await instance.post(url, data);
        return response;
    } catch (error) {
        console.log(error);
    }
};

export default instance;
