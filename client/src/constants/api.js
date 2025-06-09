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
    createUser: (data) => axiosWrapper(axiosInstance.post('http://localhost:8000/api/v1/auth/register', data)),
    getUser : (id) => axiosWrapper(axiosInstance.get(`http://localhost:8000/api/v1/users/${id}`)),
    deleteUser : (id) => axiosWrapper(axiosInstance.delete(`http://localhost:8000/api/v1/users/${id}`)),

    updateUser : (id,data) => axiosWrapper(axiosInstance.put(`http://localhost:8000/api/v1/users/${id}`,data)),
    // categor,brand,model
    addCategory: (id,data) => axiosWrapper(axiosInstance.post(`http://localhost:8000/api/v1/devices/add-category`, data)),
    addModel : (id,data) => axiosWrapper(axiosInstance.post(`http://localhost:8000/api/v1/devices/add-model`),data),
    addBrand : (id,data) => axiosWrapper(axiosInstance.post(`http://localhost:8000/api/v1/devices/add-brand`),data),

    getCategory: () => axiosWrapper(axiosInstance.get(`http://localhost:8000/api/v1/devices/category`)),
    getModel : () => axiosWrapper(axiosInstance.get(`http://localhost:8000/api/v1/devices/model`)),
    getBrand : () => axiosWrapper(axiosInstance.get(`http://localhost:8000/api/v1/devices/brand`)),


    getDevices : () => axiosWrapper(axiosInstance.get('http://localhost:8000/api/v1/devices/list')),
    deleteDevice : (device_id) => axiosWrapper(axiosInstance.delete(`http://localhost:8000/api/v1/devices/${device_id}`)),
    // getDevices : () => axiosWrapper(axiosInstance.get('http://localhost:8000/api/v1/devices/list')),
    getOrders : () => axiosWrapper(axiosInstance.get('http://localhost:8000/api/v1/orders/list')),
    },

};

export { api, axiosInstance };
export default api;
