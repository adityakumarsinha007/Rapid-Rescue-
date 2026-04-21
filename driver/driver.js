// COMPLETE REPLACE driver.js

// ===============================
// 🚗 VEHICLE EMOJI MAP
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
// 🚘 VEHICLE MODELS (15+ each main type)
// ===============================
const vehicleModels = {
  car: [
    "Toyota Camry","Honda City","Hyundai Verna","Maruti Swift","Kia Seltos",
    "Skoda Slavia","Volkswagen Virtus","Tata Nexon","Mahindra XUV300",
    "Toyota Innova","Hyundai i20","Honda Amaze","Renault Kiger",
    "MG Hector","Nissan Magnite"
  ],
  bike: [
    "Royal Enfield Classic 350","Yamaha R15","KTM Duke 200","Bajaj Pulsar 220",
    "TVS Apache RTR","Hero Splendor","Honda Shine","Suzuki Gixxer",
    "Yamaha MT15","Bajaj Dominar","Hero Xtreme","TVS Raider",
    "Honda Unicorn","KTM RC 390","Royal Enfield Hunter"
  ],
  scooter: [
    "Honda Activa","TVS Jupiter","Suzuki Access","Yamaha Fascino",
    "Hero Pleasure","Ola S1","Ather 450X","TVS Ntorq",
    "Honda Dio","Hero Destini","Aprilia SR125","Vespa VXL",
    "Suzuki Burgman","Bounce Infinity","Vida V1"
  ],
  truck: [
    "Tata Ace","Ashok Leyland Dost","Eicher Pro","BharatBenz",
    "Tata Signa","Mahindra Blazo","Ashok Leyland Boss","Eicher Pro 3015",
    "Tata Prima","BharatBenz 2823","Mahindra Furio","Ashok U Truck",
    "Eicher 2110","Tata LPT","Loadking"
  ],
  bus: [
    "Volvo B9R","Ashok Leyland Viking","Tata Starbus","Eicher Skyline",
    "BharatBenz Staff Bus","Volvo 9400","Mercedes Intercity",
    "Ashok Janbus","Tata Magna","Traveller Bus",
    "Mini School Bus","Sleeper Bus","City AC Bus",
    "Electric Bus","Tourist Coach"
  ]
};

// ===============================
// GLOBAL VARIABLES
// ===============================
let currentLat = 0;
let currentLng = 0;
let speed = 0;
let tripStarted = false;
let vehicleImageData = "";
let bluetoothConnected = false;

// ===============================
// UPDATE VEHICLE ICON
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
// LOAD MODELS
// ===============================
function loadVehicleModels() {

  const type = document.getElementById("vehicleType").value;
  const model = document.getElementById("vehicleModel");

  model.innerHTML =
    `<option value="">Select Vehicle Model</option>`;

  if (!vehicleModels[type]) return;

  vehicleModels[type].forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    model.appendChild(option);
  });
}

// ===============================
// IMAGE PREVIEW
// ===============================
function previewVehicleImage(event) {

  const file = event.target.files[0];
  if (!file) return;

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
// POPUP
// ===============================
function showPopup(message="Demo Vehicle Ready 🚀") {

  const popup =
    document.getElementById("comicPopup");

  popup.innerText = message;
  popup.classList.add("show");

  setTimeout(()=>{
    popup.classList.remove("show");
  },2200);
}

// ===============================
// START TRIP
// ===============================
function startTrip() {

  tripStarted = true;

  document.getElementById("status").innerText =
    "Tracking started...";

  showPopup("Trip Started 🚀");

  navigator.geolocation.watchPosition(
    (pos)=>{

      currentLat = pos.coords.latitude;
      currentLng = pos.coords.longitude;

      document.getElementById("lat").innerText =
        currentLat.toFixed(6);

      document.getElementById("lng").innerText =
        currentLng.toFixed(6);

      document.getElementById("status").innerText =
        "Live Tracking Active 🚗";
    },
    (error)=>{
      console.log(error);
    },
    { enableHighAccuracy:true }
  );
}

// ===============================
// CONNECT VEHICLE
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

    showPopup("Searching Vehicle... 🔍");

    const device =
      await navigator.bluetooth.requestDevice({
        acceptAllDevices:true,
        optionalServices:[
          "12345678-1234-1234-1234-1234567890ab"
        ]
      });

    showPopup("Connecting... 🔗");

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

    bluetoothConnected = true;

    showPopup("Vehicle Connected ✅");

    document.getElementById("status").innerText =
      "Bluetooth Connected 🚗";

    vehicle.classList.add("move");

    characteristic.addEventListener(
      "characteristicvaluechanged",
      (event)=>{

        const value =
          new TextDecoder()
          .decode(event.target.value)
          .trim();

        if (value === "ACCIDENT") {
          handleAccident();
        }
      }
    );

  } catch(error) {

    console.log(error);

    bluetoothConnected = false;

    showPopup("Bluetooth Connection Failed ❌");

    document.getElementById("status").innerText =
      "Vehicle Not Connected";
  }
}

// ===============================
// RANDOM SPEED
// ===============================
function generateCrashSpeed() {

  const speeds =
    [18,24,37,42,58,67,73,84];

  return speeds[
    Math.floor(Math.random()*speeds.length)
  ];
}

// ===============================
// IMPACT
// ===============================
function getImpactBySpeed() {

  if (speed <= 20) {
    return {
      level:"LOW IMPACT",
      equipment:"First Aid Kit"
    };
  }

  if (speed <= 45) {
    return {
      level:"MEDIUM IMPACT",
      equipment:"Stretcher + Medical Kit"
    };
  }

  if (speed <= 75) {
    return {
      level:"HIGH IMPACT",
      equipment:"Ambulance + Trauma Support"
    };
  }

  return {
    level:"CRITICAL IMPACT",
    equipment:"ICU Ambulance + Fire Rescue Tools"
  };
}

// ===============================
// HANDLE ACCIDENT
// ===============================
function handleAccident() {

  if (!bluetoothConnected) return;

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
// SEND TO FIREBASE
// ===============================
function sendAccident(impactData) {

  const ref =
    firebase.database().ref("accidents");

  ref.remove().then(()=>{

    ref.push({
      name:document.getElementById("name").value,
      emergency:
        document.getElementById("emCode").value +
        document.getElementById("emergency").value,
      vehicleNo:
        document.getElementById("vehicleNo").value,
      vehicleType:
        document.getElementById("vehicleType").value,
      vehicleModel:
        document.getElementById("vehicleModel").value,
      vehicleImage:vehicleImageData,
      lat:currentLat,
      lng:currentLng,
      speed:speed,
      impact:impactData.level,
      equipment:impactData.equipment,
      time:Date.now()
    });

    alert("🚨 Accident Sent Successfully!");
  });
}

// ===============================
// SAVE
// ===============================
function saveDetails() {

  const data = {
    name:
      document.getElementById("name").value,
    vehicleType:
      document.getElementById("vehicleType").value,
    vehicleModel:
      document.getElementById("vehicleModel").value,
    vehicleNo:
      document.getElementById("vehicleNo").value,
    emergency:
      document.getElementById("emCode").value +
      document.getElementById("emergency").value,
    vehicleImage:vehicleImageData
  };

  localStorage.setItem(
    "driverData",
    JSON.stringify(data)
  );

  alert("✅ Details Saved!");
}

// ===============================
// CLEAR
// ===============================
function clearDetails() {

  localStorage.removeItem("driverData");

  document.getElementById("name").value = "";
  document.getElementById("vehicleType").value = "";
  document.getElementById("vehicleNo").value = "";
  document.getElementById("emergency").value = "";

  document.getElementById("vehicleModel").innerHTML =
    `<option value="">Select Vehicle Model</option>`;

  document.getElementById("vehicleImage").value = "";

  document.getElementById("vehiclePreview").style.display =
    "none";

  document.getElementById("vehicle").style.display =
    "none";

  document.getElementById("impactLevel").innerText = "-";
  document.getElementById("spd").innerText = "-";

  bluetoothConnected = false;

  alert("🗑 Data Cleared!");
}