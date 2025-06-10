import axios from 'axios';

const axiosInstance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [403].includes(error.response.status)) {
      console.warn('Unauthorized or expired token. Logging out...');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      window.location.href = '/login';  
    }
    return Promise.reject(error);
  }
);

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
    // addBrand : (data) => axiosWrapper(axiosInstance.post(`http://localhost:8000/api/v1/brand/add-brand`),data),
      addBrand: (data) =>
      axiosWrapper(
        axiosInstance.post(
          `http://localhost:8000/api/v1/brand/add-brand`,
          data,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
      ),

    getCategory: () => axiosWrapper(axiosInstance.get(`http://localhost:8000/api/v1/category/list`)),
    getModel : () => axiosWrapper(axiosInstance.get(`http://localhost:8000/api/v1/model/list`)),
    getBrand : () => axiosWrapper(axiosInstance.get(`http://localhost:8000/api/v1/brand/list`)),

    getDevices : () => axiosWrapper(axiosInstance.get('http://localhost:8000/api/v1/devices/list')),
    deleteDevice : (device_id) => axiosWrapper(axiosInstance.delete(`http://localhost:8000/api/v1/devices/${device_id}`)),
    // getDevices : () => axiosWrapper(axiosInstance.get('http://localhost:8000/api/v1/devices/list')),
    getOrders : () => axiosWrapper(axiosInstance.get('http://localhost:8000/api/v1/orders/list')),
    },
  auth :{
    me : () => axiosWrapper(axiosInstance.get(`http://localhost:8000/api/v1/auth/me`)),
  }
};

export { api, axiosInstance };
export default api;
