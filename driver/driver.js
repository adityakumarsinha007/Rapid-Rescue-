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

// ===============================
// 🚗 VEHICLE UPDATE
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
// 💬 COMIC POPUP
// ===============================
function showPopup(message = "Demo Vehicle Ready 🚀") {
  const popup = document.getElementById("comicPopup");
  popup.innerText = message;

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

// ===============================
// 🚀 START TRIP
// ===============================
function startTrip() {

  tripStarted = true;

  document.getElementById("status").innerText = "Tracking started...";
  showPopup("Demo Vehicle Ready 🚀");

  navigator.geolocation.watchPosition(
    (pos) => {
      currentLat = pos.coords.latitude;
      currentLng = pos.coords.longitude;

      document.getElementById("lat").innerText = currentLat.toFixed(6);
      document.getElementById("lng").innerText = currentLng.toFixed(6);

      // dummy speed (can upgrade later)
      speed = 20;
      document.getElementById("spd").innerText = speed + " km/h";

      document.getElementById("status").innerText = "Live Tracking Active 🚗";
    },
    (error) => {
      console.log(error);
      alert("GPS Error ❌");
    },
    { enableHighAccuracy: true }
  );
}

// ===============================
// 🔵 CONNECT VEHICLE (ESP32)
// ===============================
async function connectESP32() {

  const vehicle = document.getElementById("vehicle");

  if (!tripStarted) {
    alert("Start Trip first 🚀");
    return;
  }

  if (vehicle.style.display === "none") {
    alert("Select Vehicle first 🚗");
    return;
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ["12345678-1234-1234-1234-1234567890ab"]
    });

    const server = await device.gatt.connect();

    const service = await server.getPrimaryService(
      "12345678-1234-1234-1234-1234567890ab"
    );

    const characteristic = await service.getCharacteristic(
      "abcd1234-5678-1234-5678-abcdef123456"
    );

    await characteristic.startNotifications();

    showPopup("Vehicle Connected 🔗");
    document.getElementById("status").innerText = "Vehicle Connected 🚗";

    // 🚗 START MOVEMENT
    vehicle.classList.add("move");

    // 🔥 LISTEN TO ESP32
    characteristic.addEventListener("characteristicvaluechanged", (event) => {

      const value = new TextDecoder().decode(event.target.value);

      console.log("ESP32:", value);

      if (value === "ACCIDENT") {
        handleAccident();
      }

    });

  } catch (error) {
    console.log(error);

    // fallback demo mode
    showPopup("Demo Mode Active ⚡");
    vehicle.classList.add("move");

    setTimeout(() => {
      handleAccident();
    }, 8000);
  }
}

// ===============================
// 💥 HANDLE ACCIDENT
// ===============================
function handleAccident() {

  const vehicle = document.getElementById("vehicle");

  vehicle.classList.remove("move");
  vehicle.classList.add("crash");

  document.getElementById("status").innerText = "Accident Detected 💥";

  showPopup("Accident Detected 💥");

  sendAccident();
}

// ===============================
// 🚨 SEND ACCIDENT TO FIREBASE
// ===============================
function sendAccident() {

  if (currentLat === 0 || currentLng === 0) {
    alert("Start Trip first ❌");
    return;
  }

  const name = document.getElementById("name").value;

  const emergency =
    document.getElementById("emCode").value +
    document.getElementById("emergency").value;

  const vehicleNo = document.getElementById("vehicleNo").value;
  const vehicleType = document.getElementById("vehicleType").value;
  const vehicleModel = document.getElementById("vehicleModel").value;

  const ref = firebase.database().ref("accidents");

  ref.remove().then(() => {
    ref.push({
      name,
      emergency,
      vehicleNo,
      vehicleType,
      vehicleModel,
      lat: currentLat,
      lng: currentLng,
      speed,
      time: Date.now()
    });

    alert("🚨 Accident Sent Successfully!");
  });
}

// ===============================
// 💾 SAVE DATA
// ===============================
function saveDetails() {

  const data = {
    name: document.getElementById("name").value,
    vehicleModel: document.getElementById("vehicleModel").value,
    vehicleNo: document.getElementById("vehicleNo").value,
    vehicleType: document.getElementById("vehicleType").value,
    emergency:
      document.getElementById("emCode").value +
      document.getElementById("emergency").value
  };

  localStorage.setItem("driverData", JSON.stringify(data));

  alert("✅ Details Saved!");
}

// ===============================
// 🗑 CLEAR DATA
// ===============================
function clearDetails() {

  localStorage.removeItem("driverData");

  document.getElementById("name").value = "";
  document.getElementById("vehicleModel").value = "";
  document.getElementById("vehicleNo").value = "";
  document.getElementById("vehicleType").value = "";
  document.getElementById("emergency").value = "";

  document.getElementById("vehicle").style.display = "none";

  alert("🗑 Data Cleared!");
}