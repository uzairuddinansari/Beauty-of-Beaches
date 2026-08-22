gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("show");
            observer.unobserve(entry.target);

        });

    }, {
        threshold: 0.15
    });

    revealItems.forEach(item => observer.observe(item));

}



mm.add("(min-width: 768px)", () => {




    const daba2 = document.querySelector(".daba2");
    const daba3 = document.querySelector(".daba3");

    if (daba2) {

        gsap.to(daba2, {
            yPercent: -20,
            ease: "none",

            scrollTrigger: {
                trigger: daba2,
                start: "top 80%",
                end: "bottom top",
                scrub: 1
            }
        });

    }


    if (daba3) {

        gsap.to(daba3, {
            yPercent: -40,
            ease: "none",

            scrollTrigger: {
                trigger: daba3,
                start: "top 70%",
                end: "bottom top",
                scrub: 1
            }
        });

    }

    gsap.utils.toArray(".daba2 img, .daba3 img").forEach(img => {

        gsap.fromTo(
            img,
            {
                scale: 1.15
            },
            {
                scale: 1,
                ease: "none",

                scrollTrigger: {
                    trigger: img,
                    start: "top 90%",
                    end: "bottom 10%",
                    scrub: 1.2
                }
            }
        );

    });



    const daba1 = document.querySelector(".daba1");

    if (daba1) {

        gsap.from(daba1, {

            x: -80,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",

            scrollTrigger: {
                trigger: ".page4-sec1",
                start: "top 75%",
                toggleActions: "play none none reverse"
            }

        });

    }


    const daba4 = document.querySelector(".daba4");

    if (daba4) {

        gsap.from(daba4, {

            x: 80,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",

            scrollTrigger: {
                trigger: ".page4-sec2",
                start: "top 75%",
                toggleActions: "play none none reverse"
            }

        });

    }



    // LEARN MORE BUTTONS


    const learnMore = document.querySelectorAll(".learn-more");

    if (learnMore.length) {

        gsap.from(learnMore, {

            y: 30,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",

            scrollTrigger: {
                trigger: ".page4-sec1",
                start: "top 65%",
                toggleActions: "play none none reverse"
            }

        });

    }



    // ZONE BOX HOVER


    gsap.utils.toArray(".daba1, .daba4").forEach(box => {

        const hover = gsap.to(box, {
            y: -8,
            duration: 0.35,
            ease: "power2.out",
            paused: true
        });

        box.addEventListener("mouseenter", () => {
            hover.play();
        });

        box.addEventListener("mouseleave", () => {
            hover.reverse();
        });

    });

});


// ======================================================
// HERO
// ======================================================

const heroTitle = document.querySelectorAll("#page1 h1");

if (heroTitle.length) {

    const heroSplit = new SplitType(heroTitle, {
        types: "lines,words"
    });

    const heroTL = gsap.timeline({
        defaults: {
            ease: "power4.out"
        }
    });

    heroTL
        .from(heroSplit.lines, {
            yPercent: 120,
            opacity: 0,
            duration: 1.2,
            stagger: 0.12
        })

        .from("#page1 p", {
            y: 35,
            opacity: 0,
            duration: 0.9
        }, "-=0.6")

        .to(".box h4", {
            y: 25,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7
        }, "-=0.5");

}


// ======================================================
// HERO PARALLAX
// ======================================================

const page1 = document.querySelector("#page1");

if (page1) {

    gsap.to(page1, {

        yPercent: -8,
        opacity: 0.85,
        ease: "none",

        scrollTrigger: {
            trigger: page1,
            start: "top top",
            end: "bottom top",
            scrub: 1.2
        }

    });

}


// ======================================================
// DESTINATION HEADING
// ======================================================

const destinationHeading = document.querySelector("#hobbies");

if (destinationHeading) {

    const splitHeading = new SplitType(destinationHeading, {
        types: "chars,words"
    });

    gsap.from(splitHeading.chars, {

        yPercent: 100,
        opacity: 0,
        rotateX: -70,
        stagger: 0.035,
        duration: 0.9,
        ease: "power4.out",

        scrollTrigger: {
            trigger: destinationHeading,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }

    });


    gsap.from(destinationHeading, {

        x: -80,
        duration: 1,
        ease: "power3.out",

        scrollTrigger: {
            trigger: destinationHeading,
            start: "top 90%",
            toggleActions: "play none none reverse"
        }

    });

}


// ======================================================
// ZONE SECTIONS
// ======================================================

gsap.utils.toArray(".page4-sec1, .page4-sec2").forEach(section => {

    gsap.from(section, {

        opacity: 0,
        y: 80,
        duration: 1.1,
        ease: "power3.out",

        scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }

    });

});


// ======================================================
// TOURIST SECTION
// ======================================================

gsap.utils.toArray(".tourist-section").forEach(section => {

    const small = section.querySelectorAll(".tourist-heading small");
    const heading = section.querySelectorAll(".tourist-heading h2");
    const paragraph = section.querySelectorAll(".tourist-heading p");


    if (small.length) {

        gsap.from(small, {

            y: 25,
            opacity: 0,
            duration: 0.7,

            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }

        });

    }


    if (heading.length) {

        const splitTourist = new SplitType(heading, {
            types: "lines,words"
        });

        gsap.from(splitTourist.lines, {

            yPercent: 100,
            opacity: 0,
            stagger: 0.12,
            duration: 1,
            ease: "power4.out",

            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }

        });

    }


    if (paragraph.length) {

        gsap.from(paragraph, {

            y: 30,
            opacity: 0,
            duration: 0.9,

            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }

        });

    }

});


// ======================================================
// TOURIST PLACES / ZONE CARDS
// ======================================================

gsap.utils.toArray(".tourist-place").forEach(place => {

    const number = place.querySelector(".tourist-number");
    const title = place.querySelector(".tourist-title");
    const info = place.querySelector(".tourist-info");
    const card = place.querySelector(".tourist-card");
    const bottom = place.querySelector(".tourist-bottom");


    if (number) {

        gsap.from(number, {

            x: -50,
            opacity: 0,
            duration: 0.8,

            scrollTrigger: {
                trigger: place,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }

        });

    }


    if (title) {

        gsap.from(title, {

            y: 40,
            opacity: 0,
            duration: 0.9,
            delay: 0.1,
            ease: "power3.out",

            scrollTrigger: {
                trigger: place,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }

        });

    }


    if (info) {

        gsap.from(info, {

            x: -60,
            opacity: 0,
            duration: 1,

            scrollTrigger: {
                trigger: place,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }

        });

    }


    if (card) {

        gsap.from(card, {

            x: 70,
            opacity: 0,
            rotate: 2,
            duration: 1,
            ease: "power3.out",

            scrollTrigger: {
                trigger: place,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }

        });

    }


    if (bottom) {

        gsap.from(bottom, {

            y: 50,
            opacity: 0,
            duration: 0.9,

            scrollTrigger: {
                trigger: place,
                start: "top 60%",
                toggleActions: "play none none reverse"
            }

        });

    }

});


// ======================================================
// TOURIST CARD HOVER
// ======================================================

gsap.utils.toArray(".tourist-card").forEach(card => {

    const hover = gsap.to(card, {

        y: -10,
        rotate: 0,
        duration: 0.4,
        ease: "power3.out",
        paused: true

    });


    card.addEventListener("mouseenter", () => {
        hover.play();
    });


    card.addEventListener("mouseleave", () => {
        hover.reverse();
    });

});


// ======================================================
// REFRESH AFTER LOAD
// ======================================================

window.addEventListener("load", () => {

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 300);

});