import api from './request';
import { apiPaths } from 'utils';
import { isApiSuccess } from 'helpers';

export const getAddressesAPI = ({ customerId }) => {
  const params = {
    customer_id: customerId,
    is_kyro_test: '1',
  };
  return api
    .get(`/customers/${customerId || 0}/addresses`, { params })
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response.addresses;
      else return null;
    })
    .catch((error) => {
      console.log('Get User Api Error', error);
    });
};

export const createAddressAPI = ({ body }) => {
  return api
    .post(`${apiPaths.userAddresses}/${body.cust_id || 0}/addresses`, body)
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response.addresses;
      else return null;
    })
    .catch((error) => {
      console.log('Error', error);
    });
};


export const getCardsAPI = ({ customerId }) => {
  const params = {
    customer_id: customerId,
    is_kyro_test: '1',
  };
  return api
    .get(`/customers/${customerId}/cards`, { params })
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response.cards;
      else return null;
    })
    .catch((error) => { 
      console.log('Get User Cards Api Error', error);
    });
};

export const createCardAPI = ({ body }) => {
  return api
    .post(`${apiPaths.userAddresses}/${body.customer_id || 0}/cards`, body)
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response;
      else return null;
    })
    .catch((error) => {
      console.log('Error', error);
    });
};

export const createDefaultAccountAPI = async ({ params }) => {
  const body = {
    country: 'US',
    capabilities: 'card_payments, transfers',
    business_type: 'individual',
    is_own_account: '1',
    send_email: '0',
    basic_detail_done: '0',
    create_crypto_wallet: '1',
    is_default_account: '1',
    ...params,
  };
  return api
    .post(`${apiPaths.accounts}`, body)
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response;
      else return null;
    })
    .catch((error) => {
      console.log('Error', error);
    });
};
