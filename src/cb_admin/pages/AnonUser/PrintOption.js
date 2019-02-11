import React, { Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import NavHeader from '../../../shared/components/NavHeader';
import { Paragraph } from '../../../shared/components/text/base';
import { PrimaryButton } from '../../../shared/components/form/base';
import { FlexContainerCol, FlexContainerRow } from '../../../shared/components/layout/base';
import PrintableQrCode from '../../../shared/components/PrintableQrCode';


const ButtonsFlexContainerCol = styled(FlexContainerCol)`
  width: 50%;
`;

const SubmitButton = styled(PrimaryButton)`
  height: 4em;
  width: 80%;
`;

const CenteredParagraph = styled(Paragraph)`
  width: 90%;
  font-size: 21px;
  text-align: center;
  margin-top: 5%;
  padding-left: 15%;
`;


const QRimg = styled.img`
  height: 25em;
  width: 100%;
  object-fit: contain;
  object-position: left;
  display: block;
  margin-top: 10%;
`;

const NotPrint = styled(FlexContainerCol)`
  @media print {
    display: none;
  }
`;

const QRContainer = styled.div`
  height: 50%;
  width: 50%;
  display: block;
`;

const PrintOption = props =>
  (<Fragment>
    <NotPrint>
      <FlexContainerCol>
        <NavHeader
          leftTo="/cb/dashboard"
          leftContent="Back to dashboard"
          centerContent="Anonymous User QR code"
        />
        <CenteredParagraph>
        Please print this page. If you loose the QR code it can be reprinted from the Visitor page.
        </CenteredParagraph>
        <FlexContainerRow>
          <QRContainer>
            <QRimg src={props.qrCode} alt="This is your QRcode" />
          </QRContainer>
          <ButtonsFlexContainerCol>
            <SubmitButton onClick={props.onClickPrint}>PRINT QR CODE</SubmitButton>
          </ButtonsFlexContainerCol>
        </FlexContainerRow>
      </FlexContainerCol>
    </NotPrint>
    <PrintableQrCode cbLogoUrl={props.cbLogoUrl} qrCode={props.qrCode} />
  </Fragment>
  );


PrintOption.propTypes = {
  qrCode: PropTypes.string.isRequired,
  cbLogoUrl: PropTypes.string.isRequired,
  onClickPrint: PropTypes.func.isRequired,
};

export default PrintOption;
