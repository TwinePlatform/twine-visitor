import React, { Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Heading, Paragraph, Link } from '../../../shared/components/text/base';
import { PrimaryButton } from '../../../shared/components/form/base';
import { FlexContainerCol, FlexContainerRow } from '../../../shared/components/layout/base';
import PrintableQrCode from '../../../shared/components/PrintableQrCode';


const ButtonsFlexContainerCol = styled(FlexContainerCol)`
  padding-top: 10%;
  width: 40%;
`;

const SubmitButton = styled(PrimaryButton)`
  height: 4em;
  width: 90%;
  margin-bottom: 5%;
`;

const CenteredParagraph = styled(Paragraph)`
  width: 90%;
  font-weight: medium;
  font-size: 21px;
  text-align: center;
  margin-top: 5%;
  padding-left: 15%;
`;

const CenteredHeading = styled(Heading)`
  padding-top: 5%;
  padding-left: 10%;
  width: 90%;
  text-align: center;
  font-weight: heavy;
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
        <CenteredHeading>Anonymous User QR code</CenteredHeading>
        <CenteredParagraph>
        Please print this page. If you loose the QR code it can be reprinted from the Visitor page.
        </CenteredParagraph>
        <FlexContainerRow>
          <QRContainer>
            <QRimg src={props.qrCode} alt="This is your QRcode" />
          </QRContainer>
          <ButtonsFlexContainerCol>
            <Link to="/cb/dashboard">
              <SubmitButton>NEXT</SubmitButton>
            </Link>
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
