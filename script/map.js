let beachMarker = null;
let routeLine = null;
let distanceKm = 0;

let checkoutData = null;
let beachData = null;

let userMarker = null;
let userLocation = null;

const zoneSelect = document.querySelector("#zone");
const beachSelect = document.querySelector("#beach");

const locationBtn = document.querySelector("#locationBtn");
const locationStatus = document.querySelector("#locationStatus");

const distanceResult = document.querySelector("#distanceResult");
const timeResult = document.querySelector("#timeResult");
const transportResult = document.querySelector("#transportResult");
const priceResult = document.querySelector("#priceResult");

const summaryImage = document.querySelector("#summaryImage");
const summaryZone = document.querySelector("#summaryZone");
const summaryTransport = document.querySelector("#summaryTransport");
const summaryBeach = document.querySelector("#summaryBeach");
const summaryZoneText = document.querySelector("#summaryZoneText");
const summaryDistance = document.querySelector("#summaryDistance");
const summaryTime = document.querySelector("#summaryTime");
const summaryTotal = document.querySelector("#summaryTotal");

fetch("../json/checkout.json")
    .then(res => res.json())
    .then(data => {
        checkoutData = data;
        beachData = data.beaches;
    })
    .catch(error => {
        console.error("JSON Error:", error);
    });

zoneSelect.addEventListener("change", () => {
    const zone = zoneSelect.value;

    beachSelect.innerHTML = `
        <option value="">Choose Beach</option>
    `;

    if (!zone) {
        beachSelect.disabled = true;
        return;
    }

    beachData[zone].forEach(beach => {
        const option = document.createElement("option");

        option.value = beach.name;
        option.textContent = beach.name;

        beachSelect.appendChild(option);
    });

    beachSelect.disabled = false;
});

const map = L.map("map").setView([20, 0], 2);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap"
    }
).addTo(map);

locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        locationStatus.textContent = "Location is not supported.";
        return;
    }

    locationStatus.textContent = "Getting your location...";

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            userLocation = {
                lat,
                lng
            };

            if (userMarker) {
                map.removeLayer(userMarker);
            }

            userMarker = L.marker([
                lat,
                lng
            ])
                .addTo(map)
                .bindPopup("Your Location")
                .openPopup();

            map.setView([lat, lng], 10);

            locationStatus.textContent =
                "Your location detected.";
        },
        () => {
            locationStatus.textContent =
                "Unable to get your location.";
        }
    );
});

beachSelect.addEventListener("change", () => {
    const zone = zoneSelect.value;
    const beachName = beachSelect.value;

    if (!zone || !beachName || !userLocation) {
        return;
    }

    const beach = beachData[zone].find(
        item => item.name === beachName
    );

    if (!beach) return;

    if (beachMarker) {
        map.removeLayer(beachMarker);
    }

    beachMarker = L.marker([
        beach.latitude,
        beach.longitude
    ])
        .addTo(map)
        .bindPopup(beach.name)
        .openPopup();

    distanceKm = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        beach.latitude,
        beach.longitude
    );

    if (routeLine) {
        map.removeLayer(routeLine);
    }

    routeLine = L.polyline([
        [
            userLocation.lat,
            userLocation.lng
        ],
        [
            beach.latitude,
            beach.longitude
        ]
    ]).addTo(map);

    map.fitBounds([
        [
            userLocation.lat,
            userLocation.lng
        ],
        [
            beach.latitude,
            beach.longitude
        ]
    ]);

    locationStatus.textContent =
        `${distanceKm.toFixed(1)} KM from ${beach.name}`;

    const result = calculateTravel(distanceKm);

    if (!result) {
        console.warn("Travel calculation failed.");
        return;
    }

    const selectedTransport = JSON.parse(
        sessionStorage.getItem("selectedTransport")
    );

    if (!selectedTransport) {
        console.warn("Transport not selected.");
        return;
    }

    distanceResult.textContent =
        `${distanceKm.toFixed(1)} KM`;

    timeResult.textContent =
        `${result.hours.toFixed(2)} Hours`;

    transportResult.textContent =
        selectedTransport.name;

    priceResult.textContent =
        `$${result.total.toFixed(2)}`;

    summaryTransport.textContent =
        selectedTransport.name;

    summaryBeach.textContent =
        beach.name;

    summaryZoneText.textContent =
        `${zone} zone`;

    summaryZone.textContent =
        zone.toUpperCase();

    summaryDistance.textContent =
        `${distanceKm.toFixed(1)} KM`;

    summaryTime.textContent =
        `${result.hours.toFixed(2)} Hours`;

    summaryTotal.textContent =
        `$${result.total.toFixed(2)}`;

    const travelData = {
        transport: selectedTransport.name,
        pricePerHour: result.hours > 0
            ? result.total / result.hours
            : 0,
        zone: zone,
        beach: beach.name,
        distance: distanceKm,
        hours: result.hours,
        total: result.total
    };

    sessionStorage.setItem(
        "travelData",
        JSON.stringify(travelData)
    );
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

function calculateTravel(distance) {
    const selectedTransport = JSON.parse(
        sessionStorage.getItem("selectedTransport")
    );

    if (!selectedTransport || !checkoutData) {
        return null;
    }

    let transportData;

    if (selectedTransport.name === "AirLine") {
        transportData = checkoutData.transport.airplane;
    }
    else if (selectedTransport.name === "Coach") {
        transportData = checkoutData.transport.bus;
    }
    else if (selectedTransport.name === "Car Rental") {
        transportData = checkoutData.transport.car;
    }

    if (!transportData) {
        return null;
    }

    const speed = Number(transportData.speed);
    const pricePerHour = Number(transportData.pricePerHour);

    if (!speed || !pricePerHour) {
        return null;
    }

    const hours = distance / speed;
    const total = hours * pricePerHour;

    return {
        hours,
        total
    };
}