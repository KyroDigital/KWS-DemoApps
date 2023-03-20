import axios from 'axios';
import AES from 'crypto-js/aes';
import { isApiSuccess, isObject } from 'helpers';
import { getLocalStorage, setLocalStorage } from 'utils';
import { authLoginAPI } from './auth.service';

const API_URL = process.env.REACT_APP_API_URL;

export const AUTH_TOKEN = '@token';

const onRequest = (config) => { 
  const headers = {
    Accept: 'application/json',
    'x-api-key': process.env.REACT_APP_AUTH_KEY,
    'Content-Type': 'application/json',
  };
  const customProps = config.customProps || {};
  if (customProps && customProps.isFileUpload) {
    const dataObj = isObject(config.customProps.bodyData)
      ? config.customProps.bodyData
      : config.data;
    config.customProps.bodyData = Object.assign({}, dataObj);
    headers['Content-Type'] = 'multipart/form-data';
    const formData = new FormData();
    Object.keys(dataObj).forEach((key) => {
      formData.append(key, dataObj[key]);
    });
    config.data = formData;
  }
  const authData = getLocalStorage(AUTH_TOKEN);
  if (authData) {
    const accessToken = authData.split('-')[0];
    const cipherText = AES.encrypt(accessToken, 'projBENTOsecKEY42').toString();
    headers['Auth-Token'] = cipherText;
  }
  config.headers = headers;
  return config;
};

const onRequestError = (error) => {
  return Promise.reject(error);
};

const onResponse = (response) => {
  return response.data;
};

const onResponseError = async (error) => {
  const { response } = error;
  if (response && response.status === 401) {
    if (response.data.access === 'token_expired') {
      const authData = getLocalStorage(AUTH_TOKEN);
      const refToken = authData.split('-')[1];
      try {
        const res = await axios.post(
          `${API_URL}auth/refresh`,
          {
            refresh_token: refToken,
          },
          {
            headers: {
              'x-api-key': process.env.REACT_APP_AUTH_KEY,
            },
          },
        );
        if (isApiSuccess(res.data)) {
          const { data } = res.data;
          setLocalStorage(AUTH_TOKEN, data);
          return instance(error.config);
        }
      } catch (_error) {
        return Promise.reject(_error);
      }
    } else if (response.data.access === 'not_authorized') {
      const res = await authLoginAPI();
      if (res) {
        return instance(error.config);
      }
    }
  }
  return Promise.reject(error);
};

export const setupInterceptorsTo = (axiosInstance) => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

const instance = setupInterceptorsTo(
  axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
);

export default instance;
