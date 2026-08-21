gsap.registerPlugin(ScrollTrigger);

mm.add("(min-width: 768px)", () => {

    const split = new SplitType(".DISCOVER", {
        types: "chars"
    });

    gsap.from(split.chars, {
        y: 80,
        opacity: 0,
        rotateX: 45,
        transformPerspective: 1000,
        stagger: 0.035,
        ease: "power2.out",

        scrollTrigger: {
            trigger: ".page2",
            start: "top 75%",
            end: "top 35%",
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    // Zone image
    gsap.fromTo(".zone_img",
        {
            xPercent: -100
        },
        {
            xPercent: 0,
            duration: 1.2,
            ease: "power2.out",

            scrollTrigger: {
                trigger: ".Zone",
                start: "top 80%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true
            }
        }
    );

});