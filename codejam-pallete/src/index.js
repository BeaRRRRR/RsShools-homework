import './scss/main.scss';
import Canvas from './js/canvas';

const canvas = new Canvas();

// Needed for Hot Module Replacement
if (typeof (module.hot) !== 'undefined') {
  module.hot.accept(); // eslint-disable-line no-undef
}
