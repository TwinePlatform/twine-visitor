/* global Instascan */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const Video = styled.video`
  background-color: black;
  border-radius: 0.2em;
  width: 100%;
`;

const QrContainer = styled.div`
  text-align: center;
`;

const instascanAvailable = () => {
  try {
    return Boolean(Instascan.Scanner);
  } catch (error) {
    return false;
  }
};


export default class QrScanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasScanned: false,
      errors: {},
    };

    this.playbackRef = null;
    this.scanner = null;

    this.setPlaybackRef = (element) => {
      this.playbackRef = element;
    };
  }

  componentDidMount() {
    if (!instascanAvailable()) {
      this.props.onScannerError(new Error('Instascan is not available'));
      return;
    }

    this.scanner =
      this.scanner || new Instascan.Scanner({ video: this.playbackRef, scanPeriod: 5 });

    Instascan.Camera.getCameras()
      .then((cameras) => {
        if (cameras.length < 1) {
          throw new Error('No accessible cameras');
        }
        return this.scanner.start(cameras[0]);
      })
      .catch(error => this.props.onCameraError(error));

    if (!this.state.hasScanned) {
      this.scanner.addListener('scan', this.scanListener);
    }
  }

  componentWillUnmount() {
    if (this.scanner) {
      this.scanner.stop()
        .then(() => {
          this.scanner = null;
        })
        .catch(error => this.props.onScannerError(error));

      this.scanner.removeListener('scan', this.scanListener);
    }
  }

  scanListener = (content) => {
    this.scanner.stop();
    this.setState({ hasScanned: true });
    this.props.onScan(content);
  }

  render() {
    return (
      <QrContainer id="qr-scanner-container">
        <Video ref={this.setPlaybackRef} />
      </QrContainer>
    );
  }
}

QrScanner.propTypes = {
  onCameraError: PropTypes.func,
  onScannerError: PropTypes.func,
  onScan: PropTypes.func,
};

QrScanner.defaultProps = {
  onCameraError: () => {},
  onScannerError: () => {},
  onScan: () => {},
};
