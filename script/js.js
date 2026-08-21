gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
    trigger: ".page2",
    start: "top top",

    onEnter: () => {

        const video = document.querySelector(".hero-media video");

        if (video) {
            video.pause();
        }

    },

    onLeaveBack: () => {

        const video = document.querySelector(".hero-media video");

        if (video) {
            video.play();
        }
    }
});


import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    remove,
    onDisconnect,
    onValue,
    runTransaction
}
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyAduK-Y8dTWuIAtpYcds4yGnd_nuilaB5c",
    authDomain: "beautyofbeaches-e0019.firebaseapp.com",
    databaseURL:
        "https://beautyofbeaches-e0019-default-rtdb.firebaseio.com",
    projectId: "beautyofbeaches-e0019",
    storageBucket:
        "beautyofbeaches-e0019.firebasestorage.app",
    messagingSenderId: "1087319653116",
    appId:
        "1:1087319653116:web:d7f9c04861e826fed2f579",
    measurementId: "G-HYYWW5K63V"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// LIVE VISITORS

const liveVisitorsRef = ref(database, "liveVisitors");
const visitorConnection = push(liveVisitorsRef);
const visitorData = {
    online: true,
    joinedAt: Date.now()
};
// IMPORTANT:
// disconnect hone par automatically remove
onDisconnect(visitorConnection)
    .remove()
    .then(() => {
        set(visitorConnection, visitorData);
    });


// Count live visitors
onValue(liveVisitorsRef, (snapshot) => {

    const data = snapshot.val();

    const count = data
        ? Object.keys(data).length
        : 0;

    const liveElement =
        document.getElementById("liveVisitors");

    if (liveElement) {
        liveElement.textContent = count;
    }

});
// TOTAL VISITORS
const totalVisitorsRef =
    ref(database, "stats/totalVisitors");


// Create a unique ID for this browser
let visitorId =
    localStorage.getItem("beautyVisitorId");


if (!visitorId) {

    visitorId =
        crypto.randomUUID();

    localStorage.setItem(
        "beautyVisitorId",
        visitorId
    );

}


// Check whether this browser was counted before
const countedBefore =
    localStorage.getItem("beautyVisitorCounted");


if (!countedBefore) {

    runTransaction(
        totalVisitorsRef,
        (currentValue) => {

            return (currentValue || 0) + 1;

        }
    )
    .then(() => {

        localStorage.setItem(
            "beautyVisitorCounted",
            "true"
        );

    });

}

// Display total visitors
onValue(totalVisitorsRef, (snapshot) => {

    const total =
        snapshot.val() || 0;

    const totalElement =
        document.getElementById("totalVisitors");

    if (totalElement) {

        totalElement.textContent =
            total.toLocaleString();

    }

});

const visitorPeek = document.getElementById("visitorPeek");

if (visitorPeek) {
    // Page load ke baad 1 second mein show
    setTimeout(() => {
        visitorPeek.classList.add("visitor-intro");
    }, 1000);
    // 6.5 seconds ke baad side mein chala jaye
    setTimeout(() => {
        visitorPeek.classList.remove("visitor-intro");
        visitorPeek.classList.add("visitor-hide");
    }, 6500);
}




gsap.utils.toArray(".gallery-item").forEach((item, index) => {

    const image = item.querySelector("img");
    const info = item.querySelector(".gallery-info");
    gsap.from(item, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        delay: index * 0.05,
        ease: "power4.out",
        scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse"
        }
    });
    gsap.to(image, {
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse"
        }

    });

});


/* ================= HEADER REVEAL ================= */

gsap.from(".gallery-header h2", {

    y: 120,

    opacity: 0,

    duration: 1.4,

    ease: "power4.out",

    scrollTrigger: {

        trigger: ".gallery-header",

        start: "top 80%",

        toggleActions: "play none none reverse"

    }

});


gsap.from(".gallery-label, .gallery-description", {

    y: 30,

    opacity: 0,

    duration: 1,

    stagger: 0.15,

    ease: "power3.out",

    scrollTrigger: {

        trigger: ".gallery-header",

        start: "top 80%",

        toggleActions: "play none none reverse"

    }

});