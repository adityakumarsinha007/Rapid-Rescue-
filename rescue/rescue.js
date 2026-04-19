// ===============================
// 🔥 RESET OLD DATA ON LOAD
// ===============================
firebase.database().ref("accidents").remove();

// ===============================
// 🗺️ MAP INIT
// ===============================
const map = L.map('map').setView([20, 77], 5);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

let marker;

// ===============================
// 📊 ANALYTICS
// ===============================
let totalAlerts = 0;
let highImpactCases = 0;

// ===============================
// 🔊 SOUND CONTROL
// ===============================
let soundEnabled = true;
let sirenInterval = null;

function toggleSound() {

  soundEnabled = !soundEnabled;

  const btn =
    document.getElementById("soundBtn");

  btn.innerText =
    soundEnabled ? "🔊 ON" : "🔇 OFF";

  // If turned OFF -> stop siren
  if (!soundEnabled) {
    stopSiren();
  }
}

// ===============================
// 🔊 PLAY ONE SIREN CYCLE
// ===============================
function playOneSiren() {

  const ctx =
    new (window.AudioContext ||
      window.webkitAudioContext)();

  const oscillator =
    ctx.createOscillator();

  const gainNode =
    ctx.createGain();

  oscillator.type = "sawtooth";

  oscillator.frequency.setValueAtTime(
    700,
    ctx.currentTime
  );

  oscillator.frequency.linearRampToValueAtTime(
    1100,
    ctx.currentTime + 0.4
  );

  oscillator.frequency.linearRampToValueAtTime(
    700,
    ctx.currentTime + 0.8
  );

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  gainNode.gain.setValueAtTime(
    0.05,
    ctx.currentTime
  );

  oscillator.start();
  oscillator.stop(
    ctx.currentTime + 1.2
  );
}

// ===============================
// 🔊 START CONTINUOUS SIREN
// ===============================
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

// ===============================
// 🔇 STOP SIREN
// ===============================
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
    document.getElementById(
      "accidentOverlay"
    );

  document.querySelector(
    ".main"
  ).style.visibility =
    "hidden";

  overlay.classList.add("show");

  setTimeout(() => {

    overlay.classList.remove("show");

    document.querySelector(
      ".main"
    ).style.visibility =
      "visible";

  }, 2000);
}

// ===============================
// 📊 UPDATE ANALYTICS
// ===============================
function updateAnalytics(impact) {

  totalAlerts++;

  if (
    impact === "HIGH IMPACT" ||
    impact === "CRITICAL IMPACT"
  ) {
    highImpactCases++;
  }

  document.getElementById(
    "aTotal"
  ).innerText = totalAlerts;

  document.getElementById(
    "aHigh"
  ).innerText = highImpactCases;

  const avgTimes = [
    "4 min",
    "5 min",
    "3 min"
  ];

  const randomAvg =
    avgTimes[
      Math.floor(
        Math.random() *
        avgTimes.length
      )
    ];

  document.getElementById(
    "aAvg"
  ).innerText = randomAvg;
}

// ===============================
// 🔥 FIREBASE LISTENER
// ===============================
firebase.database()
.ref("accidents")
.on("value", (snapshot) => {

  const dataObj =
    snapshot.val();

  if (!dataObj) return;

  const keys =
    Object.keys(dataObj);

  const data =
    dataObj[
      keys[keys.length - 1]
    ];

  // ALERTS
  showOverlay();
  startSiren();

  const lat =
    Number(data.lat);

  const lng =
    Number(data.lng);

  // Remove old marker
  if (marker)
    map.removeLayer(marker);

  // Add marker
  marker =
    L.marker([lat, lng])
    .addTo(map);

  map.setView(
    [lat, lng],
    15
  );

  // ===============================
  // CARD DATA
  // ===============================
  document.getElementById(
    "dName"
  ).innerText =
    data.name || "-";

  document.getElementById(
    "dLat"
  ).innerText =
    lat.toFixed(5);

  document.getElementById(
    "dLng"
  ).innerText =
    lng.toFixed(5);

  document.getElementById(
    "dSpeed"
  ).innerText =
    (data.speed || 0) +
    " km/h";

  document.getElementById(
    "dPhone"
  ).innerText =
    data.phone || "-";

  document.getElementById(
    "dEmergency"
  ).innerText =
    data.emergency || "-";

  document.getElementById(
    "dVehicleNo"
  ).innerText =
    data.vehicleNo || "-";

  document.getElementById(
    "dVehicleType"
  ).innerText =
    data.vehicleType || "-";

  document.getElementById(
    "dVehicleModel"
  ).innerText =
    data.vehicleModel || "-";

  document.getElementById(
    "dImpact"
  ).innerText =
    data.impact || "-";

  document.getElementById(
    "dEquipment"
  ).innerText =
    data.equipment || "-";

  // ANALYTICS
  updateAnalytics(
    data.impact
  );

});