import React, { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isExist } from 'helpers';
import { ToastContainer, Toast } from 'react-bootstrap';

export const GlobalContext = createContext({});

export const GlobalContextProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: '',
    open: false,
    type: 'success',
    position: 'bottom-center',
  });

  const showToast = ({ type, message, position }) => {
    setToast((prevState) => ({
      open: true,
      type,
      message,
      position: isExist(position) ? position : prevState.position,
    }));
  };

  const ToastComponent = () => {
    const handleClose = () => {
      setToast((prevState) => ({
        ...prevState,
        open: false,
      }));
    };

    return (
      <ToastContainer position={toast.position} className='position-fixed p-3'>
        <Toast show={toast.open} bg={toast.type} onClose={handleClose} autohide>
          <Toast.Body className='text-white'> {toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    );
  };

  const values = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <GlobalContext.Provider value={values}>
      <>
        {children}
        <ToastComponent />
      </>
    </GlobalContext.Provider>
  );
};

GlobalContextProvider.propTypes = {
  children: PropTypes.node,
};
