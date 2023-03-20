import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './Form';

export const Slider = ({ onBtnClick }) => (
  <div className='container'>
    <div className='row align-items-center'>
      <div className='col-md-6'>
        <div className='spacer-single'></div>
        <div className='onStep'>
          <h1 className='col-white'>Changing the World Through Coffee.</h1>
        </div>
        <div className='onStep'>
          <p className='lead col-white'>love, coffee, design</p>
        </div>
        <div className='spacer-10'></div>
        <div className='onStep d-inline'>
          <Button
            onClick={onBtnClick}
            extraStyles={{ width: '10rem', height: '3rem' }}
            classes='btn-main'
            title={'Shop Now'}
          />
          <div className='mb-sm-30'></div>
        </div>

        {/* <div className='onStep d-inline'>
          <div className='row'>
            <div className='spacer-single'></div>
            <div className='row'>
              <div className='col-lg-4 col-md-6 col-sm-4 mb30'>
                <div className='de_count text-left'>
                  <h3>
                    <span>94215</span>
                  </h3>
                  <h5 className='id-color'>Collectibles</h5>
                </div>
              </div>

              <div className='col-lg-4 col-md-6 col-sm-4 mb30'>
                <div className='de_count text-left'>
                  <h3>
                    <span>27</span>k
                  </h3>
                  <h5 className='id-color'>Auctions</h5>
                </div>
              </div>

              <div className='col-lg-4 col-md-6 col-sm-4 mb30'>
                <div className='de_count text-left'>
                  <h3>
                    <span>4</span>k
                  </h3>
                  <h5 className='id-color'>NFT Artist</h5>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* <div className='col-md-6 xs-hide'>
        <div className='onStep d-inline'>
          <img
            src={require('../../assets/images/nft.png')}
            className='img-fluid'
            alt=''
          />
        </div>
      </div> */}
    </div>
  </div>
);

Slider.propTypes = {
  onBtnClick: PropTypes.func,
};
