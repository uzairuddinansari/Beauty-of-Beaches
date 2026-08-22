const travelCards = document.querySelectorAll(".travel_card");

gsap.fromTo(
    travelCards,
    {
        opacity: 0,
        y: 30
    },
    {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".travel_cards",
            start: "top 80%",
            once: true
        }
    }
);

travelCards.forEach(card => {
    const button = card.querySelector(".travel_btn");

    const cardY = gsap.quickTo(card, "y", {
        duration: 0.35,
        ease: "power2.out"
    });

    const buttonX = gsap.quickTo(button, "x", {
        duration: 0.2,
        ease: "power2.out"
    });

    const buttonY = gsap.quickTo(button, "y", {
        duration: 0.2,
        ease: "power2.out"
    });

    card.addEventListener("mouseenter", () => {
        cardY(-8);
    });

    card.addEventListener("mouseleave", () => {
        cardY(0);
    });

    button.addEventListener("mousemove", e => {
        const rect = button.getBoundingClientRect();

        buttonX(
            (e.clientX - rect.left - rect.width / 2) * 0.12
        );

        buttonY(
            (e.clientY - rect.top - rect.height / 2) * 0.12
        );
    });

    button.addEventListener("mouseleave", () => {
        gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    button.addEventListener("click", () => {
        const transport = {
            name: card.dataset.name,
            pricePerHour: Number(card.dataset.price)
        };

        sessionStorage.setItem(
            "selectedTransport",
            JSON.stringify(transport)
        );

        window.location.href = "../html/checkout.html";
    });
});