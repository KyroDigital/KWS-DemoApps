import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Dropdown,
  Input,
  MediaPicker,
  Properties,
  Button,
  Loader,
} from 'components';
import { createNftAPI, getNftChainsAPI, getNftTypesAPI } from 'services';
import { createOptions, isArray, isExist, isObject } from 'helpers';
import { useAuth, useGlobalElements } from 'hooks';
import { ImageFormats, MIN_FILE_SIZE, VideoFormats } from 'utils';

const validationSchema = yup.object().shape({
  type: yup.number().required('Type is required'),
  chain: yup.number().required('Chain is required'),
  name: yup.string().required('Name is required'),
  description: yup.string(),
  price: yup
    .string()
    .required('Price is required')
    .matches(/^[0-9]*[1-9][0-9]*$/, 'Please enter a valid number'),
  supply: yup
    .string()
    .matches(/^[0-9]*[1-9][0-9]*$/, 'Please enter a valid number'),
  properties: yup
    .array()
    .test(
      'Type and Value cannot be empty',
      'Type and Value cannot be empty',
      function (item) {
        let newList = [],
          status = true;
        newList = item?.map((e) => {
          if (
            (isExist(e.trait_type) && isExist(e.value)) ||
            (!isExist(e.trait_type) && !isExist(e.value))
          ) {
            return true;
          } else if (isExist(e.trait_type) && !isExist(e.value)) {
            return false;
          }
        });
        status = newList.includes(false) ? false : true;
        return status;
      },
    ),
  media: yup
    .mixed()
    .nullable()
    .required()
    .test('required', 'Please upload Media for Listing', (value) =>
      isExist(value),
    )
    .test(
      'fileSize',
      'The file is too large',
      (value) => isExist(value) && value.size / 1000 <= MIN_FILE_SIZE,
    )
    .test(
      'fileType',
      'Selected type is not supported',
      (value) =>
        isExist(value) &&
        [...ImageFormats, ...VideoFormats].includes(value.type),
    ),
});

const CreateNFT = () => {
  const navigate = useNavigate();
  const { currentUser, developerUser, userExtraObj } = useAuth();
  const { showToast } = useGlobalElements();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [chains, setChains] = useState([]);
  const initialValues = {
    type: '',
    chain: '',
    name: '',
    description: '',
    properties: [{ trait_type: '', value: '' }],
    price: '',
    supply: '1',
    media: null,
    royalties: '',
  };

  useEffect(() => {
    const initProcess = async () => {
      const typeRes = await getNftTypesAPI();
      let chainRes = await getNftChainsAPI();
      setChains(createOptions(chainRes));
      setTypes(createOptions(typeRes));
      setIsLoading(false);
    };
    initProcess();
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: () => {
      handleCreate();
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    handleSubmit,
  } = formik;

  const getBodyParams = () => {
    const properties = values.properties.filter(
      (item) => isExist(item.trait_type) && isExist(item.value),
    );
    const nftProperties = properties.map((item) => {
      const { trait_type } = item;
      return {
        [trait_type.trim()]: item.value.trim(),
      };
    });
    return {
      user_id: currentUser.kyro_id,
      mintable_account_id: userExtraObj.default_account.sage_id,
      account_ids: developerUser.default_account.sage_id,
      account_shares: '100',
      nft_type: values.type,
      mintable_category_id: values.chain,
      name: values.name,
      description: values.description,
      supply: values.supply,
      price: values.price,
      nft_properties: isArray(nftProperties)
        ? JSON.stringify(nftProperties)
        : '',
      ufiles: ImageFormats.includes(values.media.type) ? values.media : '',
      vidfiles: VideoFormats.includes(values.media.type) ? values.media : '',
      is_kyro_test: '1',
    };
  };

  const handleCreate = async () => {
    setIsSubmit(true);
    const body = getBodyParams();
    const res = await createNftAPI({
      body,
    });
    console.log('Create NFT Response', res);
    if (isObject(res)) {
      showToast({
        message: 'Your NFT has been successfully created !!!',
        type: 'success',
      });
      navigate('/');
    } else {
      setIsSubmit(false);
      showToast({
        message: 'NFT Creation failed',
        type: 'danger',
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <section className='jumbotron no-bg'>
            <div className='container mt-5'>
              <div className='col-lg-7 offset-lg-1'>
                <h1>
                  Create <span className='color'>NFT</span>
                </h1>
              </div>
            </div>
          </section>

          <section className='container'>
            <div className='row'>
              <div className='col-lg-7 offset-lg-1 mb-5'>
                <div>
                  {/* ---------- Media Picker ---------- */}
                  <MediaPicker
                    name='media'
                    subHeading={
                      'File types supported: JPG, PNG, GIF, MP4 Max size: 8 MB'
                    }
                    heading={'Select Media'}
                    file={values.media}
                    handleChange={setFieldValue}
                    onBlur={handleBlur}
                    isError={touched.media && errors.media}
                  />

                  <div className='spacer-single'></div>

                  {/* ---------- Type ---------- */}

                  <Dropdown
                    heading={'Type'}
                    name='type'
                    value={values.type}
                    placeholder={'Select Type'}
                    onChange={handleChange}
                    isError={touched.type && errors.type}
                    onBlur={handleBlur}
                    options={types}
                  />

                  <div className='spacer-single'></div>

                  {/* ---------- Chain ---------- */}

                  <Dropdown
                    heading={'Chain'}
                    name='chain'
                    value={values.chain}
                    placeholder={'Select Chain'}
                    onChange={handleChange}
                    isError={touched.chain && errors.chain}
                    onBlur={handleBlur}
                    options={chains}
                  />

                  <div className='spacer-single'></div>

                  {/* ---------- Name ---------- */}

                  <Input
                    heading={'Name'}
                    type='text'
                    name='name'
                    value={values.name}
                    placeholder='NFT Name'
                    onChange={handleChange}
                    isError={touched.name && errors.name}
                    onBlur={handleBlur}
                  />

                  <div className='spacer-single'></div>

                  {/* ---------- Description ---------- */}

                  <h5>Description</h5>
                  <textarea
                    data-autoresize
                    rows='5'
                    name='description'
                    id='item_desc'
                    className='form-control'
                    placeholder='NFT Description'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <div className='spacer-single'></div>

                  {/* ---------- Price ---------- */}

                  <Input
                    heading={'Price'}
                    type='number'
                    name='price'
                    value={values.price}
                    placeholder='Enter price for one item'
                    onChange={handleChange}
                    isError={touched.price && errors.price}
                    onBlur={handleBlur}
                  />

                  <div className='spacer-single'></div>

                  {/* ---------- Supply ---------- */}

                  <Input
                    heading={'Number of Editions'}
                    type='number'
                    name='supply'
                    value={values.supply}
                    placeholder='Enter number of Editions'
                    onChange={handleChange}
                    isError={touched.supply && errors.supply}
                    onBlur={handleBlur}
                  />

                  <div className='spacer-single'></div>

                  {/* ---------- Properties ---------- */}

                  <Properties
                    heading={'Properties'}
                    name='properties'
                    properties={values.properties}
                    onChange={setFieldValue}
                    isError={touched.properties && errors.properties}
                    onBlur={handleBlur}
                  />

                  <div className='spacer-double'></div>
                  <div className='centered'>
                    <Button
                      isLoading={isSubmit}
                      onClick={handleSubmit}
                      classes='btn-main'
                      title={'Create Item'}
                      extraStyles={{ width: '20rem', height: '3rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default CreateNFT;
