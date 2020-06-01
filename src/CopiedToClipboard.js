import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const CopiedToClipboard = ({ text }) => {
  const [opacity, setOpacity] = React.useState(0);

  useEffect(() => {
    // don't display when nothing is copied
    if (text === '') return;

    // make message visible, then fade out
    setOpacity(1);
    setTimeout(() => {
      setOpacity(0);
    }, 1000);
  }, [text]);

  return (
    <span
      style={{
        transition: 'opacity 0.2s ease',
        opacity: opacity,
        backgroundColor: 'greenyellow',
        padding: '0.2rem',
      }}
    >
      Copied to clipboard
    </span>
  );
};

CopiedToClipboard.propTypes = {
  text: PropTypes.string.isRequired,
};

CopiedToClipboard.defaultProps = {};

export default CopiedToClipboard;
