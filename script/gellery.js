gsap.registerPlugin(ScrollTrigger);

if (window.matchMedia("(min-width: 901px)").matches) {


    const gallery1 = gsap.timeline({
        scrollTrigger: {
            trigger: ".gellery",
            start: "top 60%",
            end: "top 30%",
            scrub: 2,
            invalidateOnRefresh: true
            // markers: true
        }
    });

    gallery1
        .to(".img_overlay", {
            xPercent: 100,
            duration: 1,
            ease: "none"
        }, 0)

        .to(".gelery1_img_text h1", {
            yPercent: -50,
            opacity: 1,
            duration: 1,
            ease: "none"
        }, 0);


   

    const gallery2 = gsap.timeline({
        scrollTrigger: {
            trigger: ".gellery2_img",
            start: "top 50%",
            end: "top 10%",
            scrub: 2,
            invalidateOnRefresh: true
            // markers: true
        }
    });

    gallery2
        .to(".img_overlay2", {
            yPercent: 100,
            duration: 1,
            ease: "none"
        }, 0)

        .to(".gelery2_img_text h1", {
            yPercent: -50,
            opacity: 1,
            duration: 1,
            ease: "none"
        }, 0)

        .to(".gellery2_img", {
            yPercent: -25,
            duration: 6,
            ease: "none"
        }, 0);



    const gallery3 = gsap.timeline({
        scrollTrigger: {
            trigger: ".gellery3_img",
            start: "top 60%",
            end: "top 30%",
            scrub: 4,
            invalidateOnRefresh: true
            // markers: true
        }
    });

    gallery3
        .to(".img_overlay3", {
            xPercent: 100,
            duration: 5,
            ease: "none"
        }, 0)

        .to(".gelery3_img_text h1", {
            yPercent: -50,
            opacity: 1,
            duration: 1,
            ease: "none"
        }, 0)

        .to(".gellery3_img", {
            yPercent: -25,
            duration: 6,
            ease: "none"
        }, 0);


    const gallery4 = gsap.timeline({
        scrollTrigger: {
            trigger: ".gellery4_img",
            start: "top 50%",
            end: "top 10%",
            scrub: 4,
            invalidateOnRefresh: true
            // markers: true
        }
    });

    gallery4
        .to(".img_overlay4", {
            yPercent: 100,
            duration: 1,
            ease: "none"
        }, 0)

        .to(".gelery4_img_text h1", {
            yPercent: -50,
            opacity: 1,
            duration: 1,
            ease: "none"
        }, 0)

        .to(".gellery4_img", {
            yPercent: -25,
            duration: 6,
            ease: "none"
        }, 0);

}