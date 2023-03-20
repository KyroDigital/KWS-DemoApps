import { isApiSuccess } from 'helpers';
import { apiPaths } from 'utils';
import api from './request';

export const createNftAPI = async ({ body }) => {
  return api
    .post(apiPaths.createNft, body, {
      customProps: { isFileUpload: true },
    })
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response;
      else return null;
    })
    .catch((error) => {
      console.log('Create NFT Error', error);
    });
};

export const mintNftAPI = ({ params }) => {
  return api
    .post(apiPaths.mintNft, params)
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response;
      else return null;
    })
    .catch((error) => {
      console.log('Mint NFT Error', error);
    });
};

export const getProductsAPI = ({ page, userId }) => {
  const params = {
    limit: 12,
    page: page || 1,
    category_id: '24660',
    user_id: userId,
    is_test: '1',
    mode: 'modify',
    is_developer: '1',
    is_kyro_test: '1',
  };
  return api
    .get(apiPaths.getProducts, { params })
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response.products;
      else return null;
    })
    .catch((error) => {
      console.log('Get Products Error', error);
    });
};

export const getProductDetailsAPI = ({ productId }) => {
  const params = {
    product_id: productId,
    user_id: '3737370',
  };
  return api
    .get(`/products/${productId}`, params)
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response.product;
      else return null;
    })
    .catch((error) => {
      console.log('Get Product Details Error', error);
    });
};

export const getNftTypesAPI = () => {
  const params = {
    type: 'catsearch',
    ctag: 'NFT Type',
    parent_id: 24742,
    account_id: '',
  };
  return api
    .post(apiPaths.categorySearch, params)
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response.data;
      else return null;
    })
    .catch((error) => {
      console.log('Get NFT Type Error', error);
    });
};

export const getNftChainsAPI = () => {
  const params = {
    type: 'catsearch',
    ctag: 'Mintable NFT Definitions',
    parent_id: '24711',
    account_id: '',
  };
  return api
    .post(apiPaths.categorySearch, params)
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response.data;
      else return null;
    })
    .catch((error) => {
      console.log('Get NFT Type Error', error);
    });
};
