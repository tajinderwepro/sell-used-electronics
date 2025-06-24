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
    if (error.response && [401].includes(error.response.status)) {
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
    getUsers: (data) => axiosWrapper(axiosInstance.post('/users/list',data)),
    getAllUsers: (data) => axiosWrapper(axiosInstance.post('/users/all-list',data)),
    createUser: (data) => axiosWrapper(axiosInstance.post('/auth/register', data)),
    getUser: (id) => axiosWrapper(axiosInstance.get(`/users/${id}`)),
    deleteUser: (id) => axiosWrapper(axiosInstance.delete(`/users/${id}`)),
    getLatestDevice: (id) => axiosWrapper(axiosInstance.get(`/admin/orders/latest-order`)),
    resetPassword: (id,data) => axiosWrapper(axiosInstance.post(`/auth/reset-password/${id}`, data)),

    // updateUser: (id, data) => axiosWrapper(axiosInstance.put(`/users/${id}`, data)),
     updateUser: (id,data) =>
      axiosWrapper(
        axiosInstance.put(
          `/users/${id}`,
          data,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
      ),
    createCategory: (data) =>
      axiosWrapper(
        axiosInstance.post(
          `admin/category/add-category`,
          data,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
      ),
    editCategory: (id, data) =>
      axiosWrapper(
        axiosInstance.put(
          `admin/category/update-category/${id}`,
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

    deleteCategory: (id) => axiosWrapper(axiosInstance.delete(`admin/category/delete-category/${id}`)),

    addBrand: (id, data) => axiosWrapper(
      axiosInstance.post(
        `admin/brand/add-brand/${id}`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      ), data
    ),

    editBrand: (id, data) => axiosWrapper(
      axiosInstance.put(
        `admin/brand/update-brand/${id}`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
    ),

    deleteBrand: (id) => axiosWrapper(axiosInstance.delete(`admin/brand/delete-brand/${id}`)),
    getBrand: (id, limit = 10, offset = 0) => axiosWrapper(axiosInstance.post(`admin/brand/list/${id}`, { limit, offset })),
    getAllBrand: (id, limit = 0, offset = 0) => axiosWrapper(axiosInstance.post(`admin/brand/all-list/${id}`, { limit, offset })),

    getModel: (id, limit = 10, offset = 0) =>
      axiosWrapper(
        axiosInstance.post(`admin/model/list/${id}`, {
          limit,
          offset
        })
      ),

    createModel: (id, data) => axiosWrapper(
      axiosInstance.post(
        `admin/model/add-model/${id}`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
    ),

    editModel: (id, data) => axiosWrapper(
      axiosInstance.put(
        `admin/model/update-model/${id}`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
    ),
    deleteModel: (id) => axiosWrapper(axiosInstance.delete(`/model/delete-model/${id}`)),

    getDevices: (data) => axiosWrapper(axiosInstance.post('admin/devices/list',data)),
    getAllDevices: (data) => axiosWrapper(axiosInstance.post('admin/devices/all-list',data)),
    getDevice: (id) => axiosWrapper(axiosInstance.get(`admin/devices/${id}`)),
    updateDevice: (id,data) => axiosWrapper(axiosInstance.put(`admin/devices/${id}`,data)),
    deleteDevice: (device_id) => axiosWrapper(axiosInstance.delete(`admin/devices/${device_id}`)),
    createDevice: (data) => axiosWrapper(axiosInstance.post('admin/devices/submit', data)),
    submit: (id,data) => axiosWrapper(axiosInstance.post(`admin/devices/submit/${id}`, data)),
    updateDeviceStatus: (device_id,data) => axiosWrapper(axiosInstance.put(`admin/devices/status/${device_id}`,data)),
    getOrders: (data) => axiosWrapper(axiosInstance.post('admin/orders/list',data)),

    quotes: {
      getList: (data) => axiosWrapper(axiosInstance.post('admin/quotes/list',data)),
      get: (id) => axiosWrapper(axiosInstance.get(`admin/quotes/${id}`)),
      getAllQuotes: (data) => axiosWrapper(axiosInstance.post('admin/quotes/all-list',data)),
      updateStatus: (quote_id,data) => axiosWrapper(axiosInstance.put(`admin/quotes/status/${quote_id}`,data)),
      update: (id,data) => axiosWrapper(axiosInstance.put(`admin/quotes/${id}`,data)),
      delete: (quote_id) => axiosWrapper(axiosInstance.delete(`admin/quotes/${quote_id}`)),
      create: (data) => axiosWrapper(axiosInstance.post('admin/quotes/submit', data)),
      submit: (id,data) => axiosWrapper(axiosInstance.post(`admin/quotes/submit/${id}`, data)),
    },
    orders:{
      get: (id) => axiosWrapper(axiosInstance.get(`admin/orders/${id}`)),
      
    },
    notes:{
      create: (data) => axiosWrapper(axiosInstance.post('notes/add',data)),
      noteList: () => axiosWrapper(axiosInstance.get('notes/list')),
    },
    payments:{
      pay: (id) => axiosWrapper(axiosInstance.get(`admin/payments/stripe/pay/${id}`)),
      getStatus: (id) => axiosWrapper(axiosInstance.get(`payments/stripe/status/${id}`)),
      stripeStatus: (id) => axiosWrapper(axiosInstance.get(`users/payments/stripe/connect/status/${id}`)),
      getList: (data) => axiosWrapper(axiosInstance.post('admin/payments/stripe/list',data)),
    },
    riskManagement: {
      getList: () => axiosWrapper(axiosInstance.get('admin/risk-management/list')),
      // get: (id) => axiosWrapper(axiosInstance.get(`admin/risk-management/${id}`)),
      // create: (data) => axiosWrapper(axiosInstance.post('admin/risk-management/submit', data)),
      // update: (id, data) => axiosWrapper(axiosInstance.put(`admin/risk-management/${id}`, data)),
      // delete: (id) => axiosWrapper(axiosInstance.delete(`admin/risk-management/${id}`)),
    },
  },
  getCategories: (limit = 10, offset = 0) => axiosWrapper(
    axiosInstance.post(`/category/list`, {
      limit,
      offset,
    
    })),
  getDevices: () => axiosWrapper(axiosInstance.get('admin/devices/list')),  
  auth: {
    getMe: () => axiosWrapper(axiosInstance.get(`/auth/me`)),
  },
  address: {
    get: (user_id) => axiosWrapper(axiosInstance.get(`/addresses/${user_id}`)),
    add: (user_id, data) => axiosWrapper(axiosInstance.post(`/addresses/${user_id}`, data)),
    deleteAddress: (id) => axiosWrapper(axiosInstance.delete(`/addresses/${id}`)),

  },
  public: {
    getEstimatePrice: (data) => axiosWrapper(axiosInstance.post(`/estimate-price`, data)),
    submit: (id, data) => axiosWrapper(
      axiosInstance.post(
        `/devices/submit/${id}`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
    ),
  },
  user: {
    getUserQuotes: (id, data) => axiosWrapper(axiosInstance.post(`/users/quotes/${id}`,data)),
    getUserOrders: (id, data) => axiosWrapper(axiosInstance.post(`/users/orders/${id}`,data)),
    requestShipment: (id) => axiosWrapper(axiosInstance.post(`/users/quotes/request-shipment/${id}`)),
    retryShipment: (id) => axiosWrapper(axiosInstance.post(`/users/quotes/retry-shipment/${id}`)),
    getUserPayments: (id, data) => axiosWrapper(axiosInstance.post(`users/payments/stripe/${id}`, data)),
    // getUserDevices: (id, data) => axiosWrapper(axiosInstance.post(`/users/devices/${id}`,data)),
  }
};

export { api, axiosInstance };
export default api;
