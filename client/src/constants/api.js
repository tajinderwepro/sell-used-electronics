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
      editCategory: (id,data) =>
        axiosWrapper(
          axiosInstance.put(
            `/category/update-category/${id}`,
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

      deleteCategory : (id) => axiosWrapper(axiosInstance.delete(`/category/delete-category/${id}`)),

      addBrand : (id,data) =>   axiosWrapper(
          axiosInstance.post(
            `/brand/add-brand/${id}`,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          ),data
        ),

      editBrand : (id,data) =>   axiosWrapper(
          axiosInstance.put(
            `/brand/update-brand/${id}`,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          )
        ),

      deleteBrand : (id) => axiosWrapper(axiosInstance.delete(`/brand/delete-brand/${id}`)),
      getBrand : (id,limit = 10, offset = 0) => axiosWrapper(axiosInstance.post(`/brand/list/${id}`, {limit, offset})),

      getModel: (id, limit = 10, offset = 0) => 
          axiosWrapper(
            axiosInstance.post(`/model/list/${id}`, {
              limit,
              offset
            })
          ),

      createModel: (id, data) => axiosWrapper(
        axiosInstance.post(
          `/model/add-model/${id}`,
          data,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
      ),  
      
      editModel: (id, data) => axiosWrapper(
        axiosInstance.put(
          `/model/update-model/${id}`,
          data,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
      ),
      deleteModel : (id) => axiosWrapper(axiosInstance.delete(`/model/delete-model/${id}`)),


      getDevices : () => axiosWrapper(axiosInstance.get('/devices/list')),
      deleteDevice : (device_id) => axiosWrapper(axiosInstance.delete(`/devices/${device_id}`)),
      // getDevices : () => axiosWrapper(axiosInstance.get('/devices/list')),
      getOrders : () => axiosWrapper(axiosInstance.get('/orders/list')),
      },
      getCategories: (limit = 10, offset = 0) => axiosWrapper(
               axiosInstance.post(`/category/list`, {
              limit,
              offset
      })),
    auth :{
      me : () => axiosWrapper(axiosInstance.get(`/auth/me`)),
    },
    address:{
      get : (user_id) => axiosWrapper(axiosInstance.get(`/addresses/${user_id}`)),
      add : (user_id, data) => axiosWrapper(axiosInstance.post(`/addresses/${user_id}`,data)),
    },
    public:{
      getEstimatePrice : (data) => axiosWrapper(axiosInstance.post(`/devices/estimate-price`,data)),
      submit : (data) => axiosWrapper(axiosInstance.post(`/devices/submit`,data)),
    }
  };

export { api, axiosInstance };
export default api;
