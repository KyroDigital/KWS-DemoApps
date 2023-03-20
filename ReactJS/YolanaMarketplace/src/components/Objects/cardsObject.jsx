import React from 'react';
import PropTypes from 'prop-types';
import {
  AmericanExpress,
  Diners,
  Discover,
  JCB,
  Mastercard,
  UnionPay,
  Visa,
} from 'assets/images';
import { Form } from 'react-bootstrap';

export const CardsObject = ({ cardDetails, checked, onChange }) => {
  const showIcon = (brand) => {
    switch (brand) {
      case 'Visa':
        return <Visa height={'3.2rem'} width={'3.2rem'} />;
      case 'American Express':
        return <AmericanExpress height={'3.2rem'} width={'3.2rem'} />;
      case 'MasterCard':
        return <Mastercard height={'3.2rem'} width={'3.2rem'} />;
      case 'JCB':
        return <JCB height={'3.2rem'} width={'3.2rem'} />;
      case 'UnionPay':
        return <UnionPay height={'3.2rem'} width={'3.2rem'} />;
      case 'Discover':
        return <Discover height={'3.2rem'} width={'3.2rem'} />;
      case 'Diners Club':
        return <Diners height={'3.2rem'} width={'3.2rem'} />;
      default:
    }
  };
  return (
    <div className='mt-4'>
      <div className='cardContainer col-sm-12 col-md-7'>
        <div className='d-flex align-items-center'>
          <div>
            <Form.Check
              type={'radio'}
              checked={checked === cardDetails.id}
              onChange={() => {
                onChange(cardDetails);
              }}
            />
          </div>
          <div style={{ marginLeft: '1rem' }}>
            {showIcon(cardDetails.brand)}
          </div>
        </div>
        <div>
          <h6>**** **** **** {cardDetails.last4}</h6>
          <h6 style={{ textAlign: 'right' }}>{cardDetails.brand}</h6>
        </div>
      </div>
    </div>
  );
};

CardsObject.propTypes = {
  cardDetails: PropTypes.object,
  checked: PropTypes.string | PropTypes.number,
  onChange: PropTypes.func,
};
