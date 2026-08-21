gsap.registerPlugin(ScrollTrigger);

const queryCategories = [
    {
        id: "beach",
        title: "BEACH INFO",
        description: "Questions about beaches, locations and destinations.",
        icon: "ri-sailboat-line"
    },
    {
        id: "travel",
        title: "TRAVEL",
        description: "Transport, distance and travel related questions.",
        icon: "ri-flight-takeoff-line"
    },
    {
        id: "booking",
        title: "BOOKING",
        description: "Questions about your travel or booking process.",
        icon: "ri-calendar-check-line"
    },
    {
        id: "location",
        title: "LOCATION",
        description: "Need help finding a beach or understanding directions?",
        icon: "ri-map-pin-line"
    },
    {
        id: "website",
        title: "WEBSITE",
        description: "Something about Beauty Of Beaches itself?",
        icon: "ri-global-line"
    },
    {
        id: "general",
        title: "GENERAL",
        description: "Anything else you would like to ask us.",
        icon: "ri-question-mark"
    }
];

const beachData = {
    NORTH: [
        "Bondi Beach",
        "Maya Bay",
        "Waikiki Beach"
    ],
    SOUTH: [
        "Camps Bay",
        "Whitehaven Beach",
        "Bells Beach"
    ],
    EAST: [
        "Copacabana Beach",
        "Pink Beach",
        "Railay Beach"
    ],
    WEST: [
        "Santa Monica Beach",
        "Boulders Beach",
        "Cable Beach"
    ]
};

const faqData = [
    {
        question: "How do I find a beach?",
        answer: "Use the beach sections and zone navigation to explore destinations. Beaches are organised according to their geographical zones."
    },
    {
        question: "How are the beaches organised?",
        answer: "Beauty Of Beaches divides destinations into four major zones — North, South, East and West — making exploration easier."
    },
    {
        question: "Can I ask about transport?",
        answer: "Yes. Select Travel as your query category and mention the beach you are interested in. You can also use the travel and checkout sections of the website."
    },
    {
        question: "Can I ask about a specific beach?",
        answer: "Absolutely. Select Beach Information or Location and then choose the relevant zone and beach from the form."
    },
    {
        question: "What happens after I submit a query?",
        answer: "Your message is validated and a unique query reference is generated so the enquiry can be identified easily."
    }
];

const categoryGrid = document.querySelector("#categoryGrid");
const queryType = document.querySelector("#queryType");
const zoneSelect = document.querySelector("#queryZone");
const beachSelect = document.querySelector("#queryBeach");
const message = document.querySelector("#queryMessage");
const characterCount = document.querySelector("#characterCount");
const form = document.querySelector("#queryForm");
const nameInput = document.querySelector("#queryName");
const emailInput = document.querySelector("#queryEmail");
const subjectInput = document.querySelector("#querySubject");
const errorMessages = document.querySelectorAll(".error-message");
const submitButton = document.querySelector("#submitButton");
const successSection = document.querySelector("#successSection");
const formSection = document.querySelector("#queryFormSection");
const queryReference = document.querySelector("#queryReference");
const movingImage = document.querySelector(".moving-image");
const movingImageImg = movingImage?.querySelector("img");
const faqList = document.querySelector("#faqList");

queryCategories.forEach((category, index) => {
    const card = document.createElement("article");

    card.className = "category-card";

    card.innerHTML = `
        <span class="category-number">0${index + 1}</span>
        <i class="${category.icon} category-icon"></i>
        <h3>${category.title}</h3>
        <p>${category.description}</p>
    `;

    card.addEventListener("click", () => {
        queryType.value = category.id;

        formSection.scrollIntoView({
            behavior: "smooth"
        });
    });

    categoryGrid.appendChild(card);

    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.title;
    queryType.appendChild(option);
});

Object.keys(beachData).forEach(zone => {
    const option = document.createElement("option");

    option.value = zone;
    option.textContent = zone;

    zoneSelect.appendChild(option);
});

zoneSelect.addEventListener("change", () => {
    const selectedZone = zoneSelect.value;

    beachSelect.innerHTML = `
        <option value="">Select a beach</option>
    `;

    if (!selectedZone) {
        beachSelect.disabled = true;
        return;
    }

    beachData[selectedZone].forEach(beach => {
        const option = document.createElement("option");

        option.value = beach;
        option.textContent = beach;

        beachSelect.appendChild(option);
    });

    beachSelect.disabled = false;
});

message.addEventListener("input", () => {
    characterCount.textContent = `${message.value.length} / 500`;
});

gsap.from(".category-card", {
    y: 100,
    opacity: 0,
    rotateX: 20,
    stagger: 0.08,
    duration: 1,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".category-grid",
        start: "top 80%"
    }
});

gsap.to(".marquee-track", {
    xPercent: -25,
    duration: 15,
    ease: "none",
    repeat: -1
});

gsap.to(".hero-title", {
    xPercent: -12,
    opacity: 0.15,
    ease: "none",
    scrollTrigger: {
        trigger: ".query-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

gsap.to(".hero-description", {
    y: 100,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: ".query-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

if (window.innerWidth > 768 && movingImage && movingImageImg) {
    const moveX = gsap.quickTo(movingImageImg, "x", {
        duration: 0.7,
        ease: "power3.out"
    });

    const moveY = gsap.quickTo(movingImageImg, "y", {
        duration: 0.7,
        ease: "power3.out"
    });

    movingImage.addEventListener("mousemove", event => {
        const rect = movingImage.getBoundingClientRect();

        moveX(((event.clientX - rect.left) / rect.width - 0.5) * 25);
        moveY(((event.clientY - rect.top) / rect.height - 0.5) * 25);
    });

    movingImage.addEventListener("mouseleave", () => {
        moveX(0);
        moveY(0);
    });
}

if (window.innerWidth > 900) {
    document.querySelectorAll(".category-card").forEach(card => {
        const rotateX = gsap.quickTo(card, "rotateX", {
            duration: 0.4,
            ease: "power2.out"
        });

        const rotateY = gsap.quickTo(card, "rotateY", {
            duration: 0.4,
            ease: "power2.out"
        });

        card.addEventListener("mousemove", event => {
            const rect = card.getBoundingClientRect();

            rotateY(((event.clientX - rect.left) / rect.width - 0.5) * 5);
            rotateX(((event.clientY - rect.top) / rect.height - 0.5) * -5);
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.7,
                ease: "power3.out"
            });
        });
    });
}

faqData.forEach((item, index) => {
    const faq = document.createElement("div");

    faq.className = "faq-item";

    faq.innerHTML = `
        <button class="faq-question">
            <span>
                <small class="faq-number">0${index + 1}</small>
                ${item.question}
            </span>
            <i class="ri-add-line faq-icon"></i>
        </button>
        <div class="faq-answer">
            <p>${item.answer}</p>
        </div>
    `;

    faqList.appendChild(faq);
});

document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
        const current = button.parentElement;

        document.querySelectorAll(".faq-item.active").forEach(item => {
            if (item !== current) {
                gsap.to(item.querySelector(".faq-answer"), {
                    height: 0,
                    duration: 0.5,
                    ease: "power3.inOut"
                });

                item.classList.remove("active");
            }
        });

        const answer = current.querySelector(".faq-answer");

        if (current.classList.contains("active")) {
            gsap.to(answer, {
                height: 0,
                duration: 0.5,
                ease: "power3.inOut"
            });

            current.classList.remove("active");
        } else {
            current.classList.add("active");

            gsap.to(answer, {
                height: answer.scrollHeight,
                duration: 0.7,
                ease: "power4.out"
            });
        }
    });
});

function showError(input, messageText) {
    const field = input.closest(".field");
    const error = field?.querySelector(".error-message");

    if (error) {
        error.textContent = messageText;
    }

    gsap.fromTo(
        input,
        { x: -8 },
        {
            x: 8,
            duration: 0.08,
            repeat: 5,
            yoyo: true,
            clearProps: "x"
        }
    );
}

function clearErrors() {
    errorMessages.forEach(error => {
        error.textContent = "";
    });
}

function validateForm() {
    clearErrors();

    let valid = true;

    if (nameInput.value.trim().length < 2) {
        showError(nameInput, "Please enter your name.");
        valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value.trim())) {
        showError(emailInput, "Please enter a valid email.");
        valid = false;
    }

    if (!queryType.value) {
        showError(queryType, "Please select a query type.");
        valid = false;
    }

    if (!subjectInput.value.trim()) {
        showError(subjectInput, "Please enter a subject.");
        valid = false;
    }

    if (message.value.trim().length < 10) {
        showError(message, "Please write at least 10 characters.");
        valid = false;
    }

    return valid;
}

function generateQueryID() {
    const now = new Date();
    const random = Math.floor(1000 + Math.random() * 9000);

    return `BOB-${now.getFullYear()}-${random}`;
}

form.addEventListener("submit", event => {
    event.preventDefault();

    if (!validateForm()) return;

    const buttonText = submitButton.querySelector("span");

    buttonText.textContent = "SENDING...";

    gsap.to(submitButton, {
        rotate: 360,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
            const reference = generateQueryID();

            queryReference.textContent = reference;
            buttonText.textContent = "SENT";

            const tl = gsap.timeline();

            tl.to(formSection, {
                opacity: 0,
                y: -100,
                duration: 0.6,
                ease: "power3.in"
            })
            .set(formSection, {
                display: "none"
            })
            .set(successSection, {
                display: "flex"
            })
            .fromTo(
                successSection,
                {
                    clipPath: "inset(100% 0 0 0)"
                },
                {
                    clipPath: "inset(0% 0 0 0)",
                    duration: 1,
                    ease: "power4.inOut"
                }
            )
            .from(
                ".success-inner > *",
                {
                    y: 60,
                    opacity: 0,
                    stagger: 0.08,
                    duration: 0.8,
                    ease: "power4.out"
                },
                "-=.5"
            );

            const queryObject = {
                reference,
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                type: queryType.value,
                zone: zoneSelect.value,
                beach: beachSelect.value,
                subject: subjectInput.value.trim(),
                message: message.value.trim(),
                createdAt: new Date().toISOString()
            };

            localStorage.setItem(
                "lastBeachQuery",
                JSON.stringify(queryObject)
            );
        }
    });
});

document.querySelector("#newQuery").addEventListener("click", () => {
    form.reset();

    beachSelect.disabled = true;

    beachSelect.innerHTML = `
        <option value="">Select a beach</option>
    `;

    characterCount.textContent = "0 / 500";

    gsap.to(successSection, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
            successSection.style.display = "none";
            formSection.style.display = "grid";

            gsap.fromTo(
                formSection,
                {
                    opacity: 0,
                    y: 100
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power4.out"
                }
            );
        }
    });
});

const cursor2 = document.querySelector(".cursor2");

if (window.innerWidth > 900 && cursor2) {
    const cursorX = gsap.quickTo(cursor2, "x", {
        duration: 0.35,
        ease: "power3.out"
    });

    const cursorY = gsap.quickTo(cursor2, "y", {
        duration: 0.35,
        ease: "power3.out"
    });

    window.addEventListener("mousemove", event => {
        cursorX(event.clientX);
        cursorY(event.clientY);
    });

    document
        .querySelectorAll(
            "button, .category-card, .moving-image, .faq-question"
        )
        .forEach(element => {
            element.addEventListener("mouseenter", () => {
                gsap.to(cursor2, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power3.out"
                });
            });

            element.addEventListener("mouseleave", () => {
                gsap.to(cursor2, {
                    scale: 0,
                    duration: 0.3,
                    ease: "power3.out"
                });
            });
        });
}

const finalCircle = document.querySelector(".final-circle");

gsap.to(finalCircle, {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: "none"
});

gsap.to(finalCircle, {
    y: -30,
    scrollTrigger: {
        trigger: ".final-query",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

gsap.from(".moving-image", {
    clipPath: "inset(100% 0 0 0)",
    duration: 1.4,
    ease: "power4.inOut",
    scrollTrigger: {
        trigger: ".moving-image",
        start: "top 80%"
    }
});

gsap.from(".faq-item", {
    x: 100,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".faq-list",
        start: "top 80%"
    }
});

window.addEventListener("load", () => {
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 700);
});