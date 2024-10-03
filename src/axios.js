import axios from 'axios';
import config from './config';

// Create an Axios instance
const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL, // Ensure this is correctly set in your environment variables
    withCredentials: true, // Include credentials in requests
});

// Response Interceptor
instance.interceptors.response.use(
    (response) => {
        // Return the response data directly
        return response.data;
    },
    (error) => {
        // Handle errors globally
        const { response } = error;
        if (response) {
            console.error('API Response Error:', response.status, response.data);
        } else {
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error); // Reject the promise with the error
    }
);

export default instance;
