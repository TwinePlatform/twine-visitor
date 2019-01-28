import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import qs from 'qs';
import PrivacyStatement from '../components/PrivacyStatement';
import { PrimaryButton } from '../../shared/components/form/base';

const Button = styled(PrimaryButton)`
  padding: 1em 0.5em;
  margin: 1em;
`;

const ErrorText = {
  no_user_qr: 'Your QR code does not correspond to a registered visitor at this organisation',
  no_user: 'Your details do not correspond to a registered visitor at this organisation',
  no_instascan: 'There was an application error',
  scanner: 'There was an application error',
  camera: 'There was a problem accessing the camera. If this continues, try a different device.',
  default: null,
};

const ContinueOptions = {
  default: () => (
    <>
      <Link to="/visitor/signup">
        <Button>Register as a new user</Button>
      </Link>
      <Link to="/visitor/login">
        <Button>Try to sign in again</Button>
      </Link>
    </>
  ),
  no_user: () => ContinueOptions.default(),
  no_user_qr: () => ContinueOptions.default(),
  no_instascan: () => (
    <>
      <Button onClick={() => window.location.replace('/')}>Refresh the app</Button>
    </>
  ),
  scanner: () => ContinueOptions.no_instascan(),
  camera: () => ContinueOptions.no_instascan(),
};

const QrError = (props) => {
  const query = qs.parse(props.history.location.search.slice(1) || '');

  return (
    <div>
      <section>
        <h1>{props.headerContent}</h1>
        <h2>{ErrorText[query.e || 'default']}</h2>
        <h4>{props.subHeaderContent}</h4>
        { ContinueOptions[query.e || 'default']() }
      </section>
      <PrivacyStatement />
    </div>
  );
};

QrError.propTypes = {
  headerContent: PropTypes.string,
  subHeaderContent: PropTypes.string,
  history: PropTypes.shape({
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  }).isRequired,
};

QrError.defaultProps = {
  headerContent: 'We’re sorry, there was a problem registering your visit:',
  subHeaderContent: 'Please choose one of these options or go to Reception for help',
};

export default QrError;
