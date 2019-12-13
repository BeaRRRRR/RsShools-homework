export function getRandomImage() {
  return fetch(`https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=5145f2670a6d7ea885c0c735f232e6e7d18020484f71ef08cae23caf7989c673`)
    .then(response => response.json())
    .then(json => json.urls.full);
}
