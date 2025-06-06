import { axiosInstance } from '../constants/api';

const setApiAuthenticationHeader = (accessToken = null) => {
  if (accessToken) {
    axiosInstance.defaults.headers.common.authorization = `Bearer ${accessToken}`;
  } else {
    delete axiosInstance.defaults.headers.common.authorization;
  }
};

export { setApiAuthenticationHeader };

export default setApiAuthenticationHeader;
