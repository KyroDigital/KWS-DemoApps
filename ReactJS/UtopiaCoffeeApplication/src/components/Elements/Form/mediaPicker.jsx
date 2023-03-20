import React from 'react';
import PropTypes from 'prop-types';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import { isExist } from '../../../helpers';

export const MediaPicker = ({
  name,
  heading,
  subHeading,
  file,
  handleChange,
  isError,
  height,
  width,
}) => {
  const handleChangeStatus = ({ file }, status) => {
    if (status === 'done') {
      handleChange(name, file);
    } else if (status === 'aborted') {
      console.log('Could not upload File');
    } else if (status === 'removed') {
      handleChange(name, '');
    }
  };
  return (
    <>
      {heading && <h5>{heading}</h5>}
      {subHeading && <h6>{subHeading}</h6>}
      <Dropzone
        onChangeStatus={handleChangeStatus}
        maxFiles={1}
        accept='image/*,audio/*,video/*'
        initialFiles={isExist(file) ? [file] : []}
        styles={{
          dropzone: {
            height: height ?? 250,
            overflow: 'auto',
            width: width ?? 'auto',
            margin: '16px 0 0 0',
            borderStyle: 'dashed',
            borderColor: '#000',
          },
          inputLabel: {
            color: '#000',
            fontSize: '85%',
            padding: '0 10px 0 10px',
            justifyContent: 'center',
            textAlign: 'center',
          },
          preview: {
            justifyContent: 'space-evenly',
            padding: 12,
          },
          previewImage: {
            maxWidth: '73%',
            maxHeight: '100%',
          },
        }}
      />
      {isError && (
        <p className='mt-1 mb-0 text-danger' style={{ fontSize: '0.75rem' }}>
          {isError}
        </p>
      )}
    </>
  );
};

MediaPicker.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  name: PropTypes.string,
  file: PropTypes.any,
  handleChange: PropTypes.func,
  isError: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
};
