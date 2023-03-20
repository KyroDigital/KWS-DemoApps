import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

export const AddressObject = ({ addressDetails, checked, onChange }) => {
  return (
    <div className='mt-4'>
      <div className='cardContainer col-sm-12 col-md-7'>
        <div className='d-flex align-items-center'>
          <div>
            <Form.Check
              type={'radio'}
              checked={checked === addressDetails.id}
              onChange={() => {
                onChange(addressDetails);
              }}
            />
          </div>
          <h5 style={{ marginLeft: '1rem' }}>
            {addressDetails.name ??
              `${addressDetails.first_name} ${addressDetails.last_name}`}
          </h5>
        </div>
        <div>
          <h6 style={{ textAlign: 'right' }}>
            {addressDetails.address} {addressDetails.address2}
          </h6>
          <h6 style={{ textAlign: 'right' }}>
            {addressDetails.city} {addressDetails.zip_code}
          </h6>
          <h6 style={{ textAlign: 'right' }}>
            {addressDetails.state_province} {addressDetails.country}
          </h6>
        </div>
        {/* <h6>{getAddressFormat({ item: addressDetails })}</h6> */}
      </div>
    </div>
  );
};

AddressObject.propTypes = {
  addressDetails: PropTypes.object,
  checked: PropTypes.string | PropTypes.number,
  onChange: PropTypes.func,
};
