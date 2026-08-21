gsap.registerPlugin(ScrollTrigger);
const heroTitles = document.querySelectorAll(".hero-title");
const splitElements = document.querySelectorAll(".split-text");

splitElements.forEach((element) => {
    new SplitType(element, {
        types: "lines, words"
    });
});
const loader = document.querySelector(".loader");
const loaderNumber = document.querySelector(".loader-number span");
const loaderLine = document.querySelector(".loader-line div");

if (loader && loaderNumber && loaderLine) {

    const loaderValue = {
        value: 0
    };

    gsap.to(loaderValue, {

        value: 100,

        duration: 2,

        ease: "power2.out",

        onUpdate: () => {

            loaderNumber.textContent =
                Math.floor(loaderValue.value);

            gsap.set(loaderLine, {
                width: `${loaderValue.value}%`
            });

        },

        onComplete: () => {

            const loaderTl = gsap.timeline();

            loaderTl

                .to(".loader-number", {
                    y: -100,
                    opacity: 0,
                    duration: .5
                })

                .to(".loader-top", {
                    y: -50,
                    opacity: 0,
                    duration: .4
                }, "<")

                .to(".loader", {
                    clipPath: "inset(0 0 100% 0)",
                    duration: 1.2,
                    ease: "power4.inOut"
                })

                .from(".hero-title", {
                    y: 100,
                    opacity: 0,
                    stagger: .12,
                    duration: 1.3,
                    ease: "power4.out"
                }, "-=.5")

                .from(".small-title", {
                    y: 30,
                    opacity: 0,
                    duration: .8
                }, "-=.8")

                .from(".hero-bottom", {
                    y: 30,
                    opacity: 0,
                    duration: .8
                }, "-=.5");

        }

    });

} else {
    gsap.from(".hero-title", {

        y: 100,
        opacity: 0,

        stagger: .12,

        duration: 1.3,

        ease: "power4.out"

    });

    gsap.from(".small-title", {

        y: 30,
        opacity: 0,

        duration: .8,

        delay: .3

    });

    gsap.from(".hero-bottom", {

        y: 30,
        opacity: 0,

        duration: .8,

        delay: .5

    });

}

gsap.to(".hero-image img", {
    scale: 1,
    duration: 2,
    ease: "power3.out"
});

splitElements.forEach((element) => {
    const words = element.querySelectorAll(".word");
    if (!words.length) return;
    gsap.from(words, {
        scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        yPercent: 110,
        opacity: 0,
        stagger: .035,
        duration: 1,
        ease: "power4.out"
    });

});

gsap.utils.toArray(".story-img-wrap img").forEach((image) => {

    const wrapper = image.closest(".story-image");

    if (!wrapper) return;

    gsap.to(image, {

        yPercent: -15,

        ease: "none",

        scrollTrigger: {

            trigger: wrapper,

            start: "top bottom",

            end: "bottom top",

            scrub: true

        }

    });

});

const ctaImage = document.querySelector(".cta-image img");

if (ctaImage) {

    gsap.to(ctaImage, {

        yPercent: -10,

        ease: "none",

        scrollTrigger: {

            trigger: ".about-cta",

            start: "top bottom",

            end: "bottom top",

            scrub: true

        }

    });

}
const floatingWord =
    document.querySelector(".floating-word");

if (floatingWord) {
    gsap.to(floatingWord, {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: ".story-image",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });
}

gsap.utils.toArray(".story-grid").forEach((row) => {

    gsap.from(row, {

        opacity: 0,

        y: 100,

        duration: 1,

        ease: "power4.out",

        scrollTrigger: {

            trigger: row,

            start: "top 80%",

            toggleActions: "play none none reverse"

        }

    });

});

const zoneList = document.querySelector(".zone-list");

if (zoneList) {

    gsap.from(".zone", {

        x: -100,

        opacity: 0,

        stagger: .12,

        duration: 1,

        ease: "power4.out",

        scrollTrigger: {

            trigger: zoneList,

            start: "top 75%"

        }

    });

}

const stats = document.querySelectorAll(".stat strong");


stats.forEach((stat) => {
    const target = stat.dataset.number;
    if (target === "∞") {
        ScrollTrigger.create({
            trigger: stat,
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(stat, {
                    textContent: "∞",
                    duration: .5
                });
            }
        })
        return;
    }


    const number = {
        value: 0
    };


    gsap.to(number, {

        value: Number(target),

        duration: 1.8,

        ease: "power2.out",

        scrollTrigger: {

            trigger: stat,

            start: "top 85%",

            once: true

        },

        onUpdate: () => {

            stat.textContent =
                String(Math.floor(number.value))
                .padStart(2, "0");

        }

    });

});


const magneticButton =  document.querySelector(".magnetic-btn");

if (magneticButton && window.innerWidth > 768) {

    magneticButton.addEventListener("mousemove", (event) => {

        const rect =
            magneticButton.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left -
            rect.width / 2;


        const y =
            event.clientY -
            rect.top -
            rect.height / 2;


        gsap.to(magneticButton, {

            x: x * .25,

            y: y * .25,

            duration: .4,

            ease: "power3.out"

        });

    });


    magneticButton.addEventListener("mouseleave", () => {

        gsap.to(magneticButton, {

            x: 0,

            y: 0,

            duration: .7,

            ease: "elastic.out(1, .4)"

        });

    });

}

const aboutHero =
    document.querySelector(".about-hero");


if (aboutHero) {

    gsap.to(".hero-content", {

        yPercent: 30,

        opacity: .4,

        ease: "none",

        scrollTrigger: {

            trigger: aboutHero,

            start: "top top",

            end: "bottom top",

            scrub: true

        }

    });

}




window.addEventListener("load", () => {

    setTimeout(() => {

        ScrollTrigger.refresh();

    }, 500);

});