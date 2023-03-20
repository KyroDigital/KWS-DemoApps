import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { toCurrencyFormat } from 'helpers';
import { ObjectBox } from '.';

export const NftObject = ({ nft }) => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(`details/${nft.productservice_sage_id}`);
  };
  return (
    <div className='d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4'>
      <div className='nft__item'>
        <div className='nft__item_wrap' onClick={handleNavigation}>
          <ObjectBox
            image={
              nft.image_url_large || nft.image_url_medium || nft.image_url_small
            }
          />
        </div>
        <div className='nft__item_info' onClick={handleNavigation}>
          <span>
            <h4>{nft.name}</h4>
          </span>
          <div className='nft__item_price'>
            <div className='text'>{toCurrencyFormat(nft.unit_price)}</div>
            <div className='nft__item_action'>
              <span>Buy</span>
            </div>
            {/* {nft.total_nft_editions && (
              <div>{`1/${nft.total_nft_editions}`}</div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

NftObject.propTypes = {
  nft: PropTypes.object,
};
