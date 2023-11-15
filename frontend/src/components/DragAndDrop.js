
import React from 'react';
import PropTypes from 'prop-types';


export default function FilesDragAndDrop({onUpload}) {
  return (
    <div className='FilesDragAndDrop__area' style={{width: '300px',
        height: '200px',
        }}>
      Hey, drop me some files
      <span
        role='img'
        aria-label='emoji'
      >
        &#128526;
      </span>
    </div>
  );
}

FilesDragAndDrop.propTypes = {
  onUpload: PropTypes.func.isRequired,
};