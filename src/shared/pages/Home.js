import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BeatLoader as Bl } from 'react-spinners';
import { SecondaryButton } from '../components/form/base';
import { Heading, Link as HyperLink, Heading2 } from '../components/text/base';
import { FlexContainerCol } from '../components/layout/base';
import DotButton from '../components/form/DottedButton';
import { CommunityBusiness, CbAdmin } from '../../api';
import { redirectOnError } from '../../util';
import { colors } from '../style_guide';


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

const BeatLoader = styled(Bl)`
  width: 60px;
  margin: 0 auto;
  padding-top: 5rem;
`;

const onLoadState = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
};

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cbName: null,
      onLoadState: onLoadState.PENDING,
    };
  }

  componentDidMount() {
    CbAdmin.downgradePermissions()
      .then(() => CommunityBusiness.get({ fields: ['name'] }))
      .then(res => this.setState({
        cbName: res.data.result.name,
        onLoadState: onLoadState.SUCCESS,
      }))
    // on first load this redirects to login if bad/no cookie is present
      .catch(err => redirectOnError(this.props.history.push, err));
  }

  render() {
    return this.state.onLoadState !== onLoadState.SUCCESS
      ? <BeatLoader
        color={colors.highlight_primary}
        sizeUnit={'px'}
        size={15}
      />
      : (
        <FlexContainerCol justify="space-around">
          <Nav>
            <FlexItem>
              <HyperLink to="/cb/login" onClick={() => CbAdmin.logout()}> Logout </HyperLink>
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
