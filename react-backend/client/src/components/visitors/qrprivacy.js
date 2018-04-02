import React from 'react';
import styled from 'styled-components';
import { Paragraph, Heading3 } from '../../shared/components/text/base';
import { colors, fonts } from '../../shared/style_guide';

const ATag = styled.a`
  font-weight: ${fonts.weight.medium};
  color: ${colors.dark};
`;
const qrPrivacy = () => (
  <aside>
    <Heading3>What information are we storing?</Heading3>
    <Paragraph>
      Your name, gender, age, and reason for visiting today, as well as the time and date of your
      visit.
      <br />
      <br />
    </Paragraph>
    <Heading3>Why are we collecting this information?</Heading3>
    <Paragraph>
      We are always trying to improve what we offer you. By signing in, you are helping us make our
      services better.
    </Paragraph>
    <ATag href="http://www.powertochange.org.uk/data-protection-funding-applications/">
      Data Protection Policy
    </ATag>
  </aside>
);

export default qrPrivacy;
