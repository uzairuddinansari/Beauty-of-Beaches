gsap.registerPlugin(ScrollTrigger);

if (window.matchMedia("(min-width: 901px)").matches) {

    let td = gsap.timeline({

        scrollTrigger: {

            trigger: ".our_story",

            start: "top 60%",

            end: "bottom 55%",

            scrub: 4,

        }

    });

    td.to(".story_sec:nth-child(1)", {

        yPercent: -100,

        ease: "none",

        duration: 1

    }, 0)

    .to(".story_sec:nth-child(3)", {

        yPercent: -15,

        ease: "none",

        duration: 1

    }, 0);

}