// 🔥 CLEAR OLD DATA ON PAGE LOAD
firebase.database().ref("accidents").remove();
// 🔥 Map setup
const map = L.map('map').setView([20, 77], 5);

// 🌍 Standard
const standard = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
);

// 🛰️ Satellite
const satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
);

standard.addTo(map);

// 🔥 Layer control
L.control.layers({
  "Standard": standard,
  "Satellite": satellite
}).addTo(map);

let marker;

// 🔥 Firebase listener
firebase.database().ref("accidents").on("value", (snapshot) => {

  const dataObj = snapshot.val();

  if (!dataObj) {
    clearUI();
    return;
  }

  const keys = Object.keys(dataObj);
  const data = dataObj[keys[keys.length - 1]];

  const lat = Number(data.lat);
  const lng = Number(data.lng);

  // Remove old marker
  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lng]).addTo(map);

  marker.bindPopup(
    `<b>🚨 Accident Alert</b><br>
     Driver: ${data.name || "-"}<br>
     Vehicle: ${data.vehicleModel || "-"}<br>
     No: ${data.vehicleNo || "-"}<br>
     Type: ${data.vehicleType || "-"}<br>
     Emergency: ${data.emergency || "-"}<br>
     Speed: ${(data.speed || 0)} km/h`
  ).openPopup();

  map.setView([lat, lng], 15);

  // Update panel
  document.getElementById("dName").innerText = data.name || "-";
  document.getElementById("dLat").innerText = lat.toFixed(5);
  document.getElementById("dLng").innerText = lng.toFixed(5);
  document.getElementById("dSpeed").innerText = (data.speed || 0) + " km/h";

  document.getElementById("dPhone").innerText = data.phone || "-";
  document.getElementById("dEmergency").innerText = data.emergency || "-";
  document.getElementById("dVehicleNo").innerText = data.vehicleNo || "-";
  document.getElementById("dVehicleType").innerText = data.vehicleType || "-";
  document.getElementById("dVehicleModel").innerText = data.vehicleModel || "-";

});

// 🔥 CLEAR UI FUNCTION
function clearUI() {
  document.getElementById("dName").innerText = "-";
  document.getElementById("dLat").innerText = "-";
  document.getElementById("dLng").innerText = "-";
  document.getElementById("dSpeed").innerText = "-";
  document.getElementById("dPhone").innerText = "-";
  document.getElementById("dEmergency").innerText = "-";
  document.getElementById("dVehicleNo").innerText = "-";
  document.getElementById("dVehicleType").innerText = "-";
  document.getElementById("dVehicleModel").innerText = "-";

  if (marker) {
    map.removeLayer(marker);
  }
}

// 🔥 BUTTON FIX (FINAL)
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("resolveBtn");

  btn.addEventListener("click", () => {

    firebase.database().ref("accidents").remove().then(() => {
      clearUI();
      alert("✅ Case Resolved");
    });

  });

});