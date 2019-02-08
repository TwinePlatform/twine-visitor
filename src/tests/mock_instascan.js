export default {
  Scanner: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(() => Promise.resolve()),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
  Camera: {
    getCameras: jest.fn(() => Promise.resolve([{}])),
  },
};
