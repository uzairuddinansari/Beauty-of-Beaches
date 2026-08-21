const lenis = new Lenis({
  duration: 2,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


const cursor = document.querySelector(".custom-cursor");
if (cursor && window.matchMedia("(pointer: fine)").matches) {

    const cursorX = gsap.quickTo(cursor, "x", {
        duration: 0.35,
        ease: "power3.out"
    });

    const cursorY = gsap.quickTo(cursor, "y", {
        duration: 0.35,
        ease: "power3.out"
    });


    /* Mouse movement */

    window.addEventListener("mousemove", (e) => {

        cursorX(e.clientX);
        cursorY(e.clientY);

    });



    window.addEventListener("mousedown", () => {
        cursor.classList.add("is-click");
    });

    window.addEventListener("mouseup", () => {
        cursor.classList.remove("is-click");
    });



    const hoverElements = document.querySelectorAll(
        "a, button, input, textarea, select, [data-cursor]"
    );


    hoverElements.forEach((element) => {

        element.addEventListener("mouseenter", () => {

            cursor.classList.add("is-hover");

        });


        element.addEventListener("mouseleave", () => {

            cursor.classList.remove("is-hover");

        });

    });




    const images = document.querySelectorAll(
        "img, video, .image, .gallery-item"
    );


    images.forEach((image) => {
        image.addEventListener("mouseenter", () => {
            cursor.classList.add("is-image");
        });


        image.addEventListener("mouseleave", () => {

            cursor.classList.remove("is-image");

        });

    });


    document.addEventListener("mouseleave", () => {

        gsap.to(cursor, {
            opacity: 0,
            duration: 0.25
        });

    });


    document.addEventListener("mouseenter", () => {

        gsap.to(cursor, {
            opacity: 1,
            duration: 0.25
        });

    });

}