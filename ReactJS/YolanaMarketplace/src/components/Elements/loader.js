import React from 'react';

export const Loader = () => {
  return (
    <div className='centered' style={{ height: '100vh' }}>
      <div className='spinner-border text-light spinner' role='status'>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
};
