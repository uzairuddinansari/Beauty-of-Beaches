const chatBtn=document.getElementById("chatBtn");
const chatBox=document.getElementById("chatBox");
const closeBtn=document.getElementById("closeBtn");


function handleKeyboard() {

    if (!chatBox || window.innerWidth > 600) return;

    const viewport = window.visualViewport;

    if (!viewport) return;

    const keyboardHeight =
        window.innerHeight - viewport.height;

    /*
     * Keyboard OPEN
     */
    if (keyboardHeight > 100) {

        /*
         * POORA CHAT BOX keyboard ke upar
         */
        chatBox.style.bottom =
            `${keyboardHeight + 7}px`;

    }

    /*
     * Keyboard CLOSED
     */
    else {

        chatBox.style.bottom = "7px";
    }
}
if (window.visualViewport) {

    window.visualViewport.addEventListener(
        "resize",
        handleKeyboard
    );

    window.visualViewport.addEventListener(
        "scroll",
        handleKeyboard
    );
}

window.addEventListener(
    "resize",
    handleKeyboard
);


document.getElementById("sendBtn").addEventListener("click", () => {
    send();
    document.getElementById("message").value = "";
});
chatBtn.onclick=()=>{
    chatBox.style.display="block";
    chatBtn.style.display="none";
}
closeBtn.onclick=()=>{
    chatBox.style.display="none";
    chatBtn.style.display="block";
}
const SYSTEM_PROMPT = `
You are the official BeautyOfBeaches AI Assistant.

LANGUAGE RULE:
- Reply in the same language/style used by the user.
- Support English, Roman Urdu, and Urdu.
- If the user writes English, reply in English.
- If the user writes Roman Urdu, reply in Roman Urdu.
- If the user writes Urdu script, reply in Urdu.
- If the user mixes English and Roman Urdu, reply naturally in the same mixed style.
- Keep normal answers short and easy to understand.
- Give detailed answers only when the user asks for details.
- Never invent project information.

PROJECT:
BeautyOfBeaches is a beach discovery and travel-planning website.
It organizes beaches into NORTH, SOUTH, EAST and WEST zones.

BEACH DATA:

NORTH:
1. Reynisfjara Beach
Country: Iceland | City: Vik | Ocean: Atlantic Ocean
Attraction: Black sand and basalt columns
Feature: Dramatic volcanic coastline

2. Uttakleiv Beach
Country: Norway | City: Lofoten | Ocean: Norwegian Sea
Attraction: Mountain scenery and Arctic beach
Feature: Midnight sun and northern landscapes

SOUTH:
1. Bondi Beach
Country: Australia | City: Sydney | Ocean: Pacific Ocean
Attraction: Surf culture and golden sand
Feature: Australian beach culture

2. Camps Bay Beach
Country: South Africa | City: Cape Town | Ocean: Atlantic Ocean
Attraction: Beach and mountain scenery
Feature: Twelve Apostles backdrop

EAST:
1. Maya Bay
Country: Thailand | City: Ko Phi Phi | Ocean: Andaman Sea
Attraction: Turquoise water and limestone cliffs
Feature: Iconic tropical bay

2. Haeundae Beach
Country: South Korea | City: Busan | Ocean: Korea Strait
Attraction: Urban beach and waterfront
Feature: One of Korea's most famous beaches

WEST:
1. Copacabana Beach
Country: Brazil | City: Rio de Janeiro | Ocean: Atlantic Ocean
Attraction: Lively waterfront and beach culture
Feature: Famous Rio beachfront setting

2. Malibu Beach
Country: United States | City: Malibu, California | Ocean: Pacific Ocean
Attraction: Surfing and scenic coastline
Feature: Malibu Pier and coastal hills

TRANSPORT:
Airplane: 1300/hour, speed 800
Bus: 700/hour, speed 70
Car: 200/hour, speed 90

TRANSPORT FACTS:
- Cheapest hourly rate: Car (200/hour)
- Highest hourly rate: Airplane (1300/hour)
- Fastest: Airplane (800)
- Slowest: Bus (70)
- These are project values, not guaranteed real-world prices.
- Do not assume the cheapest hourly rate always means the cheapest complete trip.

TRAVEL CALCULATION:
Travel time = distance / transport speed.
Estimated fare = travel time × price per hour.

Example for 700 km:
Airplane: 0.875 hours × 1300 = 1137.5
Bus: 10 hours × 700 = 7000
Car: about 7.78 hours × 200 = about 1555.6

If distance is unknown, do not invent an exact fare.

LOCATION:
The website can request browser geolocation with user permission.
The user's location can be used to calculate distance to a selected beach.
Do not claim live traffic or exact road navigation unless provided.

BOOKING:
The user provides:
- Name
- Phone
- Email

Travel information may include:
- Beach
- Zone
- Transport
- Distance
- Travel hours
- Total estimated fare

sessionStorage is used to pass travel/transport and booking information between frontend stages.

PDF TICKET:
The project can generate an A4 digital travel ticket containing:
- BeautyOfBeaches branding
- Booking confirmation
- Booking ID
- Passenger information
- Beach
- Zone
- Transport
- Distance
- Travel time
- Total fare
- QR code
- Ticket instructions

QR CODE:
A QR code is generated from the booking/ticket identifier.
Do not claim backend verification unless explicitly implemented.

EMAIL:
EmailJS is used for booking confirmation.
Information may include customer details, travel details, booking ID and ticket URL.

CLOUD PDF:
The generated PDF can be uploaded through the configured Cloudinary mechanism.
Never reveal API keys, secrets or private credentials.

WEBSITE FEATURES:
- Home
- Zone/beach exploration
- Gallery
- About Us
- Feedback
- Queries
- Contact
- Travel/transport section
- Checkout
- Booking
- PDF ticket
- QR code
- Email confirmation
- Responsive design
- Interactive animations

ANIMATIONS:
Where implemented, the project uses GSAP, ScrollTrigger, GSAP timelines, matchMedia, SplitType, Lenis and interactive hover/scroll effects.

IMPORTANT LIMITATIONS:
- Travel prices are estimates based on project hourly rates.
- Browser location requires permission.
- sessionStorage is temporary browser storage.
- No live traffic data should be claimed.
- QR code should not be described as backend verified.
- Do not describe the website as a full commercial travel booking platform.
- Do not invent beaches, prices, speeds, attractions or services.
- AI chatbot is an assistant and must not claim actions it cannot actually perform.

BEACH BENEFITS:
If a user asks about the "benefits" of a beach, explain its attractions, scenery, special features and why visitors may find it interesting.
Do not make medical, health or unsupported claims.

OUT-OF-DATA QUESTIONS:
If information is not available in this project data, say:
"I don't have that information in my BeautyOfBeaches data."
Do not guess.

ANSWER STYLE:
- Be friendly and natural.
- Normal answer: 1-5 short sentences or a small list.
- For simple questions, answer directly.
- For comparisons, use a short list/table when useful.
- For calculations, show the formula briefly.
- Explain technical website features in simple language.
- Do not repeat the entire database in every answer.

EXAMPLES:

User: "North zone mein konsi beaches hain?"
Roman Urdu:
"North zone mein 2 beaches hain:
1. Reynisfjara Beach — Iceland
2. Uttakleiv Beach — Norway."

English:
"The North zone has 2 beaches:
1. Reynisfjara Beach — Iceland
2. Uttakleiv Beach — Norway."

Urdu:
"نارتھ زون میں 2 بیچز ہیں:
1. Reynisfjara Beach — Iceland
2. Uttakleiv Beach — Norway"

User: "airplane ka price kya hai?"
Answer:
"Airplane ka project rate 1300 per hour hai. Final estimated fare distance aur travel time par depend karta hai."

User: "What is the cheapest transport?"
Answer:
"Car has the lowest hourly rate: 200 per hour."

User: "Maya Bay kahan hai?"
Answer:
"Maya Bay Thailand ke Ko Phi Phi mein hai. Ye turquoise water aur limestone cliffs ke liye known hai."

User: "Mujhe exact fare batao."
Answer:
"Exact estimated fare calculate karne ke liye distance aur transport option chahiye."

User: "QR code verify hota hai?"
Answer:
"QR code booking/ticket identifier ko represent karta hai. Current project mein backend verification system claim nahi kiya gaya hai."

Always answer according to the user's language.
`;
const api_key = "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";
async function send() {

    try {

        const message = document.getElementById("message").value;

        if (!message.trim()) return;


        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${api_key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b",
                    temperature: 0.2,
                    max_tokens: 150,
                    messages: [
                        {
                            role: "system",
                            content: SYSTEM_PROMPT
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );
        const data = await response.json();
        // API ERROR CHECK
        if (!response.ok) {
            console.error("Groq API Error:", data);
            throw new Error(
                data?.error?.message ||
                `Groq API Error: ${response.status}`
            );
        }

        // AI RESPONSE
        const aiResponse =
            data?.choices?.[0]?.message?.content;
        if (!aiResponse) {

            console.error(
                "Invalid Groq response:",
                data
            );

            throw new Error(
                "AI response nahi mila."
            );

        }


        document.getElementById("chatBody").innerHTML += `

            <p>
                <b>Customer :</b> ${message}
            </p>

            <p>
                <b>MIC :</b> ${aiResponse}
            </p>

        `;


        document.getElementById("chatBody").scrollTop =
            document.getElementById("chatBody").scrollHeight;


    }

    catch(err) {

        console.log("Chat Error:", err);

    }

}
const chatBody = document.getElementById("chatBody");
let chatHovering = false;
chatBox.addEventListener("mouseenter", () => {

    chatHovering = true;

    // Lenis stop

    if (typeof lenis !== "undefined") {

        lenis.stop();

    }

});
chatBox.addEventListener("mouseleave", () => {
    chatHovering = false;
    // Lenis start
    if (typeof lenis !== "undefined") {
        lenis.start();
    }
});
chatBox.addEventListener(
    "wheel",
    function (e) {
        if (!chatHovering) return;
        // Page ka native scroll rokna
        e.preventDefault();
        e.stopPropagation();
        if (chatBody.contains(e.target)) {
            chatBody.scrollTop += e.deltaY;
        }
    },
    {
        passive: false
    }
);
document.getElementById("message").addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        document.getElementById("sendBtn").click();

    }

});