import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { PrimaryButtonNoFill, SecondaryButton } from '../../shared/components/form/base';
import DotButton from '../../shared/components/form/DottedButton';
import { Heading, Link as StyledLink } from '../../shared/components/text/base';
import { CbAdmin } from '../../api';


const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FlexItem = styled.div`
  flex: ${props => props.flex || '1'};
`;

const ButtonOne = styled(DotButton)`
  width: 14em;
  height: 12em;
`;

const ButtonTwo = SecondaryButton.extend`
  width: 14em;
  height: 12em;
`;

const Row = FlexContainerRow.extend`
  align-content: space-evenly;
`;

const ButtonWrapperLink = StyledLink.extend`
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
    CbAdmin.get(this.props.auth)
      .then(res => this.setState({ orgName: res.data.result.org_name }))
      .catch((error) => {
        console.log(error);
        this.props.history.push('/cb/login');
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    this.props.updateAdminToken('');
    this.props.updateLoggedIn();
  }

  render() {
    return (
      <FlexContainerCol>
        <Nav>
          <FlexItem>
            <StyledLink to="/cb/login" onClick={this.logout}>Logout</StyledLink>
          </FlexItem>
          <FlexItem flex="2">
            <Heading>Welcome admin! Where do you want to go?</Heading>
          </FlexItem>
          <FlexItem />
        </Nav>
        <Row>
          <ButtonWrapperLink to="/cb/activities">
            <ButtonOne>
              Activities
              <Caption>Edit what is happening at {this.state.orgName}</Caption>
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
  auth: PropTypes.string.isRequired,
  updateAdminToken: PropTypes.func.isRequired,
  updateLoggedIn: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
