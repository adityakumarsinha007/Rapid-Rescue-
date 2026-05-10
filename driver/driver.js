// ===============================
// 🚗 VEHICLE EMOJI MAP
// ===============================
const vehicleMap = {
  car:"🚗",
  bike:"🏍️",
  scooter:"🛵",
  truck:"🚚",
  bus:"🚌",
  taxi:"🚖",
  auto:"🛺",
  sports:"🏎️",
  ambulance:"🚑",
  van:"🚐",
  pickup:"🛻"
};

// ===============================
// 🚘 VEHICLE MODELS
// ===============================
const vehicleModels = {

car:[
"Toyota Camry","Honda City","Hyundai Verna","Maruti Swift","Kia Seltos",
"Skoda Slavia","Volkswagen Virtus","Tata Nexon","Mahindra XUV300","Toyota Innova",
"Hyundai i20","Honda Amaze","Renault Kiger","MG Hector","Nissan Magnite",
"Maruti Baleno","Honda Civic","Toyota Fortuner","Mahindra Scorpio","Tata Harrier",
"Hyundai Creta","Kia Sonet","Jeep Compass","BMW 3 Series","Audi A4",
"Mercedes C-Class","Maruti Alto","Tata Punch","Mahindra XUV700","Hyundai Venue"
],

bike:[
"Royal Enfield Classic 350","Yamaha R15","KTM Duke 200","Bajaj Pulsar 220","TVS Apache RTR",
"Hero Splendor","Honda Shine","Suzuki Gixxer","Yamaha MT15","Bajaj Dominar",
"Hero Xtreme","TVS Raider","Honda Unicorn","KTM RC 390","Royal Enfield Hunter",
"Jawa 42","Benelli TNT","Honda Hornet","Bajaj Avenger","Hero Glamour",
"TVS Ronin","Suzuki Hayabusa","BMW G310R","Kawasaki Ninja",
"Royal Enfield Meteor","Hero Passion","Bajaj Platina","Honda SP125","TVS Star City"
],

scooter:[
"Honda Activa","TVS Jupiter","Suzuki Access","Yamaha Fascino","Hero Pleasure",
"Ola S1","Ather 450X","TVS Ntorq","Honda Dio","Hero Destini",
"Aprilia SR125","Vespa VXL","Suzuki Burgman","Bounce Infinity","Vida V1",
"TVS iQube","Bajaj Chetak","Hero Maestro","Yamaha RayZR","Honda Aviator",
"Aprilia SXR160","Hero Zoom","TVS Scooty Pep","Honda Grazia","Ampere Magnus",
"Okinawa Praise","Simple One","Ather Rizta","Ola S1 Pro","Hero Electric Optima"
],

truck:[
"Tata Ace","Ashok Leyland Dost","Eicher Pro","BharatBenz","Tata Signa",
"Mahindra Blazo","Ashok Leyland Boss","Eicher Pro 3015","Tata Prima","BharatBenz 2823",
"Mahindra Furio","Ashok U Truck","Eicher 2110","Tata LPT","Loadking",
"Ashok Captain","Eicher Pro 6040","Tata Ultra","Mahindra Cruzio Cargo","Tata 407",
"Ashok Partner","BharatBenz 1217","Eicher Pro 2055","Tata 1613","Mahindra Jayo"
],

bus:[
"Volvo B9R","Ashok Leyland Viking","Tata Starbus","Eicher Skyline","BharatBenz Staff Bus",
"Volvo 9400","Mercedes Intercity","Ashok Janbus","Tata Magna","Traveller Bus",
"Mini School Bus","Sleeper Bus","City AC Bus","Electric Bus","Tourist Coach",
"Tata LP Bus","Ashok Cheetah","Force Urbania Bus","School Deluxe Bus","Volvo 9600",
"Mercedes Tourismo","Airport Shuttle","City Mini Bus","Rural Passenger Bus","Luxury Coach"
],

taxi:[
"Toyota Etios","Maruti Dzire","Hyundai Xcent","Honda Amaze","Tata Tigor",
"Mahindra Logan","Toyota Innova Taxi","WagonR Cab","Swift Tour","Hyundai Aura",
"Kia Carens Taxi","Ciaz Cab","Honda Mobilio Taxi","Rumion Taxi","Urban Taxi",
"Toyota Rumion","Maruti Ertiga Cab","Hyundai Exter Cab","Tata Zest Taxi","Nissan Sunny Cab"
],

auto:[
"Bajaj RE","Piaggio Ape","Mahindra Alfa","Atul Gem","TVS King",
"Bajaj Maxima","Electric Auto","City Auto","Cargo Auto","Passenger Auto",
"Metro Auto","Mini Auto","Smart Auto","Urban Auto","Deluxe Auto",
"Piaggio Ape Xtra","Mahindra Treo","Atul Shakti","TVS EV Auto","Battery Auto"
],

sports:[
"Ferrari 488","Lamborghini Huracan","Porsche 911","Audi R8","BMW M4",
"Nissan GT-R","Ford Mustang","Chevrolet Camaro","McLaren 720S","Jaguar F-Type",
"AMG GT","Supra GR","Lotus Emira","Aston Martin","Lexus LC500"
],

ambulance:[
"Force Traveller","Tata Winger","Mahindra Supro","Maruti Eeco Ambulance","Tempo Traveller ICU",
"Basic Life Support Van","Advanced Life Support Van","ICU Ambulance","Emergency Response Van","Mobile Clinic Van",
"Neonatal Ambulance","Cardiac Ambulance","Trauma Ambulance","Rescue Ambulance","Patient Van"
],

van:[
"Maruti Eeco","Toyota Hiace","Force Traveller","Tata Winger","Mahindra Supro Van",
"Kia Carnival","Mercedes V-Class","Passenger Van","Cargo Van","Mini Van",
"Luxury Van","Family Van","Delivery Van","School Van","Urbania"
],

pickup:[
"Toyota Hilux","Mahindra Bolero Pickup","Isuzu D-Max","Tata Yodha","Ashok Dost Pickup",
"Mahindra Jeeto","Force Pickup","Bolero Camper","Single Cabin Pickup","Double Cabin Pickup",
"Cargo Pickup","Mini Pickup","Heavy Pickup","Rural Pickup","Utility Pickup"
]

};

// ===============================
// GLOBAL VARIABLES
// ===============================
let currentLat = 0;
let currentLng = 0;
let speed = 0;
let tripStarted = false;
let bluetoothConnected = false;
let vehicleImageData = "";
let treeLoopStarted = false;
let birdLoopStarted = false;
let accidentSent = false;

// ===============================
// UPDATE VEHICLE
// ===============================
function updateVehicle(){

  const type = document.getElementById("vehicleType").value;
  const vehicle = document.getElementById("vehicle");

  if(!type){
    vehicle.style.display = "none";
    return;
  }

  vehicle.style.display = "block";
  vehicle.innerText = vehicleMap[type];
}

// ===============================
// LOAD MODELS
// ===============================
function loadVehicleModels(){

  const type = document.getElementById("vehicleType").value;
  const model = document.getElementById("vehicleModel");

  model.innerHTML =
  `<option value="">Select Vehicle Model</option>`;

  if(!vehicleModels[type]) return;

  vehicleModels[type].forEach(item=>{

    const option =
    document.createElement("option");

    option.value = item;
    option.textContent = item;

    model.appendChild(option);
  });
}

// ===============================
// IMAGE PREVIEW
// ===============================
function previewVehicleImage(event){

  const file = event.target.files[0];

  if(!file) return;

  const reader = new FileReader();

  reader.onload = function(e){

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
function showPopup(message){

  const popup =
  document.getElementById("comicPopup");

  popup.innerText = message;

  popup.classList.add("show");

  setTimeout(()=>{
    popup.classList.remove("show");
  },2200);
}
// ===============================
// CONNECT ESP32
// ===============================
async function connectESP32(){

  const vehicle =
  document.getElementById("vehicle");

  if(vehicle.style.display === "none"){

    alert("Select Vehicle first 🚗");
    return;
  }

  try{

    // RESET FLAGS
    accidentSent = false;

    // REQUEST DEVICE
    const device =
    await navigator.bluetooth.requestDevice({

      filters:[
        { name:"RapidRescue" }
      ],

      optionalServices:[
        "12345678-1234-1234-1234-1234567890ab"
      ]
    });

    document.getElementById("status").innerText =
    "Connecting To ESP32...";

    // CONNECT GATT
    const server =
    await device.gatt.connect();

    // GET SERVICE
    const service =
    await server.getPrimaryService(
      "12345678-1234-1234-1234-1234567890ab"
    );

    // GET CHARACTERISTIC
    const characteristic =
    await service.getCharacteristic(
      "abcd1234-5678-1234-5678-abcdef123456"
    );

    // START NOTIFICATION
    await characteristic.startNotifications();

    bluetoothConnected = true;

    document.getElementById("status").innerText =
    "Vehicle Connected ✅";

    showPopup("Vehicle Connected 🔵");

    // AUTO GPS START
    startTrip();

    console.log("BLE Notifications Started");

    // ===============================
    // MPU6050 LIVE LISTENER
    // ===============================
    characteristic.addEventListener(
      "characteristicvaluechanged",

      function(event){

        const value =
        new TextDecoder()
        .decode(event.target.value)
        .trim();

        console.log("BLE RECEIVED:", value);

        // ===============================
        // AUTOMATIC ACCIDENT ALERT
        // ===============================
        if(
          value.includes("ACCIDENT") &&
          !accidentSent
        ){

          accidentSent = true;

          console.log("🚨 ACCIDENT RECEIVED");

          document.getElementById("status").innerText =
          "🚨 Accident Detected Automatically";

          showPopup("🚨 Accident Detected");

          // SEND TO FIREBASE
          triggerAccident();
        }
      }
    );

    // RECONNECT HANDLER
    device.addEventListener(
      "gattserverdisconnected",

      ()=>{

        bluetoothConnected = false;

        document.getElementById("status").innerText =
        "Vehicle Disconnected ❌";

        showPopup("ESP32 Disconnected");
      }
    );

  }catch(error){

    console.log(error);

    bluetoothConnected = false;

    document.getElementById("status").innerText =
    "Connection Failed ❌";

    showPopup("Connection Failed ❌");
  }
}

// ===============================
// START TRIP
// ===============================
function startTrip(){

  if(!bluetoothConnected){

    alert("Connect Vehicle first 🔵");
    return;
  }

  document.getElementById("status").innerText =
  "Requesting GPS Access 📍";

  navigator.geolocation.watchPosition(

    (pos)=>{

      currentLat = pos.coords.latitude;
      currentLng = pos.coords.longitude;

      document.getElementById("lat").innerText =
      currentLat.toFixed(6);

      document.getElementById("lng").innerText =
      currentLng.toFixed(6);

      if(!tripStarted){

        tripStarted = true;

        const vehicle =
        document.getElementById("vehicle");

        vehicle.classList.remove("crash");
        vehicle.classList.add("move");

        startTreeLoop();
        startBirdLoop();

        showPopup("Trip Started 🚀");
      }

      document.getElementById("status").innerText =
      "Live Tracking Active 🚗";
    },

    (error)=>{

      console.log(error);

      alert("GPS Access Denied ❌");

      document.getElementById("status").innerText =
      "GPS Permission Required 📍";
    },

    { enableHighAccuracy:true }
  );
}

// ===============================
// SEND ACCIDENT TO FIREBASE
// ===============================
function triggerAccident(){

  if(currentLat === 0 || currentLng === 0){

    alert("Waiting For GPS Location 📍");
    return;
  }

  const vehicle =
  document.getElementById("vehicle");

  // STOP VEHICLE MOVEMENT
  vehicle.classList.remove("move");

  // START CRASH EFFECT
  vehicle.classList.add("crash");

  // STOP CONNECTION
  bluetoothConnected = false;

  firebase.database()
  .ref("accidents")
  .push({

    name:
    document.getElementById("name").value,

    vehicleType:
    document.getElementById("vehicleType").value,

    vehicleModel:
    document.getElementById("vehicleModel").value,

    vehicleNo:
    document.getElementById("vehicleNo").value,

    emergency:
    document.getElementById("emergency").value,

    phone:
    "Driver Connected",

    lat: parseFloat(currentLat),

    lng: parseFloat(currentLng),

    speed: 72,

    impact: "HIGH IMPACT",

    equipment:
    "Ambulance, Medical Team, Hydraulic Cutter",

    vehicleImage:
    vehicleImageData,

    timestamp: Date.now()
  });

  document.getElementById("status").innerText =
  "🚨 ACCIDENT DETECTED";

  showPopup("🚨 Accident Alert Sent");

}

// ===============================
// SAVE
// ===============================
function saveDetails(){

  localStorage.setItem("driverData","saved");

  alert("✅ Details Saved!");
}

// ===============================
// CLEAR
// ===============================
function clearDetails(){

  localStorage.removeItem("driverData");

  document.getElementById("name").value = "";
  document.getElementById("vehicleType").value = "";
  document.getElementById("vehicleNo").value = "";
  document.getElementById("emergency").value = "";

  document.getElementById("vehicleModel").innerHTML =
  `<option value="">Select Vehicle Model</option>`;

  document.getElementById("vehicle").style.display =
  "none";

  bluetoothConnected = false;
  tripStarted = false;
  accidentSent = false;

  document.getElementById("status").innerText =
  "Status: Waiting...";

  alert("🗑 Data Cleared!");
}

// ===============================
// TREE LOOP
// ===============================
function startTreeLoop(){

  if(treeLoopStarted) return;

  treeLoopStarted = true;

  const trees = ["🌳","🌴","🌳"];

  setInterval(()=>{

    if(!bluetoothConnected) return;

    const tree =
    document.getElementById("roadTree");

    tree.innerText =
    trees[Math.floor(Math.random()*trees.length)];

    tree.classList.remove("treeMove");

    void tree.offsetWidth;

    tree.classList.add("treeMove");

  },2500);
}

// ===============================
// BIRD LOOP
// ===============================
function startBirdLoop(){

  if(birdLoopStarted) return;

  birdLoopStarted = true;

  function flyBird(){

    if(!bluetoothConnected){

      setTimeout(flyBird,2000);
      return;
    }

    const bird =
    document.getElementById("birdFlock");

    bird.classList.remove("birdFly");

    void bird.offsetWidth;

    bird.classList.add("birdFly");

    setTimeout(flyBird,6000);
  }

  flyBird();
}