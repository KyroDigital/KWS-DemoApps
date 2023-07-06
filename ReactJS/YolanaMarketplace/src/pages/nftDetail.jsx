import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { UserObject, Loader, Button, ObjectBox } from 'components';
import { getNftDetailsAPI, mintNftAPI } from 'services';
import {
  convertPropertiesAttributes,
  ifExist,
  isArray,
  isObject,
  toCurrencyFormat,
  convertHtmlToString,
} from 'helpers';
import { useAuth, useGlobalElements } from 'hooks';

const table = ['Contact Address', 'Token Standard', 'Blockchain'];

const NFTDetail = function () {
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser, developerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [nftDetails, setNftDetails] = useState({});
  const [selectedTab, setSelectedTab] = useState('details');
  const [mintModal, setMintModal] = useState(false);

  useEffect(() => {
    const initProcess = async () => {
      const res = await getNftDetailsAPI({
        productId: params.id,
        userId: developerUser.id,
      });
      setNftDetails(res);
      setIsLoading(false);
    };
    initProcess();
  }, []);

  const handleTabSelection = (tab) => {
    setSelectedTab(tab.add);
    document.getElementById(tab.add).classList.add('active');
    document.getElementById(tab.remove).classList.remove('active');
  };

  const handleCheckout = () => {
    if (isObject(currentUser)) {
      navigate('/checkout', { state: { data: editionProduct } });
    } else {
      navigate('/signin');
    }
  };

  const {
    isAllMinted,
    isAllowMint,
    editionProduct,
    edition,
    isAllSold,
    isPurchaseable,
  } = useMemo(() => {
    const isMultiple = isArray(nftDetails.nft_editions);
    const editions = {
      total: isMultiple ? ifExist(nftDetails.total_nft_editions) || '0' : '1',
      published: 0,
    };
    if (isMultiple) {
      const published = nftDetails.nft_editions.filter(
        (e) => e.status === 'published',
      );
      const editionProduct =
        nftDetails?.nft_editions.find(
          (d) => d.is_available_for_purchase === '1',
        ) || {};
      editions.published = published.length;
      editions.nextEditionToBuy = editionProduct;
    }
    const isNftCreator = nftDetails.primary_creator_id == currentUser?.kyro_id;
    return {
      isAllMinted: editions.published == editions.total,
      isPurchaseable:
        isMultiple &&
        isObject(
          nftDetails.nft_editions.find((e) => e.status === 'published'),
        ) &&
        !isNftCreator,
      isAllowMint: isNftCreator,
      isAllSold:
        editions.published == editions.total &&
        !isObject(editions.nextEditionToBuy),
      editionProduct: editions.nextEditionToBuy,
      edition:
        isObject(editions.nextEditionToBuy) && editions.published > 0
          ? `Edition: ${editions.nextEditionToBuy.nft_data.edition_number} / ${editions.total}`
          : '',
    };
  }, [nftDetails]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <section className='container mt-5'>
            <div className='row mt-2'>
              <div className='col-md-6 col-lg-5'>
                <ObjectBox
                  image={
                    nftDetails.image_url_large ||
                    nftDetails.image_url_medium ||
                    nftDetails.image_url_small
                  }
                />
              </div>
              <div className='col-md-6'>
                <div className='item_info'>
                  <h2>{nftDetails.name}</h2>
                  {isObject(editionProduct) && (
                    <h6 className='text'>{edition} </h6>
                  )}
                  <p className='text'>
                    {convertHtmlToString(nftDetails.description)}
                  </p>
                  <div className='spacer-10'></div>
                  <h5>Creator</h5>
                  <div className='item_author'>
                    <UserObject
                      data={{
                        authorImg:
                          nftDetails.photo_url || nftDetails.photo_url_large,
                        authorName: nftDetails.uname,
                      }}
                    />
                  </div>
                </div>

                <div className='spacer-40' />

                <div className='d-flex justify-content-between align-items-center px-2'>
                  <div>
                    <h5>Price</h5>
                    <h3>{toCurrencyFormat(nftDetails.price)}</h3>
                  </div>
                  <div>
                    {isAllowMint && (
                      <Button
                        onClick={() => setMintModal(true)}
                        extraStyles={{
                          width: '9rem',
                          height: '3rem',
                          marginBottom: 10,
                        }}
                        classes='btn-main'
                        title={'Mint'}
                      />
                    )}
                    {isObject(editionProduct) && isPurchaseable ? (
                      <Button
                        onClick={handleCheckout}
                        extraStyles={{ width: '9rem', height: '3rem' }}
                        classes='btn-main'
                        title={'Buy Now'}
                      />
                    ) : (
                      !isAllowMint && (
                        <div
                          className='centered'
                          style={{
                            height: '4.5rem',
                            borderTop: '1px solid',
                            borderBottom: '1px solid',
                            width: '25rem',
                          }}>
                          <h6 className='text'>
                            {isAllSold
                              ? 'All editions have been sold out'
                              : 'Not available for Purchase'}
                          </h6>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className='spacer-40' />

                {(isObject(editionProduct) || isAllSold) && (
                  <>
                    <ul className='de_nav'>
                      <li id='details' className='active'>
                        <span
                          onClick={() =>
                            handleTabSelection({
                              add: 'details',
                              remove: 'properties',
                            })
                          }>
                          Details
                        </span>
                      </li>
                      <li id='properties' className=''>
                        <span
                          onClick={() =>
                            handleTabSelection({
                              add: 'properties',
                              remove: 'details',
                            })
                          }>
                          Properties
                        </span>
                      </li>
                    </ul>
                    <DetailsComponent
                      details={
                        isObject(editionProduct)
                          ? editionProduct
                          : nftDetails.nft_editions[0]
                      }
                      properties={nftDetails.nft_properties}
                      selectedTab={selectedTab}
                    />
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
      <MintNft
        open={mintModal}
        handleClose={() => setMintModal(false)}
        nft={nftDetails}
      />
    </>
  );
};
export default NFTDetail;

const DetailsComponent = ({ details, properties, selectedTab }) => {
  return (
    <div>
      {selectedTab.includes('details') ? (
        <div className='mt-4 py-2 details-body'>
          {table.map((item, index) => (
            <div key={index} className='d-flex p-2'>
              <div>{item}: </div>
              <div
                style={{
                  textDecoration: 'none',
                  width: '60%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginLeft: '0.5rem',
                }}>
                {item === 'Contact Address' ? (
                  <a
                    target='blank'
                    href={details.nft_data.nft_smart_contract}
                    rel='noreferrer'>
                    {details.nft_data.nft_smart_contract_hash}
                  </a>
                ) : item === 'Token Standard' ? (
                  details.nft_data.nft_standard
                ) : (
                  details.type
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='mt-2 py-2 d-flex flex-wrap'>
          {convertPropertiesAttributes(properties).map((item, index) => (
            <div key={index} className='properties-block'>
              <div className='color'>{item.trait_type}</div>
              <h5>{item.value}</h5>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

DetailsComponent.propTypes = {
  details: PropTypes.object,
  properties: PropTypes.object,
  selectedTab: PropTypes.string,
};

const MintNft = ({ open, handleClose, nft }) => {
  const { currentUser } = useAuth();
  const { showToast } = useGlobalElements();
  const [mintLoading, setMintLoading] = useState(false);

  const handleMint = async () => {
    setMintLoading(true);
    const res = await mintNftAPI({
      params: {
        user_id: currentUser.kyro_id,
        parent_ids: nft.sage_id,
      },
    });
    if (isObject(res)) {
      showToast({
        type: 'success',
        message: 'Your request has been taken to mint the NFT(s)',
      });
      setMintLoading(false);
      handleClose();
    } else {
      setMintLoading(false);
      showToast({
        type: 'danger',
        message: 'Minting failed',
      });
    }
  };

  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        className='modalBackground'
        closeVariant='white'>
        <Modal.Title>Mint NFT</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBackground'>
        <div>
          <div className='d-flex align-items-center py-2'>
            <div style={{ height: '12ch', width: '12ch' }}>
              <img
                src={
                  nft.image_url_large ||
                  nft.image_url_medium ||
                  nft.image_url_small
                }
                className='img-fluid img-rounded mb-sm-30 nft-img'
                alt=''
              />
            </div>
            <div style={{ marginLeft: '1rem' }}>
              <h4>{nft.name}</h4>
              <h6>Quantity: {nft.total_nft_editions}</h6>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className='modalBackground'>
        <Button
          isLoading={mintLoading}
          onClick={handleMint}
          classes='btn-main inline'
          title={'Mint'}
          extraStyles={{ width: '8rem', height: '3rem' }}
        />
      </Modal.Footer>
    </Modal>
  );
};

MintNft.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  nft: PropTypes.object,
};
