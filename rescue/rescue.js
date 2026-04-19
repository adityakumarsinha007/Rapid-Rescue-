// ===============================
// 🔥 RESET OLD DATA ON LOAD
// ===============================
firebase.database().ref("accidents").remove();

// ===============================
// 🗺️ MAP INIT
// ===============================
const map = L.map('map').setView([20, 77], 5);

// ===============================
// 🗺️ TILE LAYERS
// ===============================
const mapLayers = {
  street: L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  ),

  satellite: L.tileLayer(
    "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    { subdomains: ["mt0", "mt1", "mt2", "mt3"] }
  ),

  terrain: L.tileLayer(
    "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    { subdomains: ["mt0", "mt1", "mt2", "mt3"] }
  ),

  dark: L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  )
};

let currentLayer = mapLayers.street;
currentLayer.addTo(map);

let marker = null;

// ===============================
// 🔄 CHANGE MAP TYPE
// ===============================
function changeMapType() {

  const type =
    document.getElementById("mapType").value;

  map.removeLayer(currentLayer);

  currentLayer = mapLayers[type];

  currentLayer.addTo(map);
}

// ===============================
// 📊 ANALYTICS
// ===============================
let totalAlerts = 0;
let highImpactCases = 0;
let solvedCases = 0;

// ===============================
// 🔊 SOUND
// ===============================
let soundEnabled = true;
let sirenInterval = null;

function toggleSound() {

  soundEnabled = !soundEnabled;

  document.getElementById("soundBtn").innerText =
    soundEnabled ? "🔊 ON" : "🔇 OFF";

  if (!soundEnabled) stopSiren();
}

function playOneSiren() {

  const ctx =
    new (window.AudioContext ||
      window.webkitAudioContext)();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";

  osc.frequency.setValueAtTime(
    700,
    ctx.currentTime
  );

  osc.frequency.linearRampToValueAtTime(
    1100,
    ctx.currentTime + 0.4
  );

  osc.frequency.linearRampToValueAtTime(
    700,
    ctx.currentTime + 0.8
  );

  osc.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(
    0.05,
    ctx.currentTime
  );

  osc.start();
  osc.stop(ctx.currentTime + 1.2);
}

function startSiren() {

  if (!soundEnabled) return;

  stopSiren();

  playOneSiren();

  sirenInterval = setInterval(() => {

    if (soundEnabled) {
      playOneSiren();
    }

  }, 1300);
}

function stopSiren() {

  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
}

// ===============================
// 🚨 OVERLAY
// ===============================
function showOverlay() {

  const overlay =
    document.getElementById("accidentOverlay");

  document.querySelector(".main").style.visibility =
    "hidden";

  overlay.classList.add("show");

  setTimeout(() => {

    overlay.classList.remove("show");

    document.querySelector(".main").style.visibility =
      "visible";

  }, 2000);
}

// ===============================
// 📊 UPDATE ANALYTICS
// ===============================
function refreshAnalytics() {

  document.getElementById("aTotal").innerText =
    totalAlerts;

  document.getElementById("aHigh").innerText =
    highImpactCases;

  document.getElementById("aSolved").innerText =
    solvedCases;
}

// ===============================
// 🟢 SHOW NO ACCIDENT
// ===============================
function showSafeMode() {

  document.getElementById(
    "noAccidentBox"
  ).style.display = "flex";

  document.getElementById(
    "accidentCard"
  ).style.display = "none";
}

// ===============================
// 🚨 SHOW ACCIDENT CARD
// ===============================
function showAccidentCard() {

  document.getElementById(
    "noAccidentBox"
  ).style.display = "none";

  document.getElementById(
    "accidentCard"
  ).style.display = "flex";
}

// ===============================
// ✔ SOLVE ISSUE
// ===============================
function solveIssue() {

  firebase.database()
    .ref("accidents")
    .remove();

  if (marker) {
    map.removeLayer(marker);
    marker = null;
  }

  stopSiren();

  solvedCases++;

  refreshAnalytics();

  showSafeMode();

  map.setView([20, 77], 5);
}

// Start in safe mode
showSafeMode();
refreshAnalytics();

// ===============================
// 🔥 FIREBASE LISTENER
// ===============================
firebase.database()
.ref("accidents")
.on("value", (snapshot) => {

  const dataObj = snapshot.val();

  if (!dataObj) return;

  const keys =
    Object.keys(dataObj);

  const data =
    dataObj[keys[keys.length - 1]];

  // Show card
  showAccidentCard();

  // Overlay + siren
  showOverlay();
  startSiren();

  const lat = Number(data.lat);
  const lng = Number(data.lng);

  if (marker) {
    map.removeLayer(marker);
  }

  marker =
    L.marker([lat, lng]).addTo(map);

  // Popup
  marker.bindPopup(`
    <b>🚨 Accident Alert</b><br><br>
    <b>Driver:</b> ${data.name || "-"}<br>
    <b>Vehicle No:</b> ${data.vehicleNo || "-"}<br>
    <b>Type:</b> ${data.vehicleType || "-"}<br>
    <b>Model:</b> ${data.vehicleModel || "-"}<br>
    <b>Emergency:</b> ${data.emergency || "-"}<br>
    <b>Speed:</b> ${data.speed || 0} km/h<br>
    <b>Impact:</b> ${data.impact || "-"}<br>
    <b>Equipment:</b> ${data.equipment || "-"}
  `);

  marker.openPopup();

  map.setView([lat, lng], 15);

  // Sidebar data
  document.getElementById("dName").innerText =
    data.name || "-";

  document.getElementById("dLat").innerText =
    lat.toFixed(5);

  document.getElementById("dLng").innerText =
    lng.toFixed(5);

  document.getElementById("dSpeed").innerText =
    (data.speed || 0) + " km/h";

  document.getElementById("dPhone").innerText =
    data.phone || "-";

  document.getElementById("dEmergency").innerText =
    data.emergency || "-";

  document.getElementById("dVehicleNo").innerText =
    data.vehicleNo || "-";

  document.getElementById("dVehicleType").innerText =
    data.vehicleType || "-";

  document.getElementById("dVehicleModel").innerText =
    data.vehicleModel || "-";

  document.getElementById("dImpact").innerText =
    data.impact || "-";

  document.getElementById("dEquipment").innerText =
    data.equipment || "-";

  // Counters
  totalAlerts++;

  if (
    data.impact === "HIGH IMPACT" ||
    data.impact === "CRITICAL IMPACT"
  ) {
    highImpactCases++;
  }

  refreshAnalytics();

});