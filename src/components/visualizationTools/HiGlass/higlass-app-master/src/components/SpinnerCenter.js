import PropTypes from 'prop-types';
import React from 'react';

// Components
import Spinner from './Spinner';

// Styles
import './SpinnerCenter.scss';

const SpinnerCenter = props => (
  <div className='full-dim flex-c flex-a-c flex-jc-c spinner-center'>
    <Spinner delayed={props.delayed} light={props.light} />
  </div>
);

SpinnerCenter.propTypes = {
  delayed: PropTypes.bool,
  light: PropTypes.bool,
};

export default SpinnerCenter;
