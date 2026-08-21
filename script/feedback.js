
gsap.registerPlugin(ScrollTrigger);



function getLenis() {
    try {
        if (window.lenis) return window.lenis;
    } catch (e) {}

    try {
        if (typeof lenis !== "undefined") return lenis;
    } catch (e) {}

    return null;
}




const titleElement = document.querySelector(".split-title");

if (titleElement) {

    gsap.from(titleElement, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 2,
        ease: "power3.out"
    });

}




if (document.querySelector(".hero-small span")) {

    gsap.from(".hero-small span", {

        opacity: 0,
        y: 20,

        duration: 1,

        stagger: 0.15,

        delay: 2.1,

        ease: "power3.out"

    });

}



if (document.querySelector(".hero-bottom")) {

    gsap.from(".hero-bottom", {

        opacity: 0,
        y: 40,

        duration: 1,

        delay: 2.3,

        ease: "power3.out"

    });

}




const marquee = document.querySelector(".marquee");

if (marquee) {

    gsap.to(marquee, {

        xPercent: -35,

        duration: 18,

        repeat: -1,

        ease: "none"

    });

}


gsap.utils.toArray(".reveal-text").forEach((element) => {

    gsap.from(element, {

        scrollTrigger: {

            trigger: element,

            start: "top 80%",

            toggleActions:
                "play none none reverse"

        },

        y: 60,

        opacity: 0,

        duration: 0.9,

        ease: "power3.out"

    });

});



gsap.utils.toArray(".field").forEach((field, index) => {

    gsap.from(field, {

        scrollTrigger: {

            trigger: field,

            start: "top 85%"

        },

        y: 60,

        opacity: 0,

        duration: 1,

        delay: index * 0.03,

        ease: "power3.out"

    });

});


const magneticButton =
    document.querySelector(".magnetic");

if (magneticButton) {

    const magneticX =
        gsap.quickTo(
            magneticButton,
            "x",
            {
                duration: 0.35,
                ease: "power3.out"
            }
        );


    const magneticY =
        gsap.quickTo(
            magneticButton,
            "y",
            {
                duration: 0.35,
                ease: "power3.out"
            }
        );


    magneticButton.addEventListener(
        "mousemove",
        (e) => {

            const rect =
                magneticButton.getBoundingClientRect();


            const x =
                e.clientX -
                rect.left -
                rect.width / 2;


            const y =
                e.clientY -
                rect.top -
                rect.height / 2;


            magneticX(x * 0.25);

            magneticY(y * 0.25);

        }
    );


    magneticButton.addEventListener(
        "mouseleave",
        () => {

            gsap.to(magneticButton, {

                x: 0,

                y: 0,

                duration: 0.7,

                ease:
                    "elastic.out(1, .4)"

            });

        }
    );

}



const ratingButtons =
    document.querySelectorAll(".rating button");

const ratingText =
    document.querySelector("#ratingText");

const ratingValue =
    document.querySelector("#ratingValue");


let selectedRating = 0;


const ratingWords = {

    1: "NOT GREAT",

    2: "COULD BE BETTER",

    3: "GOOD",

    4: "VERY GOOD",

    5: "EXCELLENT"

};


ratingButtons.forEach((button) => {

    button.addEventListener("click", () => {

        selectedRating =
            Number(button.dataset.rating);


        ratingButtons.forEach((item) => {

            item.classList.toggle(

                "active",

                Number(item.dataset.rating) <=
                selectedRating

            );

        });


        if (ratingText) {

            ratingText.textContent =
                ratingWords[selectedRating];

        }


        if (ratingValue) {

            ratingValue.textContent =
                `${selectedRating} / 05`;

        }


        gsap.fromTo(

            button,

            {
                scale: 0.8
            },

            {
                scale: 1,

                duration: 0.5,

                ease: "back.out(2)"

            }

        );

    });

});




const message =
    document.querySelector("#message");

const charCount =
    document.querySelector("#charCount");


if (message && charCount) {

    message.addEventListener("input", () => {

        charCount.textContent =
            message.value.length;

    });

}




document
    .querySelectorAll("input, textarea, select")
    .forEach((input) => {


        input.addEventListener("focus", () => {

            const field =
                input.closest(".field");


            if (!field) return;


            gsap.to(field, {

                borderColor: "#111",

                duration: 0.3

            });

        });


        input.addEventListener("blur", () => {

            const field =
                input.closest(".field");


            if (!field) return;


            gsap.to(field, {

                borderColor: "#393939",

                duration: 0.3

            });

        });

    });


const form =
    document.querySelector("#feedbackForm");


const success =
    document.querySelector(".success");


const closeSuccess =
    document.querySelector("#closeSuccess");


const submitButton =
    document.querySelector(".submit-btn");


if (
    form &&
    success &&
    closeSuccess &&
    submitButton
) {


    let isSubmitting = false;

    let isPopupOpen = false;



    gsap.set(success, {

        visibility: "hidden",

        pointerEvents: "none",

        clipPath:
            "inset(100% 0% 0% 0%)"

    });


    gsap.set(".success-inner > *", {
      y: 70,
    opacity: 0

    });


    gsap.set(submitButton, {

        scale: 1,

        x: 0,

        y: 0

    });



    function restorePageScroll() {

        /*
            Important for mobile browsers.
            Popup close ke baad browser / Lenis ko
            dobara normal scrolling state mein laate hain.
        */

        document.body.style.overflow = "";

        document.body.style.position = "";

        document.body.style.height = "";

        document.documentElement.style.overflow = "";

        document.documentElement.style.height = "";


        const currentLenis = getLenis();


        if (currentLenis) {

            try {

                currentLenis.start();

            } catch (error) {

                console.warn(
                    "Lenis start failed:",
                    error
                );

            }


            try {

                currentLenis.resize();

            } catch (error) {}

        }


        /*
            Browser ko ek frame dete hain
            taake layout properly recalculate ho.
        */

        requestAnimationFrame(() => {

            ScrollTrigger.refresh();

        });


        setTimeout(() => {

            ScrollTrigger.refresh();

        }, 100);

    }



    function openSuccessPopup() {

        isPopupOpen = true;


        /*
            Popup ke peeche accidental clicks / touch
            completely block.
        */

        gsap.set(success, {

            visibility: "visible",

            pointerEvents: "auto"

        });


        /*
            Agar Lenis running hai to popup ke waqt
            background scrolling stop.
        */

        const currentLenis = getLenis();


        if (currentLenis) {

            try {

                currentLenis.stop();

            } catch (error) {}

        }


        gsap.killTweensOf(success);

        gsap.killTweensOf(
            ".success-inner > *"
        );


        gsap.set(
            ".success-inner > *",
            {
                y: 70,
                opacity: 0
            }
        );


        const popupTimeline =
            gsap.timeline();


        popupTimeline

            .to(success, {

                clipPath:
                    "inset(0% 0% 0% 0%)",

                duration: 1.1,

                ease: "power4.inOut"

            })

            .to(

                ".success-inner > *",

                {

                    y: 0,

                    opacity: 1,

                    duration: 0.8,

                    stagger: 0.08,

                    ease: "power4.out"

                },

                "-=0.5"

            );

    }


    form.addEventListener("submit", (e) => {

        e.preventDefault();


        /* -----------------------------------------------
           RATING REQUIRED
        ------------------------------------------------ */

        if (selectedRating === 0) {

            gsap.fromTo(

                ".rating",

                {
                    x: -8
                },

                {
                    x: 8,

                    duration: 0.08,

                    repeat: 5,

                    yoyo: true,

                    ease: "power1.inOut"

                }

            );

            return;

        }


        /* -----------------------------------------------
           PREVENT DOUBLE SUBMIT
        ------------------------------------------------ */

        if (
            isSubmitting ||
            isPopupOpen
        ) {

            return;

        }


        isSubmitting = true;


        /* -----------------------------------------------
           STOP OLD ANIMATIONS
        ------------------------------------------------ */

        gsap.killTweensOf(
            submitButton
        );

        gsap.killTweensOf(
            success
        );

        gsap.killTweensOf(
            ".success-inner > *"
        );


        /* -----------------------------------------------
           RESET SUBMIT BUTTON
        ------------------------------------------------ */

        gsap.set(submitButton, {

            scale: 1,

            x: 0,

            y: 0

        });


        /* -----------------------------------------------
           RESET POPUP
        ------------------------------------------------ */

        gsap.set(success, {

            visibility: "hidden",

            pointerEvents: "none",

            clipPath:
                "inset(100% 0% 0% 0%)"

        });


        gsap.set(
            ".success-inner > *",
            {

                y: 70,

                opacity: 0

            }
        );


        /* -----------------------------------------------
           SUBMIT ANIMATION
        ------------------------------------------------ */

        const submitTl =
            gsap.timeline({

                onComplete: () => {

                    isSubmitting = false;

                    openSuccessPopup();

                }

            });


        submitTl

            /*
                Small press
            */

            .to(submitButton, {

                scale: 0.8,

                duration: 0.25,

                ease: "power2.in"

            })


            /*
                Large expansion
            */

            .to(submitButton, {

                scale: 20,

                duration: 0.9,

                ease: "power4.in"

            })


            /*
                Reset form data
            */

            .call(() => {

                form.reset();


                selectedRating = 0;


                ratingButtons.forEach(
                    (button) => {

                        button.classList
                            .remove("active");

                    }
                );


                if (ratingText) {

                    ratingText.textContent =
                        "SELECT A RATING";

                }


                if (ratingValue) {

                    ratingValue.textContent =
                        "— / 05";

                }


                if (charCount) {

                    charCount.textContent =
                        "0";

                }

            });

    });


    closeSuccess.addEventListener(
        "click",
        () => {


            if (
                isSubmitting ||
                !isPopupOpen
            ) {

                return;

            }


            isSubmitting = true;


            /*
                Kill existing animations.
            */

            gsap.killTweensOf(success);

            gsap.killTweensOf(
                ".success-inner > *"
            );

            gsap.killTweensOf(
                submitButton
            );


            /*
                Close timeline.
            */

            const closeTl =
                gsap.timeline({

                    onComplete: () => {


                        /* ---------------------------------
                           COMPLETELY HIDE POPUP
                        --------------------------------- */

                        gsap.set(success, {

                            visibility: "hidden",

                            pointerEvents: "none",

                            clipPath:
                                "inset(100% 0% 0% 0%)"

                        });


                        /* ---------------------------------
                           RESET POPUP CONTENT
                        --------------------------------- */

                        gsap.set(
                            ".success-inner > *",
                            {

                                y: 0,

                                opacity: 1

                            }
                        );


                        /* ---------------------------------
                           RESET SUBMIT BUTTON
                        --------------------------------- */

                        gsap.set(
                            submitButton,
                            {

                                scale: 1,

                                x: 0,

                                y: 0

                            }
                        );


                        /*
                            IMPORTANT:

                            Mobile par close ke baad
                            Lenis + native scrolling ko
                            completely restore.
                        */

                        restorePageScroll();


                        /*
                            State reset.
                        */

                        isSubmitting = false;

                        isPopupOpen = false;

                    }

                });


            closeTl

                /* -----------------------------------------
                   CONTENT OUT
                ----------------------------------------- */

                .to(

                    ".success-inner > *",

                    {

                        y: -40,

                        opacity: 0,

                        duration: 0.4,

                        stagger: 0.04,

                        ease: "power2.in"

                    }

                )


                /* -----------------------------------------
                   POPUP OUT
                ----------------------------------------- */

                .to(success, {

                    clipPath:
                        "inset(100% 0% 0% 0%)",

                    duration: 0.9,

                    ease: "power4.inOut"

                });

        }

    );

}




window.addEventListener("load", () => {

    /*
        Wait for images/fonts/layout
        before refreshing ScrollTrigger.
    */

    requestAnimationFrame(() => {

        ScrollTrigger.refresh();

    });


    setTimeout(() => {

        ScrollTrigger.refresh();

    }, 300);

});




let resizeTimer;


window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);


    resizeTimer = setTimeout(() => {

        ScrollTrigger.refresh();


        const currentLenis =
            getLenis();


        if (currentLenis) {

            try {

                currentLenis.resize();

            } catch (error) {}

        }

    }, 250);

});



window.addEventListener(
    "orientationchange",
    () => {

        setTimeout(() => {

            ScrollTrigger.refresh();


            const currentLenis =
                getLenis();


            if (currentLenis) {

                try {

                    currentLenis.resize();

                } catch (error) {}

            }

        }, 400);

    }
);