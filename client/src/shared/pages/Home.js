import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SecondaryButton } from '../components/form/base';
import { Heading, Link as HyperLink } from '../components/text/base';
import { FlexContainerCol } from '../components/layout/base';
import DotButton from '../components/form/DottedButton';
import { logout } from '../../api';


const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledSection = styled.section`
  display: flex;
  justify-content: center;
`;

const FlexLink = styled(Link)`
  flex: 1 0 20vh;
  text-align: center;
`;

const FlexItem = styled.div`
  flex: ${props => props.flex || '1'};
`;

const ButtonLeft = styled(DotButton)`
  width: 14.5em;
  height: 12em;
`;

const ButtonRight = SecondaryButton.extend`
  width: 14.5em;
  height: 12em;
`;

export default () => (
  <FlexContainerCol justify="space-around">
    <Nav>
      <FlexItem>
        <HyperLink to="/cb/login" onClick={() => logout()}> Logout </HyperLink>
      </FlexItem>
      <FlexItem flex="2">
        <Heading> Who are you? </Heading>
      </FlexItem>
      <FlexItem />
    </Nav>
    <StyledSection>
      <FlexLink to="/visitor">
        <ButtonLeft> Visitor </ButtonLeft>
      </FlexLink>
      <FlexLink to="/admin/login">
        <ButtonRight> Admin </ButtonRight>
      </FlexLink>
    </StyledSection>
    <StyledSection />
  </FlexContainerCol>
);
