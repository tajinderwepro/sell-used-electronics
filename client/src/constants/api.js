import axios from 'axios';
import { triggerSessionModal } from '../context/SessionContext';
import { API_SERVER } from '.';

axios.defaults.baseURL = API_SERVER;

const axiosInstance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      triggerSessionModal();
    }
    return Promise.reject(error);
  }
);

  const axiosWrapper = (apiCall) =>
    apiCall.then(res => res.data).catch(err => Promise.reject(err));

  const api = {
    admin: {
      login: (data) => axiosWrapper(axiosInstance.post('/auth/login', data)),
      getUsers : () => axiosWrapper(axiosInstance.get('/users/list')),
      createUser: (data) => axiosWrapper(axiosInstance.post('/auth/register', data)),
      getUser : (id) => axiosWrapper(axiosInstance.get(`/users/${id}`)),
      deleteUser : (id) => axiosWrapper(axiosInstance.delete(`/users/${id}`)),

      updateUser : (id,data) => axiosWrapper(axiosInstance.put(`/users/${id}`,data)),
    
      createCategory: (data) =>
        axiosWrapper(
          axiosInstance.post(
            `/category/add-category`,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          )
        ),
      getCategories: (limit = 10, offset = 0) => axiosWrapper(
               axiosInstance.post(`/category/list`, {
              limit,
              offset
      })),
      createModel: (id, data) => axiosWrapper(
        axiosInstance.post(
          `/model/add-model/${id}`,
          data,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
      ),


      addBrand : (id,data) =>   axiosWrapper(
          axiosInstance.post(
            `/brand/add-brand/${id}`,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          ),data
        ),
      

      getModel: (id, limit = 10, offset = 0) => 
          axiosWrapper(
            axiosInstance.post(`/model/list/${id}`, {
              limit,
              offset
            })
          ),
      getBrand : (id,limit = 10, offset = 0) => axiosWrapper(axiosInstance.post(`/brand/list/${id}`, {limit, offset})),


      getDevices : () => axiosWrapper(axiosInstance.get('/devices/list')),
      deleteDevice : (device_id) => axiosWrapper(axiosInstance.delete(`/devices/${device_id}`)),
      // getDevices : () => axiosWrapper(axiosInstance.get('/devices/list')),
      getOrders : () => axiosWrapper(axiosInstance.get('/orders/list')),
      },
    auth :{
      me : () => axiosWrapper(axiosInstance.get(`/auth/me`)),
    }
  };

export { api, axiosInstance };
export default api;
