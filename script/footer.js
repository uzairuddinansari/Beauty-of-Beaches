gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const footerMM2 = gsap.matchMedia();

footerMM2.add("(min-width: 768px)", () => {
    gsap.to(".footer-image-wrap", {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".premium-footer",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.to(".footer-image", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
            trigger: ".footer-image-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5
        }
    });

    gsap.from(".footer-left > *", {
        x: -50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".footer-main",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".footer-right > *", {
        x: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".footer-main",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".footer-title-line span", {
        yPercent: 110,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".footer-title",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".footer-bottom", {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".footer-bottom",
            start: "top 95%",
            toggleActions: "play none none reverse"
        }
    });

    const backTop = document.querySelector(".footer-bottom a");

    if (backTop) {
        const backTopX = gsap.quickTo(backTop, "x", {
            duration: 0.2,
            ease: "power2.out"
        });

        const backTopY = gsap.quickTo(backTop, "y", {
            duration: 0.2,
            ease: "power2.out"
        });

        backTop.addEventListener("mousemove", (e) => {
            const rect = backTop.getBoundingClientRect();

            backTopX(
                (e.clientX - rect.left - rect.width / 2) * 0.3
            );

            backTopY(
                (e.clientY - rect.top - rect.height / 2) * 0.3
            );
        });

        backTop.addEventListener("mouseleave", () => {
            gsap.to(backTop, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        backTop.addEventListener("click", (e) => {
            e.preventDefault();

            gsap.to(window, {
                duration: 1.2,
                scrollTo: 0,
                ease: "power3.inOut"
            });
        });
    }
});

footerMM2.add("(max-width: 767px)", () => {
    gsap.from(".footer-left > *", {
        y: 35,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".footer-left",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.to(".footer-image", {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
            trigger: ".footer-image-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5
        }
    });

    gsap.from(".footer-image-wrap", {
        clipPath: "inset(100% 0 0 0)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".footer-image-wrap",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".footer-right > *", {
        y: 35,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".footer-right",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".footer-title-line span", {
        yPercent: 100,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".footer-title",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
});