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


export default () => (
  <FlexContainerCol justify="space-around">
    <StyledNav>
      <FlexItem>
        <HyperLink to="/logincb"> Logout </HyperLink>
      </FlexItem>
      <FlexItem flex="2">
        <Heading> Who are you? </Heading>
      </FlexItem>
      <FlexItem />
    </StyledNav>
    <StyledSection>
      <FlexLink to="/visitor">
        <PrimaryButtonNoFill large> Visitor </PrimaryButtonNoFill>
      </FlexLink>
      <FlexLink to="/admin/login">
        <SecondaryButton large> Admin </SecondaryButton>
      </FlexLink>
    </StyledSection>
    <StyledSection />
  </FlexContainerCol>
);
