import React from 'react';

export const Loader = () => {
  return (
    <div className='centered' style={{ height: '100vh' }}>
      <div className='spinner-border text-dark spinner' role='status'>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
};
