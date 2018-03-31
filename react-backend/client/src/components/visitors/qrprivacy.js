import React from 'react';
import styled from 'styled-components';
import { Paragraph } from '../../shared/components/text/base';

const ATag = styled.a`
`;
const qrPrivacy = () => (
  <aside>
    <h3>What information are we storing?</h3>
    <Paragraph>
      Your name, sex, age, and reason for visiting today, as well as the time and date of your
      visit.
      <br />
      <br />
    </Paragraph>
    <h3>Why are we collecting this information?</h3>
    <Paragraph>
      We are always trying to improve what we offer you. By signing in, you are helping us make
      our services better.
    </Paragraph>
    <ATag href="http://www.powertochange.org.uk/data-protection-funding-applications/">
      Data Protection Policy
    </ATag>
  </aside>
);

export default qrPrivacy;
