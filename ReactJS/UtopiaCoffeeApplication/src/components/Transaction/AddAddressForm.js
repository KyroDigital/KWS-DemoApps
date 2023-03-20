import React, { useState, useCallback } from 'react';
import { Input, Dropdown } from 'components';
import { PropTypes } from 'prop-types';
import { ifExist, isExist } from 'helpers';
import { stripeCountry, US_STATES } from 'utils/Constants/common';

export const AddAddressForm = ({
  form,
  handleChange,
  errors,
  touched,
  setFieldValue,
}) => {
  const [isStateTxtField, setStateTxtField] = useState(false);
  const onChange = useCallback(
    (field, value) => {
      if (field === 'country') {
        setFieldValue(field, value);
        if (value != 'US') {
          setFieldValue('state', '');
        }
        setStateTxtField(value !== 'US');
      } else if (field === 'state') {
        setFieldValue(field, value);
      }
    },
    [form],
  );
  return (
    <>
      <div
        className='d-flex justify-content-center'
        style={{ marginTop: !isExist(errors.address) && '1rem' }}>
        <Input
          placeholder='Address'
          name='address'
          type='text'
          value={form?.address}
          onChange={handleChange}
          style={{ width: '100%' }}
          isError={touched.address && ifExist(errors.address)}
        />
      </div>
      <div
        className='d-flex justify-content-center'
        style={{ marginTop: !isExist(errors.address2) && '1rem' }}>
        <Input
          placeholder='Apt. Suite, Building'
          name='address2'
          type='text'
          value={form?.address2}
          onChange={handleChange}
          style={{ width: '100%' }}
          isError={touched.address2 && ifExist(errors.address2)}
        />
      </div>
      <div
        className='d-flex justify-content-between'
        style={{
          marginTop:
            !isExist(errors.city) && !isExist(errors.zipCode) && '1rem',
        }}>
        <Input
          placeholder='City'
          name='city'
          type='text'
          value={form?.city}
          onChange={handleChange}
          style={{ width: '48%' }}
          isError={touched.city && ifExist(errors.city)}
        />
        <Input
          placeholder='Zip'
          name='zipCode'
          type='text'
          value={form?.zipCode}
          onChange={handleChange}
          style={{ width: '48%' }}
          isError={touched.zipCode && ifExist(errors.zipCode)}
        />
      </div>
      <div
        className='d-flex justify-content-between'
        style={{
          marginTop:
            !isExist(errors.state) && !isExist(errors.country) && '1rem',
        }}>
        {isStateTxtField ? (
          <Input
            placeholder='State'
            name='state'
            type='text'
            value={form.state}
            onChange={handleChange}
            style={{ width: '48%' }}
            isError={touched.state && ifExist(errors.state)}
          />
        ) : (
          <Dropdown
            style={{ width: '48%', marginTop: '0.4rem' }}
            options={US_STATES.map(({ name, state_code }) => ({
              label: name,
              value: state_code,
            }))}
            value={
              US_STATES.filter((_) => _.state_code === form.state).map(
                ({ state_code }) => state_code,
              )[0] ?? ''
            }
            placeholder='State'
            name='state'
            onChange={handleChange}
            isError={touched.state && ifExist(errors.state)}
          />
        )}
        <Dropdown
          style={{ width: '48%', marginTop: '0.4rem' }}
          options={stripeCountry.map(({ name, country_code }) => ({
            label: name,
            value: country_code,
          }))}
          value={
            stripeCountry
              .filter((_) => _.country_code === form.country)
              .map(({ country_code }) => country_code)[0] ?? ''
          }
          name='country'
          placeholder='Country'
          onChange={(event) => {
            onChange(event.target.name, event.target.value);
          }}
          isError={touched.country && ifExist(errors.country)}
        />
      </div>
    </>
  );
};

AddAddressForm.propTypes = {
  form: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  setFieldValue: PropTypes.func,
  handleChange: PropTypes.func,
};
