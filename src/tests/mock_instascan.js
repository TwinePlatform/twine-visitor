export default {
  Scanner: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
  Camera: {
    getCameras: jest.fn(),
  },
};
