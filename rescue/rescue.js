// COMPLETE REPLACE rescue.js

// ===============================
// RESET LIVE DATA
// ===============================
firebase.database().ref("accidents").remove();

// ===============================
// MAP INIT
// ===============================
const map = L.map("map").setView([20, 77], 5);

const mapLayers = {
  street: L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  ),

  satellite: L.tileLayer(
    "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    { subdomains: ["mt0","mt1","mt2","mt3"] }
  ),

  terrain: L.tileLayer(
    "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    { subdomains: ["mt0","mt1","mt2","mt3"] }
  ),

  dark: L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  )
};

let currentLayer = mapLayers.street;
currentLayer.addTo(map);

let marker = null;

// ===============================
// ANALYTICS
// ===============================
let totalAlerts = 0;
let highImpactCases = 0;
let solvedCases = 0;
let currentCaseData = null;

// ===============================
// MAP TYPE
// ===============================
function changeMapType(){

  const type =
    document.getElementById("mapType").value;

  map.removeLayer(currentLayer);
  currentLayer = mapLayers[type];
  currentLayer.addTo(map);
}

// ===============================
// SOUND
// ===============================
let soundEnabled = true;
let sirenInterval = null;

function toggleSound(){

  soundEnabled = !soundEnabled;

  document.getElementById("soundBtn").innerText =
    soundEnabled ? "🔊 ON" : "🔇 OFF";

  if(!soundEnabled) stopSiren();
}

function playOneSiren(){

  const ctx =
    new(window.AudioContext ||
      window.webkitAudioContext)();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";

  osc.frequency.setValueAtTime(
    700, ctx.currentTime
  );

  osc.frequency.linearRampToValueAtTime(
    1100, ctx.currentTime + 0.4
  );

  osc.frequency.linearRampToValueAtTime(
    700, ctx.currentTime + 0.8
  );

  osc.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(
    0.05, ctx.currentTime
  );

  osc.start();
  osc.stop(ctx.currentTime + 1.2);
}

function startSiren(){

  if(!soundEnabled) return;

  stopSiren();
  playOneSiren();

  sirenInterval = setInterval(() => {
    if(soundEnabled) playOneSiren();
  },1300);
}

function stopSiren(){

  if(sirenInterval){
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
}

// ===============================
// OVERLAY
// ===============================
function showOverlay(){

  const overlay =
    document.getElementById("accidentOverlay");

  document.querySelector(".main").style.visibility =
    "hidden";

  overlay.classList.add("show");

  setTimeout(() => {

    overlay.classList.remove("show");

    document.querySelector(".main").style.visibility =
      "visible";

  },2000);
}

// ===============================
// ANALYTICS REFRESH
// ===============================
function refreshAnalytics(){

  document.getElementById("aTotal").innerText =
    totalAlerts;

  document.getElementById("aHigh").innerText =
    highImpactCases;

  document.getElementById("aSolved").innerText =
    solvedCases;
}

// ===============================
// SAFE / ALERT MODE
// ===============================
function showSafeMode(){

  document.getElementById("noAccidentBox").style.display =
    "block";

  document.getElementById("accidentCard").style.display =
    "none";
}

function showAccidentCard(){

  document.getElementById("noAccidentBox").style.display =
    "none";

  document.getElementById("accidentCard").style.display =
    "block";
}

// ===============================
// HISTORY
// ===============================
function openHistory(){

  document.getElementById("historyModal").style.display =
    "flex";

  loadHistory();
}

function closeHistory(){

  document.getElementById("historyModal").style.display =
    "none";
}

function loadHistory(){

  const list =
    document.getElementById("historyList");

  firebase.database()
    .ref("solvedCases")
    .once("value", snapshot => {

      const data = snapshot.val();

      if(!data){
        list.innerHTML =
          "<p style='color:#aaa;'>No solved records yet.</p>";
        return;
      }

      let html = "";

      const keys =
        Object.keys(data).reverse();

      keys.forEach(key => {

        const item = data[key];

        html += `
          <div class="history-item">
            <p><b>Driver:</b> ${item.name || "-"}</p>
            <p><b>Vehicle:</b> ${item.vehicleNo || "-"}</p>
            <p><b>Impact:</b> ${item.impact || "-"}</p>
            <p><b>Location:</b> ${item.lat || "-"}, ${item.lng || "-"}</p>
            <p><b>Solved:</b> ${item.solvedAt || "-"}</p>
          </div>
        `;
      });

      list.innerHTML = html;

    });
}

// ===============================
// SOLVE ISSUE
// ===============================
function solveIssue(){

  if(currentCaseData){

    firebase.database()
      .ref("solvedCases")
      .push({
        ...currentCaseData,
        solvedAt:
          new Date().toLocaleString()
      });
  }

  firebase.database()
    .ref("accidents")
    .remove();

  if(marker){
    map.removeLayer(marker);
    marker = null;
  }

  stopSiren();

  solvedCases++;

  refreshAnalytics();

  showSafeMode();

  map.setView([20,77],5);
}

// ===============================
// INITIAL
// ===============================
showSafeMode();
refreshAnalytics();

// ===============================
// FIREBASE LISTENER
// ===============================
firebase.database()
.ref("accidents")
.on("value", snapshot => {

  const dataObj = snapshot.val();

  if(!dataObj) return;

  const keys =
    Object.keys(dataObj);

  const data =
    dataObj[keys[keys.length - 1]];

  currentCaseData = data;

  showAccidentCard();
  showOverlay();
  startSiren();

  const lat = Number(data.lat);
  const lng = Number(data.lng);

  if(marker){
    map.removeLayer(marker);
  }

  marker =
    L.marker([lat,lng]).addTo(map);

  marker.bindPopup(`
    <b>🚨 Accident Alert</b><br><br>
    <b>Driver:</b> ${data.name || "-"}<br>
    <b>Vehicle:</b> ${data.vehicleNo || "-"}<br>
    <b>Impact:</b> ${data.impact || "-"}
  `);

  marker.openPopup();

  map.setView([lat,lng],15);

  // IMAGE
  const img =
    document.getElementById("dVehicleImage");

  if(data.vehicleImage){
    img.src = data.vehicleImage;
    img.style.display = "block";
  }else{
    img.style.display = "none";
  }

  // DETAILS
  document.getElementById("dName").innerText =
    data.name || "-";

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

  document.getElementById("dLat").innerText =
    lat.toFixed(5);

  document.getElementById("dLng").innerText =
    lng.toFixed(5);

  document.getElementById("dSpeed").innerText =
    (data.speed || 0) + " km/h";

  document.getElementById("dImpact").innerText =
    data.impact || "-";

  document.getElementById("dEquipment").innerText =
    data.equipment || "-";

  // COUNTERS
  totalAlerts++;

  if(
    data.impact === "HIGH IMPACT" ||
    data.impact === "CRITICAL IMPACT"
  ){
    highImpactCases++;
  }

  refreshAnalytics();

});