import React from 'react';
import PropTypes from 'prop-types';
import { getInitials, isExist } from 'helpers';

export const UserObject = ({ data }) => {
  return (
    <>
      <div className='author_list_pp'>
        {isExist(data.authorImg) ? (
          <span>
            <img src={data.authorImg} alt='' />
          </span>
        ) : (
          <div className='centered avatar'>{getInitials(data.authorName)}</div>
        )}
      </div>
      <div className='author_list_info'>
        <span>{data.authorName}</span>
        {data.price && <span className='bot'>{data.price}</span>}
      </div>
    </>
  );
};

UserObject.propTypes = {
  data: PropTypes.shape({
    price: PropTypes.string,
    authorImg: PropTypes.string,
    authorName: PropTypes.string,
  }),
};
