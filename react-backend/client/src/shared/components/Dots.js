import styled from 'styled-components';


export default styled.div`
  z-index: -1;
  left: 50%;
  top: 0;
  transform: translate3d(-50%, 0, 0);
  overflow: hidden;

  &, &::before, &::after {
    background-color: #FFF;
    background-image: radial-gradient(#F7F7F7 4px, transparent 0);
    background-size: 2em 2em;
    background-position: center 0;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  &::after {
    left: 100%;
  }

  &::after, &::before {
    content: '';
  }

  &::before {
    right: 100%;
  }

  @media print {
    background: white;
  }
`;
