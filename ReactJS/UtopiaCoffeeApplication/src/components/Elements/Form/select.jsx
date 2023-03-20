import React from 'react';
import PropTypes from 'prop-types';
import { isExist } from 'helpers';

export const Dropdown = ({
  heading,
  name,
  value,
  placeholder,
  options,
  onChange,
  onBlur,
  isError,
  style,
}) => {
  return (
    <div style={style}>
      {heading && <h5>{heading}</h5>}
      <select
        className='select'
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}>
        {!isExist(value) && <option value={''}>{placeholder}</option>}
        {options.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {isError && (
        <p className='mt-1 mb-0 text-danger' style={{ fontSize: '0.75rem' }}>
          {isError}
        </p>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  heading: PropTypes.string,
  options: PropTypes.array,
  name: PropTypes.string,
  value: PropTypes.number | PropTypes.string,
  placeholder: PropTypes.string,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  isError: PropTypes.string,
  style: PropTypes.object,
};
