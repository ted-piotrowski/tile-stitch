import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Hack: To prevent scrolling on iOS Safari
window.onresize = function () {
  document.body.style.height = `${window.innerHeight}px`;
}
window.onresize(0 as any);
// End Hack: To prevent scrolling on iOS Safari

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
