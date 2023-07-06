import React, { useEffect, useRef, useState } from 'react';
import { NftObject, Dropdown, Button, Loader } from 'components';
import { getNftTypesAPI, getNftsAPI } from 'services';
import { createOptions, isArray, isObject, mergeRecords } from 'helpers';
import { useAuth } from 'hooks';
import useTheme from 'hooks/useTheme';

const Home = () => {
  const { developerUser } = useAuth();
  const [nfts, setNfts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(true);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [types, setTypes] = useState([]);
  const myRef = useRef(null);

  useEffect(() => {
    const initProcess = async () => {
      const typeRes = await getNftTypesAPI();
      setTypes([{ label: 'All', value: '' }, ...createOptions(typeRes)]);
    };
    initProcess();
  }, []);

  useEffect(() => {
    if (isObject(developerUser)) fetchProducts({ page: page });
  }, [developerUser]);

  useEffect(() => {
    if (page != 1) {
      setIsLoadMore(true);
      fetchProducts({ page });
    }
  }, [page]);

  const fetchProducts = async ({ page }) => {
    const res = await getNftsAPI({ page, userId: developerUser.id });
    if (isArray(res)) {
      const data = mergeRecords(res, nfts);
      setNfts(data);
      setIsLoadMore(false);
      setShowLoadMore(res.length > 11 ? true : false);
    } else {
      setShowLoadMore(false);
      setIsLoadMore(false);
    }
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const recordsAfterFilter = () => {
    if (selectedCategory === '') {
      return nfts;
    } else {
      return nfts.filter((item) => item.nft_type === selectedCategory);
    }
  };

  return (
    <div>
      {/* style={{ backgroundColor: theme.primary.bgColor || '#fff'}} */}
      <section>
        <img
          src={require('../assets/images/Utopia_Banner.png')}
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
          }}
        />
      </section>

      <section className='container' ref={myRef}>
        <div className='row'>
          <div className='col-md-6'>
            <h2 className='style-2'>New Items</h2>
          </div>
          <div className='col-md-6'>
            <div className='items_filter'>
              <div className='dropdownSelect one'>
                <Dropdown
                  options={types}
                  value={selectedCategory}
                  placeholder={'Select Category'}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        {isLoadMore && !isArray(nfts) ? (
          <Loader />
        ) : (
          <>
            <div className='row mt-4'>
              {recordsAfterFilter().map((nft, index) => (
                <NftObject key={index} nft={nft} />
              ))}
            </div>
            <div className='col-lg-12'>
              <div className='spacer-single' />
              {showLoadMore && isArray(recordsAfterFilter()) && (
                <div className='centered'>
                  <Button
                    isLoading={isLoadMore}
                    onClick={() => loadMore()}
                    extraStyles={{ width: '11rem', height: '3rem' }}
                    classes='btn-main'
                    title={'Load More'}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default useTheme(Home);
