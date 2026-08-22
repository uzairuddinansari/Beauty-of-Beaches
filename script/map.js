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


/* ===============================
   SELECTED TRANSPORT
================================ */

const selectedTransport = JSON.parse(
    sessionStorage.getItem("selectedTransport")
);


/* ===============================
   LOAD CHECKOUT JSON
================================ */

fetch("../json/checkout.json")
    .then(res => {
        if (!res.ok) {
            throw new Error("Could not load checkout.json");
        }

        return res.json();
    })
    .then(data => {

        checkoutData = data;
        beachData = data.beaches;

        if (!beachData) {
            throw new Error("Beach data not found.");
        }

    })
    .catch(error => {

        console.error(
            "JSON Error:",
            error
        );

    });


/* ===============================
   ZONE CHANGE
================================ */

zoneSelect.addEventListener("change", () => {

    const zone = zoneSelect.value;

    beachSelect.innerHTML = `
        <option value="">Choose Beach</option>
    `;

    if (!zone || !beachData || !beachData[zone]) {

        beachSelect.disabled = true;

        return;
    }

    beachData[zone].forEach(beach => {

        const option =
            document.createElement("option");

        option.value =
            beach.name;

        option.textContent =
            beach.name;

        beachSelect.appendChild(option);

    });

    beachSelect.disabled = false;

});


/* ===============================
   MAP
================================ */

const map = L.map("map").setView(
    [20, 0],
    2
);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap"
    }
).addTo(map);


/* ===============================
   USER LOCATION
================================ */

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        locationStatus.textContent =
            "Location is not supported.";

        return;
    }

    locationStatus.textContent =
        "Getting your location...";


    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            userLocation = {
                lat: lat,
                lng: lng
            };


            if (userMarker) {

                map.removeLayer(
                    userMarker
                );

            }


            userMarker =
                L.marker([
                    lat,
                    lng
                ])
                    .addTo(map)
                    .bindPopup(
                        "Your Location"
                    )
                    .openPopup();


            map.setView(
                [lat, lng],
                10
            );


            locationStatus.textContent =
                "Your location detected.";

        },

        () => {

            locationStatus.textContent =
                "Unable to get your location.";

        }

    );

});


/* ===============================
   BEACH CHANGE
================================ */

beachSelect.addEventListener(
    "change",
    () => {

        const zone =
            zoneSelect.value;

        const beachName =
            beachSelect.value;


        if (
            !zone ||
            !beachName ||
            !userLocation ||
            !beachData
        ) {

            return;

        }


        const beach =
            beachData[zone].find(
                item =>
                    item.name === beachName
            );


        if (!beach) {
            return;
        }


        /* =========================
           BEACH MARKER
        ========================= */

        if (beachMarker) {

            map.removeLayer(
                beachMarker
            );

        }


        beachMarker =
            L.marker([
                beach.latitude,
                beach.longitude
            ])
                .addTo(map)
                .bindPopup(
                    beach.name
                )
                .openPopup();


        /* =========================
           DISTANCE
        ========================= */

        distanceKm =
            calculateDistance(
                userLocation.lat,
                userLocation.lng,
                beach.latitude,
                beach.longitude
            );


        /* =========================
           ROUTE
        ========================= */

        if (routeLine) {

            map.removeLayer(
                routeLine
            );

        }


        routeLine =
            L.polyline([
                [
                    userLocation.lat,
                    userLocation.lng
                ],
                [
                    beach.latitude,
                    beach.longitude
                ]
            ])
                .addTo(map);


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


        /* =========================
           CALCULATE TRAVEL
        ========================= */

        const result =
            calculateTravel(
                distanceKm
            );


        if (!result) {

            console.warn(
                "Travel calculation failed."
            );

            return;
        }


        /* =========================
           RESULT
        ========================= */

        distanceResult.textContent =
            `${distanceKm.toFixed(1)} KM`;


        timeResult.textContent =
            `${result.hours.toFixed(2)} Hours`;


        transportResult.textContent =
            selectedTransport
                ? selectedTransport.name
                : "—";


        priceResult.textContent =
            `$${result.total.toFixed(2)}`;


        /* =========================
           SUMMARY CARD
        ========================= */

        summaryTransport.textContent =
            selectedTransport
                ? selectedTransport.name
                : "—";


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


        /* =========================
           SAVE COMPLETE TRAVEL DATA
        ========================= */

        const travelData = {

            transport:
                selectedTransport
                    ? selectedTransport.name
                    : "",

            pricePerHour:
                selectedTransport
                    ? Number(
                        selectedTransport.pricePerHour
                    )
                    : 0,

            zone:
                zone,

            beach:
                beach.name,

            distance:
                distanceKm,

            hours:
                result.hours,

            total:
                result.total

        };


        sessionStorage.setItem(
            "travelData",
            JSON.stringify(
                travelData
            )
        );

    }
);


/* ===============================
   DISTANCE CALCULATION
================================ */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;


    const dLat =
        (lat2 - lat1) *
        Math.PI /
        180;


    const dLon =
        (lon2 - lon1) *
        Math.PI /
        180;


    const a =
        Math.sin(
            dLat / 2
        ) ** 2 +

        Math.cos(
            lat1 *
            Math.PI /
            180
        ) *

        Math.cos(
            lat2 *
            Math.PI /
            180
        ) *

        Math.sin(
            dLon / 2
        ) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;

}


/* ===============================
   TRAVEL CALCULATION
================================ */

function calculateTravel(distance) {

    if (
        !selectedTransport ||
        !checkoutData
    ) {

        return null;

    }


    let transportData = null;


    if (
        selectedTransport.name ===
        "AirLine"
    ) {

        transportData =
            checkoutData.transport.airplane;

    }

    else if (
        selectedTransport.name ===
        "Coach"
    ) {

        transportData =
            checkoutData.transport.bus;

    }

    else if (
        selectedTransport.name ===
        "Car Rental"
    ) {

        transportData =
            checkoutData.transport.car;

    }


    if (!transportData) {

        return null;

    }


    const speed =
        Number(
            transportData.speed
        );


    /*
       Travels card ki price
       directly use hogi.
       Isliye AirLine = 1300,
       Coach = 700,
       Car Rental = 200
    */

    const pricePerHour =
        Number(
            selectedTransport.pricePerHour
        );


    if (
        !speed ||
        !pricePerHour
    ) {

        return null;

    }


    const hours =
        distance /
        speed;


    const total =
        hours *
        pricePerHour;


    return {

        hours:
            hours,

        total:
            total

    };

}
