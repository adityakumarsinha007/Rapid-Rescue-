let currentLat = 0;
let currentLng = 0;

let prevLat = 0;
let prevLng = 0;
let prevTime = 0;

let speed = 0;

// 🔥 Distance calculation
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (val) => (val * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// 🔥 Start Tracking
function startTrip() {
  document.getElementById("status").innerText = "Tracking started...";

  navigator.geolocation.watchPosition(
    (pos) => {
      currentLat = pos.coords.latitude;
      currentLng = pos.coords.longitude;

      const currentTime = Date.now();

      if (prevLat && prevLng && prevTime) {
        const distance = getDistance(prevLat, prevLng, currentLat, currentLng);
        const timeDiff = (currentTime - prevTime) / 1000;

        speed = (distance / timeDiff) * 3.6;
      }

      prevLat = currentLat;
      prevLng = currentLng;
      prevTime = currentTime;

      // UI update
      document.getElementById("lat").innerText = currentLat.toFixed(6);
      document.getElementById("lng").innerText = currentLng.toFixed(6);
      document.getElementById("spd").innerText = speed.toFixed(2) + " km/h";

      document.getElementById("status").innerText = "Live Tracking Active 🚗";
    },
    (error) => {
      console.log(error);
      alert("GPS Error ❌");
    },
    { enableHighAccuracy: true }
  );
}

// 🔥 Send Accident
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

// 🔵 ESP32 CONNECT (NEW)
async function connectESP32() {

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

    alert("✅ Vehicle Connected");

    // 🔥 Listen to ESP32
    characteristic.addEventListener("characteristicvaluechanged", (event) => {

      const value = new TextDecoder().decode(event.target.value);

      console.log("ESP32:", value);

      if (value === "ACCIDENT") {
        alert("🚨 Accident Auto Detected!");
        sendAccident();   // 🔥 AUTO SEND
      }

    });

  } catch (error) {
    console.log(error);
    alert("❌ Connection Failed");
  }

}
// 🔥 SAVE DATA
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

// 🔥 CLEAR DATA
function clearDetails() {

  localStorage.removeItem("driverData");

  document.getElementById("name").value = "";
  document.getElementById("vehicleModel").value = "";
  document.getElementById("vehicleNo").value = "";
  document.getElementById("vehicleType").value = "";
  document.getElementById("emergency").value = "";

  alert("🗑 Data Cleared!");
}