import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PrimaryButtonNoFill, SecondaryButton } from '../components/form/base';
import { Heading, Link as HyperLink } from '../components/text/base';
import { FlexContainerCol } from '../components/layout/base';


const StyledNav = styled.nav`
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

const ButtonLeft = styled(PrimaryButtonNoFill)`
  width: 30vh;
  height: 25vh;
`;

const ButtonRight = styled(SecondaryButton) `
  width: 30vh;
  height: 25vh;
`;

const logout = props => () => {
  localStorage.removeItem('token');
  props.updateLoggedIn();
};

export default props => (
  <FlexContainerCol justify="space-around">
    <StyledNav>
      <FlexItem>
        <HyperLink to="/logincb" onClick={logout(props)}> Logout </HyperLink>
      </FlexItem>
      <FlexItem flex="2">
        <Heading> Who are you? </Heading>
      </FlexItem>
      <FlexItem />
    </StyledNav>
    <StyledSection>
      <FlexLink to="/visitor">
        <ButtonLeft large> Visitor </ButtonLeft>
      </FlexLink>
      <FlexLink to="/admin/login">
        <ButtonRight large> Admin </ButtonRight>
      </FlexLink>
    </StyledSection>
    <StyledSection />
  </FlexContainerCol>
);
