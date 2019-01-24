import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CommunityBusiness, Visitors } from '../../../api';
import { redirectOnError, renameKeys } from '../../../util';
import { FlexContainerCol } from '../../../shared/components/layout/base';
import CreateAnonUserForm from './CreateAnonUserForm';
import PrintOption from './PrintOption';


const stage = {
  ONE: 'ONE',
  TWO: 'TWO',
};

export default class AnonUser extends Component {

  state = {
    name: 'ANON_',
    genders: [],
    errors: {},
    stage: stage.ONE,
  };

  componentDidMount() {
    CommunityBusiness.update() // used to check cookie permissions
      .then(() => {
        const getCb = CommunityBusiness.get({ fields: ['name', 'logoUrl', 'id'] });
        const getGenders = Visitors.genders();

        return Promise.all([getCb, getGenders]);
      })
      // .then(console.log)
      .then(([{ data: { result: cbRes } }, { data: { result: gendersRes } }]) =>
        this.setState({
          cbOrgName: cbRes.name,
          cbLogoUrl: cbRes.logoUrl,
          organisationId: cbRes.id,
          genders: [{ key: 0, value: '' }].concat(gendersRes.map(renameKeys({ id: 'key', name: 'value' }))),
        }))
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/cb/confirm' }));
  }


  onSubmit = (e) => {
    e.preventDefault();

    Visitors.create({
      name: this.state.name,
      gender: this.state.gender,
      birthYear: this.state.year,
      organisationId: this.state.organisationId,
      isAnonymous: true,
    })
      .then((res) => {
        this.setState({
          stage: stage.TWO,
          qrCode: res.data.result.qrCode,
        });
      });
  }

  handleChange = (e) => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value });
  }

  printOption = (<FlexContainerCol />)

  render() {
    const { state } = this;

    switch (state.stage) {
      case stage.ONE:
        return (<CreateAnonUserForm
          handleChange={this.handleChange}
          onSubmit={this.onSubmit}
          errors={this.state.errors}
          genders={this.state.genders}
        />);
      case stage.TWO:
        return (<PrintOption
          onClickPrint={() => window.print()}
          qrCode={state.qrCode}
          cbLogoUrl={state.cbLogoUrl}
        />);
      default:
        return this.createUserForm; // necessary as js is useless
    }
  }
}


AnonUser.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
