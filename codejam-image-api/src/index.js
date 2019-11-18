import './scss/main.scss';
import netlifyIdentity from 'netlify-identity-widget';
import Canvas from './js/canvas';

netlifyIdentity.init({
  container: '#netlify-modal',
});

const canvas = new Canvas();

document.getElementById('searchSubmit').addEventListener('click', async (event) => {
  event.preventDefault();
  const city = document.getElementById('search-bar').value;
  // eslint-disable-next-line max-len
  const url = `https://api.unsplash.com/photos/random?query=town,${city}&client_id=f809e76f3410e5f384bfce6a5dd6a9a516bb8f3e16797e65428f16558f9d4b37`;
  const response = await fetch(url);
  const json = await response.json();
  canvas.drawImageFromUrl(json.urls.full);
});
// Needed for Hot Module Replacement
if (typeof (module.hot) !== 'undefined') {
  module.hot.accept(); // eslint-disable-line no-undef
}
