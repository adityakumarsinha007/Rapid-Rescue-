firebase.database().ref("accidents").remove();

const map = L.map('map').setView([20, 77], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker;

/* 🚨 OVERLAY FUNCTION */
function showOverlay() {
  const overlay = document.getElementById("accidentOverlay");

  document.querySelector(".main").style.visibility = "hidden";

  overlay.classList.add("show");

  setTimeout(() => {
    overlay.classList.remove("show");
    document.querySelector(".main").style.visibility = "visible";
  }, 2000);
}

/* FIREBASE LISTENER */
firebase.database().ref("accidents").on("value", (snapshot) => {

  const dataObj = snapshot.val();

  if (!dataObj) return;

  const keys = Object.keys(dataObj);
  const data = dataObj[keys[keys.length - 1]];

  showOverlay(); // 🔥 MAIN FEATURE

  const lat = Number(data.lat);
  const lng = Number(data.lng);

  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lng]).addTo(map);

  map.setView([lat, lng], 15);

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