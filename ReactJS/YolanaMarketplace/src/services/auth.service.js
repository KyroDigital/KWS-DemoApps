import api, { AUTH_TOKEN } from './request';
import { apiPaths, setLocalStorage, clearLocalStorage } from 'utils';
import { isApiSuccess, isExist } from 'helpers';

export const authLoginAPI = () => {
  // clearLocalStorage(AUTH_TOKEN);
  return api
    .post(apiPaths.authLogin, {
      token: process.env.REACT_APP_AUTH_KEY,
      secret: process.env.REACT_APP_AUTH_SECRET,
      is_new: '1',
    })
    .then((response) => {
      console.log({ response });
      if (response.data) {
        setLocalStorage(AUTH_TOKEN, response.data);
      }
      return response.data;
    });
};

export const getUserAPI = () => {
  return api
    .get(apiPaths.getUser)
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response.data;
      else return null;
    })
    .catch((error) => {
      console.log('Get User Addresses Api Error', error);
    });
};



export const registerUserOnkyro = (params) => {
  const body = {
    email: params.email,
    first_name: params.first_name,
    last_name: params.last_name,
    source_id: params.uid,
    pass: 'kyro',
  };
  return api
    .post(`/developer/users`, body)
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) {
        return response.data;
      }
      return null;
    })
    .catch((error) => {
      console.log('Error', error);
    });

  // api
  //   .get('/developer/users?user_id=6136928')
  //   .then((response) => {
  //     console.log({ response });
  //   })
  //   .catch((error) => {
  //     console.log('Get User Addresses Api Error', error);
  //   });
};

export const getDeveloperUserDetails = (kyroId) => {
  const params = { source_id: kyroId };
  return api
    .get('/developer/users', { params })
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) {
        return response.data;
      }
      return null;
    })
    .catch((error) => {
      console.log('Get Auth Verify Api Error', error);
    });
};
