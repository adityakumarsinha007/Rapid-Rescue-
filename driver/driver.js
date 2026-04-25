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
// 🚘 VEHICLE MODELS (15+ EACH)
// ===============================
const vehicleModels = {

  car:[
    "Toyota Camry","Honda City","Hyundai Verna","Maruti Swift","Kia Seltos",
    "Skoda Slavia","Volkswagen Virtus","Tata Nexon","Mahindra XUV300",
    "Toyota Innova","Hyundai i20","Honda Amaze","Renault Kiger",
    "MG Hector","Nissan Magnite"
  ],

  bike:[
    "Royal Enfield Classic 350","Yamaha R15","KTM Duke 200","Bajaj Pulsar 220",
    "TVS Apache RTR","Hero Splendor","Honda Shine","Suzuki Gixxer",
    "Yamaha MT15","Bajaj Dominar","Hero Xtreme","TVS Raider",
    "Honda Unicorn","KTM RC 390","Royal Enfield Hunter"
  ],

  scooter:[
    "Honda Activa","TVS Jupiter","Suzuki Access","Yamaha Fascino",
    "Hero Pleasure","Ola S1","Ather 450X","TVS Ntorq",
    "Honda Dio","Hero Destini","Aprilia SR125","Vespa VXL",
    "Suzuki Burgman","Bounce Infinity","Vida V1"
  ],

  truck:[
    "Tata Ace","Ashok Leyland Dost","Eicher Pro","BharatBenz",
    "Tata Signa","Mahindra Blazo","Ashok Leyland Boss","Eicher Pro 3015",
    "Tata Prima","BharatBenz 2823","Mahindra Furio","Ashok U Truck",
    "Eicher 2110","Tata LPT","Loadking"
  ],

  bus:[
    "Volvo B9R","Ashok Leyland Viking","Tata Starbus","Eicher Skyline",
    "BharatBenz Staff Bus","Volvo 9400","Mercedes Intercity",
    "Ashok Janbus","Tata Magna","Traveller Bus",
    "Mini School Bus","Sleeper Bus","City AC Bus",
    "Electric Bus","Tourist Coach"
  ],

  taxi:[
    "Toyota Etios","Maruti Dzire","Hyundai Xcent","Honda Amaze",
    "Tata Tigor","Mahindra Logan","Toyota Innova Taxi",
    "WagonR Cab","Swift Tour","Hyundai Aura","Kia Carens Taxi",
    "Ciaz Cab","Honda Mobilio Taxi","Rumion Taxi","Urban Taxi"
  ],

  auto:[
    "Bajaj RE","Piaggio Ape","Mahindra Alfa","Atul Gem",
    "TVS King","Bajaj Maxima","Electric Auto","City Auto",
    "Cargo Auto","Passenger Auto","Metro Auto","Mini Auto",
    "Smart Auto","Urban Auto","Deluxe Auto"
  ],

  sports:[
    "Ferrari 488","Lamborghini Huracan","Porsche 911","Audi R8",
    "BMW M4","Nissan GT-R","Ford Mustang","Chevrolet Camaro",
    "McLaren 720S","Jaguar F-Type","AMG GT","Supra GR",
    "Lotus Emira","Aston Martin","Lexus LC500"
  ],

  ambulance:[
    "Force Traveller","Tata Winger","Mahindra Supro",
    "Maruti Eeco Ambulance","Tempo Traveller ICU",
    "Basic Life Support Van","Advanced Life Support Van",
    "ICU Ambulance","Emergency Response Van","Mobile Clinic Van",
    "Neonatal Ambulance","Cardiac Ambulance","Trauma Ambulance",
    "Rescue Ambulance","Patient Van"
  ],

  van:[
    "Maruti Eeco","Toyota Hiace","Force Traveller",
    "Tata Winger","Mahindra Supro Van","Kia Carnival",
    "Mercedes V-Class","Passenger Van","Cargo Van","Mini Van",
    "Luxury Van","Family Van","Delivery Van","School Van","Urbania"
  ],

  pickup:[
    "Toyota Hilux","Mahindra Bolero Pickup","Isuzu D-Max",
    "Tata Yodha","Ashok Dost Pickup","Mahindra Jeeto",
    "Force Pickup","Bolero Camper","Single Cabin Pickup",
    "Double Cabin Pickup","Cargo Pickup","Mini Pickup",
    "Heavy Pickup","Rural Pickup","Utility Pickup"
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
let treeLoopStarted = false;
let birdLoopStarted = false;

// ===============================
// UPDATE VEHICLE
// ===============================
function updateVehicle(){

  const type =
    document.getElementById("vehicleType").value;

  const vehicle =
    document.getElementById("vehicle");

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

  const type =
    document.getElementById("vehicleType").value;

  const model =
    document.getElementById("vehicleModel");

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
function showPopup(message="Demo Vehicle Ready 🚀"){

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
function startTrip(){

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
async function connectESP32(){

  const vehicle =
    document.getElementById("vehicle");

  if(!tripStarted){
    alert("Start Trip first 🚀");
    return;
  }

  if(vehicle.style.display === "none"){
    alert("Select Vehicle first 🚗");
    return;
  }

  try{

    await navigator.bluetooth.requestDevice({
      acceptAllDevices:true
    });

    bluetoothConnected = true;

    document.getElementById("status").innerText =
      "Bluetooth Connected 🚗";

    showPopup("Vehicle Connected ✅");

    vehicle.classList.remove("crash");
    vehicle.classList.add("move");

    startTreeLoop();
    startBirdLoop();

  }catch(error){

    console.log(error);

    bluetoothConnected = false;

    document.getElementById("status").innerText =
      "Vehicle Not Connected";

    showPopup("Bluetooth Connection Failed ❌");
  }
}

function saveDetails(){

  localStorage.setItem(
    "driverData",
    "saved"
  );

  alert("✅ Details Saved!");
}


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

  alert("🗑 Data Cleared!");
}


function startTreeLoop(){

  if(treeLoopStarted) return;
  treeLoopStarted = true;

  const trees = ["🌳","🌳","🌴"];

  setInterval(()=>{

    if(!tripStarted || !bluetoothConnected) return;

    const tree =
      document.getElementById("roadTree");

    tree.innerText =
      trees[Math.floor(Math.random()*trees.length)];

    tree.classList.remove("treeMove");
    void tree.offsetWidth;
    tree.classList.add("treeMove");

  },2500);
}


function startBirdLoop(){

  if(birdLoopStarted) return;
  birdLoopStarted = true;

  function flyBird(){

    if(!tripStarted || !bluetoothConnected){
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