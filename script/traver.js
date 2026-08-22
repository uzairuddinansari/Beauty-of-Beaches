const travelCards = document.querySelectorAll(".travel_card");

if (travelCards.length) {

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

}

travelCards.forEach(card => {

    const button = card.querySelector(".travel_btn");

    if (!button) return;

    const cardY = gsap.quickTo(
        card,
        "y",
        {
            duration: 0.35,
            ease: "power2.out"
        }
    );

    const buttonX = gsap.quickTo(
        button,
        "x",
        {
            duration: 0.2,
            ease: "power2.out"
        }
    );

    const buttonY = gsap.quickTo(
        button,
        "y",
        {
            duration: 0.2,
            ease: "power2.out"
        }
    );

    card.addEventListener("mouseenter", () => {
        cardY(-8);
    });

    card.addEventListener("mouseleave", () => {

        cardY(0);

        gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
        });

    });

    button.addEventListener("mousemove", (e) => {

        const rect =
            button.getBoundingClientRect();

        const x =
            (e.clientX - rect.left - rect.width / 2) * 0.12;

        const y =
            (e.clientY - rect.top - rect.height / 2) * 0.12;

        buttonX(x);
        buttonY(y);

    });

    button.addEventListener("mouseleave", () => {

        gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
        });

    });

    button.addEventListener("click", function (e) {

        e.preventDefault();

        const transport = {
            name: card.dataset.name,
            pricePerHour: Number(card.dataset.price)
        };

        sessionStorage.setItem(
            "travelData",
            JSON.stringify(transport)
        );

        const checkoutURL =
            new URL(
                "./checkout.html",
                window.location.href
            );

        checkoutURL.searchParams.set(
            "transport",
            transport.name
        );

        checkoutURL.searchParams.set(
            "price",
            transport.pricePerHour
        );

        window.location.href =
            checkoutURL.href;

    });

});
