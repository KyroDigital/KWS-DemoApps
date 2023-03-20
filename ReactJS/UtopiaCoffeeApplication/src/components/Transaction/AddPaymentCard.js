import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import { Button, AddAddressForm } from 'components';
import * as yup from 'yup';
import { isExist } from 'helpers';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { useAuth, useGlobalElements } from 'hooks';
import { createCardAPI } from 'services';

const cardValidation = yup.object().shape({
  address: yup.string().required('Address required'),
  address2: yup.string().notRequired(),
  city: yup.string().required('city required'),
  zipCode: yup
    .string()
    .required('Zip is required')
    .matches(/^[0-9]*[1-9][0-9]*$/, 'Please enter a valid number'),
  state: yup.string().required('State required'),
  country: yup.string().required('Country required'),
});

const CardInputWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 8px 8px;
`;

const cardObj = {
  address: '',
  address2: '',
  city: '',
  zipCode: '',
  state: 'AL',
  country: 'US',
};
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      backgroundColor: 'white',
      width: '50%',
      color: '#000',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#a2a2a2',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const NewCardModal = ({ open, handleClose }) => {
  const { currentUser, userExtraObj } = useAuth();
  const { showToast } = useGlobalElements();
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmit, setIsSubmit] = useState(false);

  const formik = useFormik({
    initialValues: cardObj,
    validationSchema: cardValidation,
    validateOnChange: false,
    onSubmit: () => {
      onSubmit();
    },
  });

  const { values, handleChange, touched, errors, handleSubmit, setFieldValue } =
    formik;

  const onSubmit = async () => {
    setIsSubmit(true);
    const address = {
      address_line1: values.address,
      address_line2: values.address2,
      address_city: values.city,
      address_state: values.state,
      address_country: values.country,
      address_zip: values.zipCode,
    };
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardNumberElement);
    const result = await stripe.createToken(card, address);
    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log({ result });
      const body = {
        token: result.token.id,
        user_id: currentUser.kyro_id,
        email: currentUser.email,
        save_card: '1',
        customer_id: userExtraObj.cust_sage_id,
        category_id: '24660',
        is_kyro_test: '1',
      };
      const response = await createCardAPI({ body });
      if (response) {
        showToast({
          message: 'Card Added successfully !!!',
          type: 'success',
        });
        handleClose({ isRefresh: true, data: response.active });
      } else {
        showToast({
          message: 'Something went wrong, Please Try Again',
          type: 'danger',
        });
      }
    }
    setIsSubmit(false);
  };

  return (
    <Modal show={open} onHide={() => handleClose({})} centered>
      <Modal.Header
        closeButton
        className='modalBackground'
        closeVariant='black'>
        <Modal.Title>New Card</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBackground centered'>
        <div
          style={{
            height: '65vh',
            width: '100%',
          }}>
          <div className=''>
            <h6>Card Number</h6>
            <CardInputWrapper>
              <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
            </CardInputWrapper>
          </div>
          <div className='spacer-half' />
          <div className='d-flex justify-content-between'>
            <div style={{ width: '15rem' }}>
              <h6>Expiration Date</h6>
              <CardInputWrapper>
                <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
              </CardInputWrapper>
            </div>
            <div style={{ width: '10rem' }}>
              <h6>CVC</h6>
              <CardInputWrapper>
                <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
              </CardInputWrapper>
            </div>
          </div>
          <div
            style={{
              marginTop:
                !isExist(errors.expMonth) && !isExist(errors.expYear)
                  ? '1rem'
                  : '',
            }}>
            <h5 className='mb-0'>Billing Address</h5>
          </div>
          <AddAddressForm
            handleChange={handleChange}
            form={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className='modalBackground'>
        <Button
          isLoading={isSubmit}
          classes='btn-main inline'
          type='submit'
          onClick={handleSubmit}
          title={'Add'}
          extraStyles={{ width: '8rem', height: '3rem' }}
        />
      </Modal.Footer>
    </Modal>
  );
};

NewCardModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

export { NewCardModal };
