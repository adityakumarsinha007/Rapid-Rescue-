// ===============================
// 🚗 VEHICLE MAP
// ===============================
const vehicleMap = {
  car: "🚗",
  bike: "🏍️",
  scooter: "🛵",
  truck: "🚚",
  bus: "🚌",
  taxi: "🚖",
  auto: "🛺",
  sports: "🏎️",
  ambulance: "🚑",
  van: "🚐",
  pickup: "🛻"
};

// ===============================
// 📍 GLOBAL VARIABLES
// ===============================
let currentLat = 0;
let currentLng = 0;
let speed = 0;
let tripStarted = false;
let vehicleImageData = "";

// ===============================
// 🚗 UPDATE VEHICLE
// ===============================
function updateVehicle() {

  const type = document.getElementById("vehicleType").value;
  const vehicle = document.getElementById("vehicle");

  if (!type) {
    vehicle.style.display = "none";
    return;
  }

  vehicle.style.display = "block";
  vehicle.innerText = vehicleMap[type];
}

// ===============================
// 🖼 IMAGE PREVIEW
// ===============================
function previewVehicleImage(event) {

  const file = event.target.files[0];

  if (!file) return;

  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png"
  ];

  if (!validTypes.includes(file.type)) {
    alert("Only JPG, JPEG, PNG allowed.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image must be less than 5MB.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    vehicleImageData = e.target.result;

    const preview =
      document.getElementById("vehiclePreview");

    preview.src = vehicleImageData;
    preview.style.display = "block";
  };

  reader.readAsDataURL(file);
}

// ===============================
// 💬 POPUP
// ===============================
function showPopup(message = "Demo Vehicle Ready 🚀") {

  const popup =
    document.getElementById("comicPopup");

  popup.innerText = message;

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2200);
}

// ===============================
// 🚀 START TRIP
// ===============================
function startTrip() {

  tripStarted = true;

  document.getElementById("status").innerText =
    "Tracking started...";

  document.getElementById("spd").innerText = "-";

  showPopup("Demo Vehicle Ready 🚀");

  navigator.geolocation.watchPosition(
    (pos) => {

      currentLat = pos.coords.latitude;
      currentLng = pos.coords.longitude;

      document.getElementById("lat").innerText =
        currentLat.toFixed(6);

      document.getElementById("lng").innerText =
        currentLng.toFixed(6);

      document.getElementById("status").innerText =
        "Live Tracking Active 🚗";

    },
    (error) => {
      console.log(error);
    },
    { enableHighAccuracy: true }
  );
}

// ===============================
// 🔵 CONNECT VEHICLE
// ===============================
async function connectESP32() {

  const vehicle =
    document.getElementById("vehicle");

  if (!tripStarted) {
    alert("Start Trip first 🚀");
    return;
  }

  if (vehicle.style.display === "none") {
    alert("Select Vehicle first 🚗");
    return;
  }

  try {

    const device =
      await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "12345678-1234-1234-1234-1234567890ab"
        ]
      });

    const server =
      await device.gatt.connect();

    const service =
      await server.getPrimaryService(
        "12345678-1234-1234-1234-1234567890ab"
      );

    const characteristic =
      await service.getCharacteristic(
        "abcd1234-5678-1234-5678-abcdef123456"
      );

    await characteristic.startNotifications();

    showPopup("Vehicle Connected 🔗");

    document.getElementById("status").innerText =
      "Vehicle Connected 🚗";

    vehicle.classList.add("move");

    characteristic.addEventListener(
      "characteristicvaluechanged",
      (event) => {

        const value =
          new TextDecoder().decode(
            event.target.value
          );

        if (value === "ACCIDENT") {
          handleAccident();
        }

      }
    );

  } catch (error) {

    console.log(error);

    showPopup("Demo Mode Active ⚡");

    vehicle.classList.add("move");

    setTimeout(() => {
      handleAccident();
    }, 10000);
  }
}

// ===============================
// 💥 SPEED
// ===============================
function generateCrashSpeed() {

  const speeds = [
    18, 24, 37, 42,
    58, 67, 73, 84
  ];

  return speeds[
    Math.floor(Math.random() * speeds.length)
  ];
}

// ===============================
// 💥 IMPACT
// ===============================
function getImpactBySpeed() {

  if (speed <= 20) {
    return {
      level: "LOW IMPACT",
      equipment: "First Aid Kit"
    };
  }

  if (speed <= 45) {
    return {
      level: "MEDIUM IMPACT",
      equipment: "Stretcher + Medical Kit"
    };
  }

  if (speed <= 75) {
    return {
      level: "HIGH IMPACT",
      equipment: "Ambulance + Trauma Support"
    };
  }

  return {
    level: "CRITICAL IMPACT",
    equipment:
      "ICU Ambulance + Fire Rescue Tools"
  };
}

// ===============================
// 💥 HANDLE ACCIDENT
// ===============================
function handleAccident() {

  const vehicle =
    document.getElementById("vehicle");

  vehicle.classList.remove("move");
  vehicle.classList.add("crash");

  speed = generateCrashSpeed();

  document.getElementById("spd").innerText =
    speed + " km/h";

  document.getElementById("status").innerText =
    "Accident Detected 💥";

  const impactData =
    getImpactBySpeed();

  document.getElementById("impactLevel").innerText =
    impactData.level;

  showPopup(
    impactData.level + " | " + speed + " km/h"
  );

  sendAccident(impactData);
}

// ===============================
// 🚨 SEND FIREBASE
// ===============================
function sendAccident(impactData) {

  if (currentLat === 0 || currentLng === 0) {
    alert("Start Trip first ❌");
    return;
  }

  const name =
    document.getElementById("name").value;

  const emergency =
    document.getElementById("emCode").value +
    document.getElementById("emergency").value;

  const vehicleNo =
    document.getElementById("vehicleNo").value;

  const vehicleType =
    document.getElementById("vehicleType").value;

  const vehicleModel =
    document.getElementById("vehicleModel").value;

  const ref =
    firebase.database().ref("accidents");

  ref.remove().then(() => {

    ref.push({
      name,
      emergency,
      vehicleNo,
      vehicleType,
      vehicleModel,
      vehicleImage: vehicleImageData,
      lat: currentLat,
      lng: currentLng,
      speed,
      impact: impactData.level,
      equipment: impactData.equipment,
      time: Date.now()
    });

    alert("🚨 Accident Sent Successfully!");
  });
}

// ===============================
// 💾 SAVE
// ===============================
function saveDetails() {

  const data = {
    name:
      document.getElementById("name").value,

    vehicleModel:
      document.getElementById("vehicleModel").value,

    vehicleNo:
      document.getElementById("vehicleNo").value,

    vehicleType:
      document.getElementById("vehicleType").value,

    emergency:
      document.getElementById("emCode").value +
      document.getElementById("emergency").value,

    vehicleImage: vehicleImageData
  };

  localStorage.setItem(
    "driverData",
    JSON.stringify(data)
  );

  alert("✅ Details Saved!");
}

// ===============================
// 🗑 CLEAR
// ===============================
function clearDetails() {

  localStorage.removeItem("driverData");

  document.getElementById("name").value = "";
  document.getElementById("vehicleModel").value = "";
  document.getElementById("vehicleNo").value = "";
  document.getElementById("vehicleType").value = "";
  document.getElementById("emergency").value = "";
  document.getElementById("vehicleImage").value = "";

  vehicleImageData = "";

  document.getElementById("vehiclePreview").style.display =
    "none";

  document.getElementById("vehicle").style.display =
    "none";

  document.getElementById("impactLevel").innerText =
    "-";

  document.getElementById("spd").innerText =
    "-";

  alert("🗑 Data Cleared!");
}