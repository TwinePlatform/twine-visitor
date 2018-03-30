import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import { rgba } from 'polished';
import { colors } from '../../shared/style_guide';
import uploadSvg from '../assets/icons/upload.svg';


const StyledDropzone = styled(Dropzone) `
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 8em;
  width: 90%;
  margin: 1.2em 0 2em 0;
  border: 0.1em dashed ${colors.light};
  border-radius: 0;
  background-color: ${rgba(colors.highlight_primary, 0.06)};
  color: ${colors.dark};
  text-align: center;
`;

const UploadIcon = styled.img`
  height: 3em;
  width: auto;
  display: block;
  margin: 0 auto;
`;


const DropZone = props => (
  <StyledDropzone
    maxSize={2e10 * 5}
    multiple={false}
    disabled={props.disabled}
    onDrop={props.onDrop}
  >
    <UploadIcon alt="upload icon" src={uploadSvg} />
    { props.content }
  </StyledDropzone>
);

DropZone.propTypes = {
  content: PropTypes.string,
  disabled: PropTypes.bool,
  onDrop: PropTypes.func,
};

DropZone.defaultProps = {
  content: 'Drag your logo here or click to upload',
  disabled: false,
  onDrop: () => {},
};

export default DropZone;
