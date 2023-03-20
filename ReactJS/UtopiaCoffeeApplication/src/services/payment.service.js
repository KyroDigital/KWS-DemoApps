import { loadStripe } from '@stripe/stripe-js';
import { isApiSuccess } from 'helpers';
import { apiPaths } from 'utils';
import api from './request';

const paymentError = 'sorry could not compute your transaction.';

export const createStripeToken = async ({ card, type }) => {
  try {
    var stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);
    const elements = stripe.elements();
    var cardElement = elements.create('card');
    cardElement.update({ value: card });
    console.log({ cardElement, card });

    const token = await stripe.createToken(cardElement);
    console.log({ token });
    if (!token.error) {
      return { token: token.tokenId };
    }
    return { error: token.error.message || paymentError };
  } catch (err) {
    return { error: err.message || paymentError };
  }
};

export const purchaseAPI = ({ body }) => {
  return api
    .post(apiPaths.purchase, body)
    .then((response) => {
      console.log({ response });
      if (isApiSuccess(response)) return response;
      else return null;
    })
    .catch((error) => {
      console.log('Purchase Error', error);
    });
};
