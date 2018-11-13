import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SecondaryButton } from '../components/form/base';
import { Heading, Link as HyperLink, Heading2 } from '../components/text/base';
import { FlexContainerCol } from '../components/layout/base';
import DotButton from '../components/form/DottedButton';
import { logout, CommunityBusiness, ErrorUtils } from '../../api';


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

const ButtonRight = styled(SecondaryButton)`
  width: 14.5em;
  height: 12em;
`;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cbName: null,
    };
  }

  componentDidMount() {
    CommunityBusiness.get()
      .then((res) => {
        this.setState({ cbName: res.data.result.name });
      })
      .catch((error) => {
        // on first load this redirects to login if bad/no cookie is present

        if (ErrorUtils.errorStatusEquals(error, 401) || ErrorUtils.errorStatusEquals(error, 403)) {
          this.props.history.push('/cb/login');

        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');

        } else if (ErrorUtils.errorStatusEquals(error, 404)) {
          this.props.history.push('/error/404');

        } else {
          this.props.history.push('/error/unknown');
        }
      });
  }
  render() {
    return (
      <FlexContainerCol justify="space-around">
        <Nav>
          <FlexItem>
            <HyperLink to="/cb/login" onClick={() => logout()}> Logout </HyperLink>
          </FlexItem>
          <FlexItem flex="2">
            <Heading> Welcome to {this.state.cbName} </Heading>
            <Heading2> Who are you? </Heading2>
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
  }
}

Home.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
