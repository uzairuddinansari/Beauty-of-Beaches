gsap.registerPlugin(ScrollTrigger);

const isDesktop = window.matchMedia("(min-width: 801px)").matches;

if (isDesktop) {
    const siteMap = document.querySelector(".site-map");
    const mapStage = document.querySelector(".map-stage");
    const worldMap = document.querySelector(".world-map");
    const mapRoutes = document.querySelectorAll(".map-route");
    const zoneCards = document.querySelectorAll(".zone-card");
    const mapNodes = document.querySelectorAll(".map-node");
    const beachPoints = document.querySelectorAll(".beach-point");

    gsap.set(".site-map-title", {
        yPercent: 110
    });

    gsap.set(".site-map-intro", {
        y: 40,
        opacity: 0
    });

    gsap.set(".site-map-meta", {
        opacity: 0
    });

    gsap.set(".map-stage", {
        opacity: 0,
        scale: .94
    });

    gsap.set(".zone-card", {
        opacity: 0,
        y: 30
    });

    gsap.set(".map-center", {
        opacity: 0,
        scale: .7
    });

    const mapReveal = gsap.timeline({

        scrollTrigger: {
            trigger: siteMap,
            start: "top 70%",
            once: true
        }

    });


    mapReveal

        .to(".site-map-meta", {
            opacity: 1,
            duration: .7,
            ease: "power2.out"
        })

        .to(".site-map-title", {
            yPercent: 0,
            duration: 1.1,
            ease: "power4.out"
        }, "-=.3")

        .to(".site-map-intro", {
            y: 0,
            opacity: 1,
            duration: .8,
            ease: "power3.out"
        }, "-=.7")

        .to(".map-stage", {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "power4.out"
        }, "-=.4")

        .to(".zone-card", {
            opacity: 1,
            y: 0,
            duration: .75,
            stagger: .1,
            ease: "power3.out"
        }, "-=.6")

        .to(".map-center", {
            opacity: 1,
            scale: 1,
            duration: .75,
            ease: "back.out(1.7)"
        }, "-=.5");



    mapRoutes.forEach((route) => {

        const length = route.getTotalLength();

        gsap.set(route, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        gsap.to(route, {

            strokeDashoffset: 0,

            duration: 2.2,

            ease: "power2.inOut",

            scrollTrigger: {
                trigger: mapStage,
                start: "top 70%",
                once: true
            }

        });

    });


    mapRoutes.forEach((route) => {

        gsap.to(route, {

            strokeDashoffset: "-=100",

            duration: 2.5,

            repeat: -1,

            ease: "none"

        });

    });



    mapNodes.forEach((node, index) => {

        const ring = node.querySelector(".node-ring");

        if (!ring) return;

        gsap.to(ring, {

            attr: {
                r: 27
            },

            opacity: .15,

            duration: 1.6,

            repeat: -1,

            yoyo: true,

            delay: index * .3,

            ease: "sine.inOut"

        });

    });



    gsap.to(beachPoints, {

        scale: 2,

        transformOrigin: "center",

        opacity: .1,

        duration: 1.2,

        repeat: -1,

        yoyo: true,

        stagger: .18,

        ease: "sine.inOut"

    });



    const zoneData = {

        north: ".route-north",
        east: ".route-east",
        south: ".route-south",
        west: ".route-west"

    };


    zoneCards.forEach((card) => {

        const zone =
            card.classList.contains("zone-north")
                ? "north"
                : card.classList.contains("zone-east")
                    ? "east"
                    : card.classList.contains("zone-south")
                        ? "south"
                        : "west";


        const route =
            document.querySelector(zoneData[zone]);


        if (!route) return;


        card.addEventListener("mouseenter", () => {

            gsap.to(route, {

                opacity: 1,

                strokeWidth: 2.5,

                duration: .35,

                overwrite: true

            });


            gsap.to(worldMap, {

                scale: 1.025,

                duration: .6,

                ease: "power3.out",

                overwrite: true

            });

        });


        card.addEventListener("mouseleave", () => {

            gsap.to(route, {

                opacity: .55,

                strokeWidth: 1.2,

                duration: .35,

                overwrite: true

            });


            gsap.to(worldMap, {

                scale: 1,

                duration: .6,

                ease: "power3.out",

                overwrite: true

            });

        });

    });



    mapNodes.forEach((node) => {

        const zone = node.dataset.zone;

        const card =
            document.querySelector(`.zone-${zone}`);


        if (!card) return;


        node.addEventListener("mouseenter", () => {

            gsap.to(card, {

                y: -8,

                scale: 1.03,

                duration: .45,

                ease: "power3.out",

                overwrite: true

            });

        });


        node.addEventListener("mouseleave", () => {

            gsap.to(card, {

                y: 0,

                scale: 1,

                duration: .45,

                ease: "power3.out",

                overwrite: true

            });

        });

    });

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    let parallaxFrame = null;


    mapStage.addEventListener("mousemove", (e) => {

        const rect =
            mapStage.getBoundingClientRect();


        mouseX =
            ((e.clientX - rect.left) /
                rect.width - .5);


        mouseY =
            ((e.clientY - rect.top) /
                rect.height - .5);


        if (!parallaxFrame) {

            parallaxFrame =
                requestAnimationFrame(mapParallax);

        }

    });


    function mapParallax() {

        currentX +=
            (mouseX - currentX) * .08;

        currentY +=
            (mouseY - currentY) * .08;


        gsap.set(worldMap, {

            x: currentX * 16,

            y: currentY * 10

        });


        gsap.set(".zone-card", {

            x: currentX * -7,

            y: currentY * -4

        });


        if (

            Math.abs(mouseX - currentX) > .001 ||

            Math.abs(mouseY - currentY) > .001

        ) {

            parallaxFrame =
                requestAnimationFrame(mapParallax);

        } else {

            parallaxFrame = null;

        }

    }




    const mapMouse =
        document.querySelector(".map-mouse b");


    if (mapMouse) {

        mapStage.addEventListener("mousemove", (e) => {

            const rect =
                mapStage.getBoundingClientRect();


            const x =
                Math.round(

                    ((e.clientX - rect.left) /
                        rect.width) * 999

                );


            mapMouse.textContent =
                x.toString().padStart(3, "0");

        });

    }



    gsap.fromTo(

        ".center-line",

        {
            scaleY: 0
        },

        {
            scaleY: 1,

            duration: 1,

            ease: "power3.inOut",

            scrollTrigger: {

                trigger: ".map-center",

                start: "top 75%",

                once: true

            }

        }

    );

}