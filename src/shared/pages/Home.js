import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SecondaryButton } from '../components/form/base';
import { Heading, Heading2 } from '../components/text/base';
import { FlexContainerCol } from '../components/layout/base';
import DotButton from '../components/form/DottedButton';
import NavHeader from '../components/NavHeader';
import { CommunityBusiness, CbAdmin } from '../../api';
import { redirectOnError } from '../../util';


const StyledSection = styled.section`
  display: flex;
  justify-content: center;
`;

const FlexLink = styled(Link)`
  flex: 1 0 20vh;
  text-align: center;
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
    CommunityBusiness.get({ fields: ['name'] })
      .then(res => this.setState({
        cbName: res.data.result.name,
      }))
      .catch(err => redirectOnError(this.props.history.push, err));
  }

  render() {
    return (
      <FlexContainerCol justify="space-around">
        <NavHeader
          leftTo="/login"
          leftContent="Logout"
          leftOnClick={() => CbAdmin.logout()}
          centerContent={
              <>
                <Heading> Welcome to {this.state.cbName} </Heading>
                <Heading2> Who are you? </Heading2>
              </>
          }
        />
        <StyledSection>
          <FlexLink to="/visitor/home">
            <ButtonLeft> Visitor </ButtonLeft>
          </FlexLink>
          <FlexLink to="/admin">
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
