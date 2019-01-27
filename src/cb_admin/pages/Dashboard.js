import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { SecondaryButton } from '../../shared/components/form/base';
import DotButton from '../../shared/components/form/DottedButton';
import NavHeader from '../../shared/components/NavHeader';
import { Link as StyledLink } from '../../shared/components/text/base';
import { CommunityBusiness } from '../../api';
import { redirectOnError } from '../../util';


const ButtonOne = styled(DotButton)`
  width: 14em;
  height: 12em;
`;

const ButtonTwo = styled(SecondaryButton) `
  width: 14em;
  height: 12em;
`;

const Row = styled(FlexContainerRow) `
  align-content: space-evenly;
`;

const ButtonWrapperLink = styled(StyledLink) `
  margin: 0 0.8em;
`;

const Caption = styled.p`
  margin: 1.5em 0 0 0;
  font-size: 0.7em;
  font-style: italic;
`;


export default class Dashboard extends React.Component {
  state = {
    orgName: '',
  }

  componentDidMount() {
    CommunityBusiness.update() // used to check cookie permissions
      .then(() => CommunityBusiness.get({ fields: ['name'] }))
      .then(res => this.setState({ orgName: res.data.result.name }))
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/cb/confirm' }));
  }

  render() {
    return (
      <FlexContainerCol>
        <NavHeader
          leftTo="/"
          leftContent="Back home"
          centerContent="Welcome admin! Where do you want to go?"
        />
        <Row>
          <ButtonWrapperLink to="/cb/activities">
            <ButtonOne>
              Activities
              <Caption>Edit what is happening at {this.state.orgName || 'your community business'}</Caption>
            </ButtonOne>
          </ButtonWrapperLink>
          <ButtonWrapperLink to="/cb/visits">
            <ButtonTwo>
              Visits
              <Caption>See who signed in</Caption>
            </ButtonTwo>
          </ButtonWrapperLink>
          <ButtonWrapperLink to="/cb/visitors">
            <ButtonOne>
              Visitors
              <Caption>View and edit your visitors&#39; details</Caption>
            </ButtonOne>
          </ButtonWrapperLink>
          <ButtonWrapperLink to="/cb/settings">
            <ButtonTwo>
              Account Settings
              <Caption>View and edit your business&#39; details</Caption>
            </ButtonTwo>
          </ButtonWrapperLink>
          <ButtonWrapperLink to="/cb/feedback">
            <ButtonOne>
              Feedback
              <Caption>See how your visitors feel about your business</Caption>
            </ButtonOne>
          </ButtonWrapperLink>
        </Row>
      </FlexContainerCol>
    );
  }
}


Dashboard.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
