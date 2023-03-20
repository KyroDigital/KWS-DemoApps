import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const OuterWrapper = styled.div({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingBottom: `${(1 / 1) * 100}%`,
  backgroundColor: '#d3d3d3',
  borderRadius: '1rem',
});

const InnerWrapper = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

export const ObjectBox = ({ image }) => {
  return (
    <OuterWrapper>
      <InnerWrapper>
        {image && (
          <img
            src={image}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
        )}
      </InnerWrapper>
    </OuterWrapper>
  );
};

ObjectBox.propTypes = {
  image: PropTypes.string,
};
