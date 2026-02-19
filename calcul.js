// Initialisation de la carte
let map = L.map('map', {
    minZoom: 4,   // zoom minimum
    maxZoom: 18,   // zoom maximum
}).setView([0, 0], 4);

// Fond de carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

document.getElementById('gpsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Récupérer les coordonnées
    const piloteLat = parseFloat(this.pilote_lat.value);
    const piloteLng = parseFloat(this.pilote_long.value);
    const piloteAlt = parseFloat(this.pilote_alt.value);

    const droneLat = parseFloat(this.drone_lat.value);
    const droneLng = parseFloat(this.drone_long.value);
    const droneAlt = parseFloat(this.drone_alt.value);

    if(isNaN(piloteLat) || isNaN(piloteLng) || isNaN(droneLat) || isNaN(droneLng)) {
        alert("Veuillez entrer des coordonnées valides !");
        return;
    }

    // Supprimer les anciens marqueurs/lignes
    map.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    // Ajouter les points
    const piloteMarker = L.marker([piloteLat, piloteLng]).addTo(map)
        .bindPopup(`Pilote - Altitude: ${piloteAlt} m`).openPopup();
    const droneMarker = L.marker([droneLat, droneLng]).addTo(map)
        .bindPopup(`Drone - Altitude: ${droneAlt} m`);

    // Ligne pointillée
    const line = L.polyline([[piloteLat, piloteLng], [droneLat, droneLng]], {
        color: 'red',
        dashArray: '5, 10'
    }).addTo(map);

    // Centrer et zoomer pour inclure les deux points
    const bounds = L.latLngBounds([[piloteLat, piloteLng], [droneLat, droneLng]]);
    map.fitBounds(bounds, {padding: [50, 50]});

    // Calcul de la distance (au sol) en km
    const distanceGPS = map.distance([piloteLat, piloteLng], [droneLat, droneLng]);
    const difference = Math.abs(droneAlt-piloteAlt);
    const distanceDrone = Math.sqrt(Math.pow(distanceGPS,2) + Math.pow(difference,2))
    document.getElementById('distance').innerText = `Distance : ${distanceDrone.toFixed(2)} m`;



    // Après avoir calculé la distance
    const distanceDiv = document.getElementById('distance');
    distanceDiv.innerText = `Distance : ${distanceDrone.toFixed(2)} m`;

    // Afficher le div seulement maintenant
    distanceDiv.style.display = 'block';
});