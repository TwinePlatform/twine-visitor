import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Link } from 'react-router-dom';
import { Logoutbutton } from '../visitors/logoutbutton';
import { adminPost } from './activitiesLib/admin_helpers';

export class AdminCBSettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: 'PENDING',
      org_name: '',
      genre: '',
      email: '',
      signupDate: '',
      id: '',
      errorMessage: '',
      uploadedFileCloudinaryUrl: '',
      cbLogo: '',
    };
  }

  componentDidMount() {
    adminPost(this, '/cb/details')
      .then(res => res.details[0])
      .then(this.setCB)
      .catch(error => {
        if (error.message === 500) {
          this.props.history.push('/internalServerError');
        } else if (error.message === 'No admin token') {
          this.props.history.push('/admin/login');
        } else {
          this.props.history.push('/admin/login');
        }
      });
  }

  clearUploadUrl = () => {
    this.setState({
      uploadedFileCloudinaryUrl: '',
    });
  };

  setErrorMessage = (error, errorString) => {
    // console.log(error) // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0],
      errorMessage: '',
      successMessage: '',
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    const CLOUDINARY_UPLOAD_PRESET = 'cklrrn9k';
    const CLOUDINARY_UPLOAD_URL =
      'https://api.cloudinary.com/v1_1/dqzxe8mav/upload';
    const cloudinaryForm = new FormData();
    cloudinaryForm.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    cloudinaryForm.append('file', file);

    fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: cloudinaryForm,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.secure_url) {
          this.setState({
            uploadedFileCloudinaryUrl: res.secure_url,
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setErrorMessage(err, 'Failed to upload the logo');
      });
  }

  setCB = cb => {
    this.setState({
      id: cb.id,
      org_name: cb.org_name,
      genre: cb.genre,
      email: cb.email,
      signupDate: cb.date.replace(/T/g, ' ').slice(0, 19),
      errorMessage: '',
      cbLogo: cb.uploadedfilecloudinaryurl,
      auth: 'SUCCESS',
    });
  };

  submitConfirmation = () => {
    this.setState({
      successMessage: 'The account details have been successfully updated',
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: '',
      successMessage: '',
    });
  };

  handleChangeGenre = e => {
    this.setState({ genre: e.target.value, successMessage: '' });
  };

  handleEmptySubmit = event => {
    event.preventDefault();
    this.setState({
      errorMessage: 'Please do not leave empty input fields',
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { org_name, genre, email, uploadedFileCloudinaryUrl } = this.state;

    adminPost(this, '/cb/details/update', {
      org_name,
      genre,
      email,
      uploadedFileCloudinaryUrl,
    })
      .then(res => res.details)
      .then(this.setCB)
      .then(this.submitConfirmation)
      .then(this.clearUploadUrl)
      .catch(error => this.props.history.push('/internalServerError'));
  };

  render() {
    const submitHandler =
      this.state.org_name && this.state.genre && this.state.email
        ? this.handleSubmit
        : this.handleEmptySubmit;

    return this.state.auth === 'SUCCESS' ? (
      <div>
        <div>
          <h1>{this.state.org_name}s Details</h1>
          <table>
            <tbody>
              <tr>
                <td>Business logo</td>
                <td>
                  {this.state.cbLogo && (
                    <img
                      className="CB__Logo"
                      src={this.state.cbLogo}
                      alt="This is your community business logo"
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td>Business Id</td>
                <td>{this.state.id}</td>
              </tr>
              <tr>
                <td> Business Name </td>
                <td>{this.state.org_name}</td>
              </tr>
              <tr>
                <td> Type of Business </td>
                <td>{this.state.genre}</td>
              </tr>
              <tr>
                <td>Business email</td>
                <td>{this.state.email}</td>
              </tr>
              <tr>
                <td>Business Registration Date</td>
                <td>{this.state.signupDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>Edit {this.state.org_name}s Details</h2>
        {this.state.errorMessage && (
          <span className="ErrorText">{this.state.errorMessage}</span>
        )}
        {this.state.successMessage && (
          <span className="SuccessText">{this.state.successMessage}</span>
        )}
        <form>
          <label className="Form__Label">
            Edit Business Name
            <input
              className="Form__Input"
              type="text"
              name="org_name"
              onChange={this.handleChange}
              value={this.state.org_name}
            />
          </label>
          <label className="Form__Label">
            Edit Type of Business
            <select className="Form__Input" onChange={this.handleChangeGenre}>
              <option defaultValue value={this.state.genre}>
                Change genre: {this.state.genre}
              </option>
              <option value="Art centre or facility">
                Art centre or facility
              </option>
              <option value="Community hub, facility or space">
                Community hub, facility or space
              </option>
              <option value="Community pub, shop or café">
                Community pub, shop or café
              </option>
              <option value="Employment, training, business support or education">
                Employment, training, business support or education
              </option>
              <option value="Energy">Energy</option>
              <option value="Environment or nature">
                Environment or nature
              </option>
              <option value="Food catering or production (incl. farming)">
                Food catering or production (incl. farming)
              </option>
              <option value="Health, care or wellbeing">
                Health, care or wellbeing
              </option>
              <option value="Housing">Housing</option>
              <option value="Income or financial inclusion">
                Income or financial inclusion
              </option>
              <option value="Sport & leisure">Sport & leisure</option>
              <option value="Transport">Transport</option>
              <option value="Visitor facilities or tourism">
                Visitor facilities or tourism
              </option>
              <option value="Waste reduction, reuse or recycling">
                Waste reduction, reuse or recycling
              </option>
            </select>
          </label>

          <label className="Form__Label">
            Edit Email
            <input
              className="Form__Input"
              type="text"
              name="email"
              onChange={this.handleChange}
              value={this.state.email}
            />
          </label>
        </form>
        <div className="Dropzone">
          <Dropzone
            className={this.state.uploadedFileCloudinaryUrl ? 'hidden' : ''}
            multiple={false}
            accept="image/*"
            onDrop={this.onImageDrop.bind(this)}
          >
            <p>Drop a logo or click to select a file to upload.</p>
          </Dropzone>
          {this.state.uploadedFileCloudinaryUrl && (
            <React.Fragment>
              <button onClick={this.clearUploadUrl}>X</button>
              <img
                src={this.state.uploadedFileCloudinaryUrl}
                alt="This is the uploaded logo"
              />
            </React.Fragment>
          )}
        </div>
        <button className="Button" onClick={submitHandler}>
          Submit
        </button>
        <Link to="/admin">
          <button className="Button ButtonBack">
            Back to the admin menu page
          </button>
        </Link>
        <br />
        <Logoutbutton
          updateLoggedIn={this.props.updateLoggedIn}
          redirectUser={this.props.history.push}
        />
        <br />
      </div>
    ) : (
      <div>Checking admin details</div>
    );
  }
}
