import api from './request';
import { apiPaths } from 'utils';
import { isApiSuccess } from 'helpers';

export const getAppObject = () => {
  return api
    .get(`${apiPaths.app}/${process.env.REACT_APP_KYRO_APP_ID}`, {
      params: {
        user_id: '3737370',
        mode: 'display',
        is_test: '0',
      },
    })
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response.data;
      else return null;
    })
    .catch((error) => {
      console.log('Get App Details Api Error', error);
    });
};
