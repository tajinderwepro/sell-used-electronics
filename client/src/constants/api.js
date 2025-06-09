import axios from 'axios';

// Create an Axios instance with common headers
const axiosInstance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const axiosWrapper = (apiCall) =>
  apiCall.then(res => res.data).catch(err => Promise.reject(err));
// Define all API calls here
const api = {
  admin: {
    login: (data) => axiosWrapper(axiosInstance.post('http://localhost:8000/api/v1/auth/login', data)),
    getUsers : () => axiosWrapper(axiosInstance.get('http://localhost:8000/api/v1/users/list')),
    getDevices : () => axiosWrapper(axiosInstance.get('http://localhost:8000/api/v1/devices/list')),
    deleteDevice : (device_id) => axiosWrapper(axiosInstance.delete(`http://localhost:8000/api/v1/devices/${device_id}`)),
    // getDevices : () => axiosWrapper(axiosInstance.get('http://localhost:8000/api/v1/devices/list')),
    },

};

export { api, axiosInstance };
export default api;
