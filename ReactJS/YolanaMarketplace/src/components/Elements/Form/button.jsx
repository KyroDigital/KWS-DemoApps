import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({
  isLoading,
  onClick,
  classes,
  isDisabled,
  title,
  extraStyles,
}) => {
  return (
    <div>
      <button
        disabled={isLoading || isDisabled}
        className={classes}
        style={{ ...extraStyles }}
        onClick={onClick}>
        {isLoading ? (
          <div className='spinner-border text-light spinner' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        ) : (
          title
        )}
      </button>
    </div>
  );
};

Button.propTypes = {
  isLoading: PropTypes.bool,
  classes: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string,
  extraStyles: PropTypes.object,
};
