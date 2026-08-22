const checkoutParams = new URLSearchParams(window.location.search);

const selectedTransport = checkoutParams.get("transport");
const selectedPrice = checkoutParams.get("price");

if (selectedTransport && selectedPrice) {
    let existingData = {};

    try {
        existingData =
            JSON.parse(sessionStorage.getItem("travelData")) || {};
    } catch (error) {
        existingData = {};
    }

    existingData.transport = selectedTransport;
    existingData.price = Number(selectedPrice);
    existingData.pricePerHour = Number(selectedPrice);

    sessionStorage.setItem(
        "travelData",
        JSON.stringify(existingData)
    );
}

const bookingForm = document.querySelector("#bookingForm");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const emailInput = document.querySelector("#email");

const popup = document.querySelector("#bookingPopup");
const popupTransport = document.querySelector("#popupTransport");
const popupBeach = document.querySelector("#popupBeach");
const popupTotal = document.querySelector("#popupTotal");
const popupClose = document.querySelector("#popupClose");

emailjs.init({
    publicKey: "BzGltKCOegYcIM4YV"
});

bookingForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !phone || !email) {
        alert("Please fill all fields.");
        return;
    }

    if (!emailInput.checkValidity()) {
        alert("Please enter a valid email.");
        return;
    }

    const travelData = JSON.parse(
        sessionStorage.getItem("travelData")
    );

    if (!travelData) {
        alert("Please select your beach first.");
        return;
    }

    const finalBooking = {
        customer: {
            name: name,
            phone: phone,
            email: email
        },
        travel: travelData
    };

    sessionStorage.setItem(
        "finalBooking",
        JSON.stringify(finalBooking)
    );

    popupTransport.textContent =
        travelData.transport || "—";

    popupBeach.textContent =
        travelData.beach || "—";

    popupTotal.textContent =
        `$${Number(travelData.total || 0).toFixed(2)}`;

    popup.classList.add("active");

    bookingForm.reset();

    try {

        const ticket =
            generateTicketPDF(finalBooking);

        const ticketUrl =
            await uploadTicketPDF(
                ticket.pdf,
                ticket.ticketId
            );

        await emailjs.send(
            "service_9lcovpr",
            "template_psapi7g",
            {
                customer_name:
                    name,

                customer_email:
                    email,

                phone:
                    phone,

                transport:
                    travelData.transport,

                beach:
                    travelData.beach,

                zone:
                    travelData.zone,

                distance:
                    Number(
                        travelData.distance
                    ).toFixed(1),

                hours:
                    Number(
                        travelData.hours
                    ).toFixed(2),

                total:
                    `$${Number(
                        travelData.total
                    ).toFixed(2)}`,

                booking_id:
                    ticket.ticketId,

                ticket_url:
                    ticketUrl
            }
        );

        console.log(
            "Confirmation email sent."
        );

    } catch (error) {

        console.error(
            "Booking Error:",
            error
        );

    }

});

popupClose.addEventListener("click", () => {

    popup.classList.remove("active");

    bookingForm.reset();

    zoneSelect.value = "";

    beachSelect.innerHTML = `
        <option value="">
            Choose Beach
        </option>
    `;

    beachSelect.disabled = true;

    if (userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
    }

    if (beachMarker) {
        map.removeLayer(beachMarker);
        beachMarker = null;
    }

    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }

    userLocation = null;

    distanceKm = 0;

    map.setView(
        [20, 0],
        2
    );

    distanceResult.textContent = "—";

    timeResult.textContent = "—";

    transportResult.textContent = "—";

    priceResult.textContent = "—";

    summaryTransport.textContent = "—";

    summaryBeach.textContent =
        "Choose Beach";

    summaryZoneText.textContent =
        "Select your destination";

    summaryZone.textContent =
        "DESTINATION";

    summaryDistance.textContent =
        "0 KM";

    summaryTime.textContent =
        "0 Hours";

    summaryTotal.textContent =
        "$0.00";

    sessionStorage.removeItem(
        "travelData"
    );

    sessionStorage.removeItem(
        "finalBooking"
    );

});

function generateTicketPDF(booking) {

    const { jsPDF } =
        window.jspdf;

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
    });

    const ticketId =
        "BOB-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

    const qrContainer =
        document.createElement("div");

    new QRCode(
        qrContainer,
        {
            text: ticketId,
            width: 120,
            height: 120,
            correctLevel:
                QRCode.CorrectLevel.M
        }
    );

    const qrCanvas =
        qrContainer.querySelector(
            "canvas"
        );

    if (!qrCanvas) {
        throw new Error(
            "QR Code could not be generated."
        );
    }

    const qrImage =
        qrCanvas.toDataURL(
            "image/jpeg",
            0.5
        );

    pdf.setFillColor(
        17,
        17,
        17
    );

    pdf.rect(
        0,
        0,
        210,
        42,
        "F"
    );

    pdf.setTextColor(
        255,
        255,
        255
    );

    pdf.setFontSize(22);

    pdf.text(
        "BEAUTYOFBEACHES",
        20,
        20
    );

    pdf.setFontSize(9);

    pdf.text(
        "TRAVEL TICKET",
        20,
        28
    );

    pdf.setTextColor(
        17,
        17,
        17
    );

    pdf.setFontSize(20);

    pdf.text(
        "BOOKING CONFIRMED",
        20,
        58
    );

    pdf.setFontSize(10);

    pdf.setTextColor(
        100,
        100,
        100
    );

    pdf.text(
        "Your travel booking has been successfully confirmed.",
        20,
        66
    );

    pdf.setTextColor(
        17,
        17,
        17
    );

    pdf.setFontSize(10);

    pdf.text(
        "BOOKING ID",
        20,
        82
    );

    pdf.setFontSize(15);

    pdf.text(
        ticketId,
        20,
        90
    );

    pdf.setFontSize(12);

    pdf.text(
        "PASSENGER DETAILS",
        20,
        110
    );

    pdf.setDrawColor(
        220,
        220,
        220
    );

    pdf.line(
        20,
        114,
        190,
        114
    );

    pdf.setFontSize(10);

    pdf.text(
        `Name: ${booking.customer.name}`,
        20,
        125
    );

    pdf.text(
        `Email: ${booking.customer.email}`,
        20,
        133
    );

    pdf.text(
        `Phone: ${booking.customer.phone}`,
        20,
        141
    );

    pdf.setFontSize(12);

    pdf.text(
        "TRAVEL DETAILS",
        20,
        160
    );

    pdf.line(
        20,
        164,
        190,
        164
    );

    pdf.setFontSize(10);

    pdf.text(
        `Beach: ${booking.travel.beach}`,
        20,
        175
    );

    pdf.text(
        `Zone: ${booking.travel.zone}`,
        20,
        183
    );

    pdf.text(
        `Transport: ${booking.travel.transport}`,
        20,
        191
    );

    pdf.text(
        `Distance: ${Number(
            booking.travel.distance
        ).toFixed(1)} KM`,
        20,
        199
    );

    pdf.text(
        `Travel Time: ${Number(
            booking.travel.hours
        ).toFixed(2)} Hours`,
        20,
        207
    );

    pdf.setFillColor(
        17,
        17,
        17
    );

    pdf.rect(
        20,
        220,
        170,
        20,
        "F"
    );

    pdf.setTextColor(
        255,
        255,
        255
    );

    pdf.setFontSize(10);

    pdf.text(
        "TOTAL FARE",
        28,
        232
    );

    pdf.setFontSize(16);

    pdf.text(
        `$${Number(
            booking.travel.total
        ).toFixed(2)}`,
        150,
        232
    );

    pdf.addImage(
        qrImage,
        "JPEG",
        135,
        55,
        45,
        45,
        undefined,
        "FAST"
    );

    pdf.setTextColor(
        100,
        100,
        100
    );

    pdf.setFontSize(8);

    pdf.text(
        "Scan Ticket",
        148,
        103
    );

    pdf.setTextColor(
        120,
        120,
        120
    );

    pdf.setFontSize(9);

    pdf.text(
        "Thank you for choosing BeautyOfBeaches.",
        20,
        265
    );

    pdf.text(
        "Please keep this ticket for your journey.",
        20,
        272
    );

    pdf.setFontSize(8);

    pdf.text(
        "© BeautyOfBeaches — Travel Beyond Boundaries",
        20,
        285
    );

    return {
        pdf: pdf,
        ticketId: ticketId
    };
}

async function uploadTicketPDF(pdf, ticketId) {

    const cloudName = "i6su4pd1";

    const uploadPreset =
        "beautyofbeaches_ticket";

    const pdfBlob =
        pdf.output("blob");

    const formData =
        new FormData();

    formData.append(
        "file",
        pdfBlob,
        `${ticketId}.pdf`
    );

    formData.append(
        "upload_preset",
        uploadPreset
    );

    const response =
        await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );

    if (!response.ok) {
        throw new Error(
            "PDF upload failed."
        );
    }

    const data =
        await response.json();

    return data.secure_url;
}

gsap.registerPlugin(
    ScrollTrigger
);

const checkoutMM =
    gsap.matchMedia();

const checkoutIntro =
    gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

checkoutIntro
    .from(
        ".checkout_head span",
        {
            y: 20,
            opacity: 0,
            duration: 0.7
        }
    )

    .from(
        ".checkout_head h1",
        {
            y: 70,
            opacity: 0,
            duration: 1,
            clipPath:
                "inset(100% 0% 0% 0%)"
        },
        "-=0.3"
    )

    .from(
        ".checkout_head p",
        {
            y: 25,
            opacity: 0,
            duration: 0.7
        },
        "-=0.5"
    )

    .from(
        ".checkout_form",
        {
            y: 50,
            opacity: 0,
            duration: 0.9
        },
        "-=0.3"
    );

checkoutMM.add(
    "(min-width: 768px)",
    () => {

        gsap.utils
            .toArray(".form_section")
            .forEach((section) => {

                const number =
                    section.querySelector(
                        ".section_title span"
                    );

                const title =
                    section.querySelector(
                        ".section_title h2"
                    );

                const elements =
                    section.querySelectorAll(
                        ".field, .location_box, .checkout_map, .travel_results"
                    );

                const tl =
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            end: "top 40%",
                            scrub: 1
                        }
                    });

                tl.from(
                    number,
                    {
                        x: -30,
                        opacity: 0
                    }
                )

                .from(
                    title,
                    {
                        y: 40,
                        opacity: 0,
                        clipPath:
                            "inset(100% 0% 0% 0%)"
                    },
                    "-=0.5"
                )

                .from(
                    elements,
                    {
                        y: 35,
                        opacity: 0,
                        stagger: 0.08
                    },
                    "-=0.3"
                );

            });

    }
);
