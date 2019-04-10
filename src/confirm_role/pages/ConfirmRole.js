import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import { Col } from 'react-flexbox-grid';
import { parse } from 'querystring';
import { Heading, Paragraph } from '../../shared/components/text/base';
import NavHeader from '../../shared/components/NavHeader';
import { Visitors, ResponseUtils, ErrorUtils } from '../../api';
import { colors } from '../../shared/style_guide';


const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const ErrorText = styled(Paragraph)`
  color: ${colors.error};
`;

const status = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

class ConfirmRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: status.PENDING,
    };
  }

  componentDidMount() {
    const { props: { location: { search }, match: { params: { token } } } } = this;
    const { userId, organisationId, role } = parse(search.replace('?', ''));

    Visitors.addRole({ token, userId, organisationId, role: role && role.toUpperCase() })
      .then((r) => {
        const res = ResponseUtils.getResponse(r);
        return res.token
          ? this.props.history.push(`/password/reset/${res.token}?email=${res.email}`)
          : this.setState({ status: status.SUCCESS });
      })
      .catch(e => this.setState({
        status: status.FAILURE,
        errors: ErrorUtils.getErrorMessage(e),
      }));
  }

  render() {
    const { role } = parse(this.props.location.search.replace('?', ''));
    return (
      <Col>
        <NavHeader
          centerContent={
            <Heading>Add {role} Role</Heading>
          }
        />
        <StyledSection>
          {this.state.status === status.PENDING && (
            <BeatLoader
              color={colors.highlight_primary}
              sizeUnit={'px'}
              size={15}
            />
          )}
          {this.state.status === status.SUCCESS && (
            <Paragraph>
              Visitor account has been created. See email for QR code.
            </Paragraph>
          )}
          {this.state.status === status.FAILURE && (
            <>
              <ErrorText>{this.state.errors}</ErrorText>
              <Paragraph>
                Sorry there has been an error creating your account.
                Please talk to your Community Business about setting up an account
              </Paragraph>
            </>
          )}

        </StyledSection>
      </Col>
    );
  }
}

ConfirmRole.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  match: PropTypes.shape({ params: PropTypes.string }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default withRouter(ConfirmRole);
