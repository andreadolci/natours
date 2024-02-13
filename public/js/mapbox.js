const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

let mapboxgl = import('mapbox-gl');

mapboxgl.accessToken =
  'pk.eyJ1IjoiYW5kcmVhZG9sY2kiLCJhIjoiY2xzajVxZDE0MTFyZzJrbGh4MDA5b3M4ZyJ9.89j458tAs_Sab9GL9JVO2g';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
});
