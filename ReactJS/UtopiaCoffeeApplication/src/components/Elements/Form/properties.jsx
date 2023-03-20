import React from 'react';
import PropTypes from 'prop-types';
import { Input } from './input';

export const Properties = ({
  heading,
  name,
  properties,
  onChange,
  isError,
}) => {
  const initRow = {
    trait_type: '',
    value: '',
  };
  const handleAdd = () => {
    const newArray = [...properties, initRow];
    onChange(name, newArray);
  };

  const handleRemove = (rowIndex) => {
    const newArray = properties.filter((_, index) => index !== rowIndex);
    onChange(name, newArray);
  };

  const handleChange = ({ fieldName, index, event }) => {
    const newArray = properties;
    newArray[index][fieldName] = event?.target.value;
    onChange(name, newArray);
  };
  return (
    <div>
      <h5>{heading}</h5>
      {properties.map((_, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Input
            name='trait_type'
            placeholder='Type'
            value={properties[index].trait_type}
            onChange={(event) =>
              handleChange({ fieldName: 'trait_type', index, event })
            }
            style={{ width: '48%' }}
          />

          <Input
            name='value'
            placeholder='Value'
            value={properties[index].value}
            onChange={(event) =>
              handleChange({ fieldName: 'value', index, event })
            }
            style={{ width: '48%' }}
          />

          {properties.length > 1 && (
            <div>
              <i
                className='fa fa-times mt-3'
                style={{
                  color: '#000',
                  fontSize: '1.2rem',
                }}
                onClick={() => handleRemove(index)}
              />
            </div>
          )}
        </div>
      ))}

      <div className='spacer-half'></div>

      <button className='btn-main' onClick={handleAdd}>
        Add Row
      </button>
      {isError && (
        <p className='mt-1 mb-0 text-danger' style={{ fontSize: '0.75rem' }}>
          {isError}
        </p>
      )}
    </div>
  );
};

Properties.propTypes = {
  heading: PropTypes.string,
  name: PropTypes.string,
  properties: PropTypes.array,
  onChange: PropTypes.func,
  isError: PropTypes.string,
};
