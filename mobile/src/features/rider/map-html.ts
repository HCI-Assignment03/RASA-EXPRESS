import type { LatLng } from '@/types';

/**
 * The page shown inside the R2 map WebView: a Leaflet map on OpenStreetMap tiles.
 * It marks the pickup (P), the drop-off (D) and a dashed line between them. The rider's own
 * position is added afterwards by calling window.setRider(lat, lng) from the app.
 * No API key is needed (deviation D04: OpenStreetMap instead of Google Maps).
 */
export function buildMapHtml(pickup: LatLng, dropoff: LatLng): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; background: #FBE3CC; }
  .pin { width: 32px; height: 32px; border-radius: 16px; color: #fff; font: 700 16px sans-serif;
         text-align: center; line-height: 32px; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.4); }
  .pickup { background: #F26B1D; }
  .dropoff { background: #2E9E5B; }
  .rider { width: 18px; height: 18px; border-radius: 9px; background: #1D6FF2; border: 3px solid #fff;
           box-shadow: 0 0 0 4px rgba(29,111,242,.3); }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var pickup = [${pickup.lat}, ${pickup.lng}];
  var dropoff = [${dropoff.lat}, ${dropoff.lng}];
  var map = L.map('map', { zoomControl: true }).setView(pickup, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  function pin(cls, letter) {
    return L.divIcon({ className: '', html: '<div class="pin ' + cls + '">' + letter + '</div>',
                       iconSize: [32, 32], iconAnchor: [16, 16] });
  }
  L.marker(pickup, { icon: pin('pickup', 'P') }).addTo(map);
  L.marker(dropoff, { icon: pin('dropoff', 'D') }).addTo(map);
  L.polyline([pickup, dropoff], { color: '#F26B1D', weight: 4, dashArray: '8 8' }).addTo(map);

  var points = [pickup, dropoff];
  var riderMarker = null;
  map.fitBounds(points, { padding: [40, 40] });

  window.setRider = function (lat, lng) {
    var at = [lat, lng];
    if (!riderMarker) {
      riderMarker = L.marker(at, {
        icon: L.divIcon({ className: '', html: '<div class="rider"></div>', iconSize: [18, 18], iconAnchor: [9, 9] })
      }).addTo(map);
      map.fitBounds(points.concat([at]), { padding: [40, 40] });
    } else {
      riderMarker.setLatLng(at);
    }
  };
</script>
</body>
</html>`;
}
