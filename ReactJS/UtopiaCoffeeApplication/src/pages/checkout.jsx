import {
  Button,
  Loader,
  ObjectBox,
  AddressObject,
  CardsObject,
  AddAddressForm,
  NewCardModal,
  Input,
} from 'components';
import { useAuth, useGlobalElements } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  createAddressAPI,
  getAddressesAPI,
  getCardsAPI,
  purchaseAPI,
} from 'services';
import PropTypes from 'prop-types';
import { ifExist, isArray, isObject, toCurrencyFormat } from 'helpers';
import {
  AmericanExpress,
  Diners,
  Discover,
  JCB,
  Mastercard,
  UnionPay,
  Visa,
} from 'assets/images';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Modal from 'react-bootstrap/Modal';

const validationSchema = yup.object().shape({
  first_name: yup.string().required('First Name required'),
  last_name: yup.string().required('Last Name required'),
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

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userExtraObj } = useAuth();
  const { showToast } = useGlobalElements();
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchaseLoading, setPurchaseLoading] = useState(false);
  const [nftDetails, setNftDetails] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [selectedCard, setSelectedCard] = useState({});
  const [addressModal, setAddressModal] = useState(false);
  const [cardsModal, setCardsModal] = useState(false);
  // const isPurchaseEnable = currentUser?.cust_id ?? null;

  useEffect(() => {
    if (location.state?.data) {
      setNftDetails(location.state.data);
    } else {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const initProcess = async () => {
      await fetchAddresses();
      await fetchCards();
      setIsLoading(false);
    };
    userExtraObj && initProcess();
  }, [userExtraObj]);

  const fetchAddresses = async () => {
    const addressRes = await getAddressesAPI({
      customerId: userExtraObj.cust_id,
    });
    if (addressRes) {
      setAddresses(addressRes);
      setSelectedAddress(addressRes.find((d) => d.is_default === 1));
    }
  };

  const fetchCards = async () => {
    const cardsRes = await getCardsAPI({
      customerId: userExtraObj.cust_id,
    });

    if (cardsRes) {
      setCards(cardsRes);
      setSelectedCard(cardsRes.find((d) => d.is_default === '1'));
    }
  };

  const handlePurchase = async () => {
    if (isObject(selectedAddress) && isObject(selectedCard)) {
      setPurchaseLoading(true);
      const apiParams = {
        product_id: nftDetails.sage_id,
        user_mailing_address_id: selectedAddress?.id.toString(),
        source: 'web',
        payment_currency: 'USD',
        card_id: selectedCard?.id.toString(),
        user_id: currentUser.kyro_id,
      };
      console.log({ apiParams });
      const response = await purchaseAPI({ body: apiParams });
      console.log({ apiParams, response });
      setPurchaseLoading(false);
      if (response) {
        showToast({
          message: 'Transaction successful',
          type: 'success',
        });
        navigate('/');
      } else {
        showToast({
          message: 'Transaction Failed',
          type: 'danger',
        });
      }
    } else {
      showToast({
        message: 'Please Select Card and Addresses for Purchase',
        type: 'info',
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className='jumbotron'>
          <div className='row g-2 p-3 g-lg-5 p-lg-5'>
            <div className='col-sm-12 col-md-8'>
              <div className='row align-items-center gy-4'>
                <div className='col-sm-12 col-md-6 col-lg-4'>
                  <ObjectBox
                    image={
                      nftDetails.image_url_large ||
                      nftDetails.image_url_medium ||
                      nftDetails.image_url_small
                    }
                  />
                </div>
                <div className='col-sm-12 col-md-6 col-lg-4 mx-md-2'>
                  <h4>{nftDetails.name}</h4>
                  <h6 className='text'>
                    Edition {nftDetails.nft_data.edition_number}/
                    {nftDetails.nft_data.total_editions}
                  </h6>
                </div>
              </div>
              <>
                <div className='mt-5'>
                  <h5>Select Address</h5>
                  <div>
                    {addresses.slice(0, 3).map((address, index) => {
                      return (
                        <AddressObject
                          key={index}
                          addressDetails={address}
                          checked={selectedAddress?.id ?? ''}
                          onChange={setSelectedAddress}
                        />
                      );
                    })}
                    <Button
                      onClick={() => setAddressModal(true)}
                      classes='btn-sec mt-4'
                      title={'Add Address'}
                      extraStyles={{ width: '10rem' }}
                    />
                  </div>
                </div>

                <div className='mt-5'>
                  <h5>Select Payment Method</h5>
                  <div>
                    {cards.map((card, index) => {
                      return (
                        <CardsObject
                          key={index}
                          cardDetails={card}
                          checked={selectedCard?.id ?? ''}
                          onChange={setSelectedCard}
                        />
                      );
                    })}
                    <Button
                      onClick={() => setCardsModal(true)}
                      classes='btn-sec mt-4'
                      title={'Add Card'}
                      extraStyles={{ width: '10rem' }}
                    />
                  </div>
                </div>
              </>
            </div>
            <div className='col-sm-12 col-md-4'>
              <h3>Order Summary</h3>
              <div className='nft__item mt-4'>
                <div className='d-flex justify-content-between'>
                  <h6>SubTotal</h6>
                  <h6>
                    <strong>{toCurrencyFormat(nftDetails.price)}</strong>
                  </h6>
                </div>
                <hr className='hr' />
                <div className='d-flex justify-content-between'>
                  <h4>Total</h4>
                  <h4>
                    <strong>
                      {toCurrencyFormat(parseInt(nftDetails.price))}
                    </strong>
                  </h4>
                </div>
              </div>
              <div className='nft__item mt-4'>
                <h6>
                  <small>Accepted Payment Methods</small>
                </h6>
                <div className='d-flex justify-content-between align-items-center flex-wrap'>
                  <AmericanExpress height={'5rem'} width={'5rem'} />
                  <Visa height={'5rem'} width={'5rem'} />
                  <Mastercard height={'5rem'} width={'5rem'} />
                  <JCB height={'5rem'} width={'5rem'} />
                  <Discover height={'5rem'} width={'5rem'} />
                  <UnionPay height={'5rem'} width={'5rem'} />
                  <Diners height={'5rem'} width={'5rem'} />
                </div>
              </div>
              <div className='mt-5 centered'>
                <Button
                  isLoading={isPurchaseLoading}
                  onClick={handlePurchase}
                  extraStyles={{ width: '11rem', height: '3rem' }}
                  classes='btn-main'
                  title={'Proceed'}
                />
              </div>
            </div>
          </div>
        </section>
      )}
      <AddressModal
        open={addressModal}
        handleClose={async ({ isRefresh, data }) => {
          setAddressModal(false);
          if (isRefresh) {
            if (isArray(data)) {
              setSelectedAddress(data[data.length - 1]);
              setAddresses(data);
            } else fetchAddresses();
          }
        }}
      />
      <NewCardModal
        open={cardsModal}
        handleClose={({ isRefresh, data }) => {
          setCardsModal(false);
          if (isRefresh) {
            if (isObject(data)) {
              setSelectedCard(data);
              const newCards = [...cards];
              newCards.push(data);
              setCards([...newCards]);
            } else fetchCards();
          }
        }}
      />
    </>
  );
};

export default Checkout;

const plainObj = {
  first_name: '',
  last_name: '',
  address: '',
  address2: '',
  city: '',
  zipCode: '',
  state: 'AL',
  country: 'US',
};

const AddressModal = ({ open, handleClose }) => {
  const { currentUser, userExtraObj } = useAuth();
  const { showToast } = useGlobalElements();
  const [isSubmit, setIsSubmit] = useState(false);
  const formik = useFormik({
    initialValues: plainObj,
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const { values, handleChange, touched, errors, handleSubmit, setFieldValue } =
    formik;
  const onSubmit = async (values) => {
    setIsSubmit(true);
    const response = await createAddressAPI({
      body: {
        ...values,
        user_id: currentUser.kyro_id,
        cust_id: userExtraObj.cust_id,
        type: 'mailing',
        is_default: 1,
        phone: currentUser.phone,
        email: currentUser.email,
      },
    });
    if (isArray(response)) {
      showToast({
        message: 'Address Added successfully !!!',
        type: 'success',
      });
      handleClose({ isRefresh: true, data: response });
    } else {
      showToast({
        message: 'Something went wrong, Please Try Again',
        type: 'danger',
      });
    }
    setIsSubmit(false);
  };
  return (
    <Modal show={open} onHide={() => handleClose({})} centered>
      <Modal.Header
        closeButton
        className='modalBackground'
        closeVariant='black'>
        <Modal.Title>Add Address</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBackground'>
        <div>
          <div className='d-flex justify-content-between'>
            <Input
              placeholder='First Name'
              name='first_name'
              type='text'
              value={values.first_name}
              onChange={handleChange}
              isError={touched.first_name && ifExist(errors.first_name)}
              style={{ width: '48%' }}
            />
            <Input
              placeholder='Last Name'
              name='last_name'
              type='text'
              value={values.last_name}
              onChange={handleChange}
              isError={touched.last_name && ifExist(errors.last_name)}
              style={{ width: '48%' }}
            />
          </div>
          <AddAddressForm
            handleChange={handleChange}
            form={values}
            touched={touched}
            errors={errors}
            setFieldValue={setFieldValue}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className='modalBackground '>
        <Button
          isLoading={isSubmit}
          onClick={handleSubmit}
          classes='btn-main inline'
          type='submit'
          title={'Add'}
          extraStyles={{ width: '8rem', height: '3rem' }}
        />
      </Modal.Footer>
    </Modal>
  );
};

AddressModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
