import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'normalize.css';
import './styles/index.css';
import './styles/DatePicker.css';
import './styles/ReactPagination.css';
import App from './App';
import { unregister } from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
unregister();
