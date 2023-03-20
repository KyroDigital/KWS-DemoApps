import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const Input = ({
  heading,
  type,
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  isError,
  style,
  extraStyles,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div style={style}>
      <h5>{heading}</h5>
      <input
        type={showPassword ? 'text' : type}
        name={name}
        value={value}
        id='item_title'
        className='text-input'
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        style={{ ...extraStyles }}
      />
      {type === 'password' && (
        <i
          className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
          style={{
            position: 'absolute',
            top: '2.4rem',
            right: 10,
            fontSize: '1.5rem',
          }}
          onClick={() => setShowPassword(!showPassword)}
        />
      )}
      {isError && (
        <p className='mt-1 mb-0 text-danger' style={{ fontSize: '0.75rem' }}>
          {isError}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  heading: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string | PropTypes.number,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  isError: PropTypes.string,
  style: PropTypes.object,
  extraStyles: PropTypes.object,
};
