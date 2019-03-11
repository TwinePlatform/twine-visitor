import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid, Row } from 'react-flexbox-grid';
import { PrimaryButton } from '../../shared/components/form/base';
import { fonts, colors } from '../../shared/style_guide';


const Img = styled.img`
  object-fit: contain;
  object-position: center;
  display: block;
  margin: auto;
`;

const Button = styled(PrimaryButton) `
  width: 45%;
  height: 4.5em;
  font-size: ${fonts.size.small};
`;

const ErrorText = styled.p`
  color: ${colors.error};
`;

const resendQrCodeState = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const QrBox = ({ qrCodeUrl, print, send, error, status }) => {
  const hasSent = status === resendQrCodeState.SUCCESS;
  const hasError = status === resendQrCodeState.ERROR;

  return (
    <Grid>
      <Img alt="QR code" src={qrCodeUrl} />
      <Row between={'xs'}>
        <Button onClick={print}>PRINT QR CODE</Button>
        <Button onClick={send} disabled={hasSent}>
          {
            hasSent
              ? 'QR CODE SENT'
              : 'RESEND QR CODE'
          }
        </Button>

      </Row>
      {hasError && <ErrorText>{error.message}</ErrorText>}
    </Grid>
  );
};


QrBox.propTypes = {
  qrCodeUrl: PropTypes.string.isRequired,
  print: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
  status: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
    statusCode: PropTypes.number,
    type: PropTypes.string,
  }),
};

QrBox.defaultProps = {
  error: {},
  status: null,
};


export default QrBox;
