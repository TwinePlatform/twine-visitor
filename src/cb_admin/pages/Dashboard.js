import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { SecondaryButton } from '../../shared/components/form/base';
import DotButton from '../../shared/components/form/DottedButton';
import NavHeader from '../../shared/components/NavHeader';
import { Link as StyledLink } from '../../shared/components/text/base';
import { CommunityBusiness } from '../../api';
import { redirectOnError } from '../../util';


const ButtonOne = styled(DotButton)`
  width: 14em;
  height: 12em;
  margin: 1em 0;
`;

const ButtonTwo = styled(SecondaryButton) `
  width: 14em;
  height: 12em;
  margin: 1em 0;
`;

const ButtonWrapperLink = styled(StyledLink) `
  margin: 1em;
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
      <Grid>
        <NavHeader
          leftTo="/"
          leftContent="Back home"
          centerContent="Welcome admin! Where do you want to go?"
        />
        <Row>
          <Col xs={12} sm={6} md={4}>
            <ButtonWrapperLink to="/cb/activities">
              <ButtonOne>
              Activities
                <Caption>Edit what is happening at {this.state.orgName || 'your community business'}</Caption>
              </ButtonOne>
            </ButtonWrapperLink>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ButtonWrapperLink to="/cb/visits">
              <ButtonTwo>
              Visits
                <Caption>See who signed in</Caption>
              </ButtonTwo>
            </ButtonWrapperLink>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ButtonWrapperLink to="/cb/visitors">
              <ButtonOne>
              Visitors
                <Caption>View and edit your visitors&#39; details</Caption>
              </ButtonOne>
            </ButtonWrapperLink>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ButtonWrapperLink to="/cb/settings">
              <ButtonTwo>
              Account Settings
                <Caption>View and edit your business&#39; details</Caption>
              </ButtonTwo>
            </ButtonWrapperLink>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ButtonWrapperLink to="/cb/feedback">
              <ButtonOne>
              Feedback
                <Caption>See how your visitors feel about your business</Caption>
              </ButtonOne>
            </ButtonWrapperLink>
          </Col>
        </Row>
      </Grid>
    );
  }
}


Dashboard.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
