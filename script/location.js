const dateElement = document.querySelector("#current-date");
const timeElement = document.querySelector("#current-time");
const locationElement = document.querySelector(".info-location");
const triggerTime = document.querySelector(".trigger-time");
let userLocation = "Detecting location...";
function updateDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    dateElement.textContent = date;

    timeElement.textContent = time;

    triggerTime.textContent =
        now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });
}


updateDateTime();
setInterval(updateDateTime, 1000);

function getUserLocation() {

    if (!navigator.geolocation) {

        locationElement.textContent =
            "Location unavailable";

        return;
    }


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );


                const data = await response.json();

                const address = data.address;


                const city =
                    address.city ||
                    address.town ||
                    address.village ||
                    address.municipality ||
                    "Unknown";


                const country =
                    address.country ||
                    "Unknown";


                userLocation =
                    `${city}, ${country}`;


                locationElement.textContent =
                    userLocation;


            } catch (error) {

                console.error(
                    "Location lookup failed:",
                    error
                );

                locationElement.textContent =
                    "Location unavailable";
            }

        },


        () => {

            locationElement.textContent =
                "Location permission denied";

        }

    );
}
getUserLocation();



const overlay = document.querySelector(".map-info-overlay");
const trigger = document.querySelector(".time-trigger");

const infoElements = [
    ".info-label",
    ".info-location",
    ".info-item"
];

let isOpen = false;


const popupTimeline = gsap.timeline({
    paused: true
});


popupTimeline
    .set(overlay, {
        visibility: "visible"
    })

    .to(overlay, {
        clipPath: "circle(150% at 90% 90%)",
        duration: 0.9,
        ease: "power4.inOut"
    })

    .from(infoElements, {
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out"
    }, "-=0.45");

    trigger.addEventListener("click", () => {

    if (!isOpen) {

        popupTimeline.play();

        gsap.to(trigger, {
            rotation: 45,
            duration: 0.5,
            ease: "power3.out"
        });

        isOpen = true;

    } else {

        popupTimeline.reverse();

        gsap.to(trigger, {
            rotation: 0,
            duration: 0.5,
            ease: "power3.out"
        });

        isOpen = false;
    }

});
