let mm = gsap.matchMedia();


document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector(".beach-hero");
    const video = document.querySelector("#heroVideo");
    const canvas = document.querySelector("#heroCanvas");

    if (!hero || !video || !canvas) return;



    const isMobile =
        window.matchMedia("(max-width: 700px)").matches;

    const hasFinePointer =
        window.matchMedia("(pointer: fine)").matches;



    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
        -1,
        1,
        1,
        -1,
        0,
        1
    );


    

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: false,
        antialias: false,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        isMobile
            ? 1
            : Math.min(window.devicePixelRatio, 1.35)
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;




    const videoTexture =
        new THREE.VideoTexture(video);

    videoTexture.colorSpace =
        THREE.SRGBColorSpace;

    videoTexture.minFilter =
        THREE.LinearFilter;

    videoTexture.magFilter =
        THREE.LinearFilter;

    videoTexture.generateMipmaps = false;




    const mouse = new THREE.Vector2(
        0,
        0
    );

    const targetMouse = new THREE.Vector2(
        0,
        0
    );


    const uniforms = {

        /* video */
        uVideo: {
            value: videoTexture
        },

        /* time */
        uTime: {
            value: 0
        },

        /* mouse */
        uMouse: {
            value: new THREE.Vector2(0, 0)
        },

        /* resolution */
        uResolution: {
            value: new THREE.Vector2(
                window.innerWidth,
                window.innerHeight
            )
        },

        /* displacement */
        uDisplacement: {
            value: 0.0
        },

        /* intensity */
        uIntensity: {
            value: isMobile
                ? 0.012
                : 0.022
        },

        /* opening animation */
        uReveal: {
            value: 0.0
        }

    };


    const material =
        new THREE.ShaderMaterial({

            uniforms: uniforms,

            vertexShader: `

                varying vec2 vUv;

                void main() {

                    vUv = uv;

                    gl_Position =
                        vec4(position, 1.0);

                }

            `,


            fragmentShader: `

                precision highp float;

                uniform sampler2D uVideo;

                uniform float uTime;

                uniform vec2 uMouse;

                uniform vec2 uResolution;

                uniform float uDisplacement;

                uniform float uIntensity;

                uniform float uReveal;

                varying vec2 vUv;


                /* =========================================
                   RANDOM / GRAIN
                ========================================= */

                float random(
                    vec2 st
                ) {

                    return fract(
                        sin(
                            dot(
                                st,
                                vec2(
                                    12.9898,
                                    78.233
                                )
                            )
                        ) *
                        43758.5453123
                    );

                }


                /* =========================================
                   COVER UV
                ========================================= */

                vec2 coverUV(
                    vec2 uv,
                    vec2 textureSize,
                    vec2 screenSize
                ) {

                    float textureRatio =
                        textureSize.x /
                        textureSize.y;

                    float screenRatio =
                        screenSize.x /
                        screenSize.y;

                    vec2 newUV =
                        uv;

                    if (
                        screenRatio <
                        textureRatio
                    ) {

                        float scale =
                            screenRatio /
                            textureRatio;

                        newUV.x =
                            (uv.x - 0.5) *
                            scale +
                            0.5;

                    } else {

                        float scale =
                            textureRatio /
                            screenRatio;

                        newUV.y =
                            (uv.y - 0.5) *
                            scale +
                            0.5;

                    }

                    return newUV;

                }


                void main() {


                    /* =====================================
                       BASE UV
                    ===================================== */

                    vec2 uv = vUv;


                    /* =====================================
                       ASPECT RATIO
                    ===================================== */

                    float aspect =
                        uResolution.x /
                        uResolution.y;


                    /* =====================================
                       SLOW LIQUID MOVEMENT
                    ===================================== */

                    float wave1 =
                        sin(
                            uv.y * 7.0 +
                            uTime * 0.22
                        );

                    float wave2 =
                        cos(
                            uv.x * 6.0 -
                            uTime * 0.18
                        );

                    float wave3 =
                        sin(
                            (
                                uv.x +
                                uv.y
                            ) * 11.0 +
                            uTime * 0.12
                        );


                    /* =====================================
                       ORGANIC DISTORTION
                    ===================================== */

                    vec2 distortion =
                        vec2(
                            wave1 * 0.45 +
                            wave3 * 0.18,

                            wave2 * 0.35 +
                            wave3 * 0.12
                        );


                    distortion *=
                        uIntensity;


                    /* =====================================
                       MOUSE LENS MOVEMENT
                    ===================================== */

                    vec2 mouseInfluence =
                        uMouse *
                        0.018;


                    distortion +=
                        mouseInfluence;


                    /* =====================================
                       EDGE CONTROL
                    ===================================== */

                    float edgeFade =
                        smoothstep(
                            0.0,
                            0.22,
                            uv.x
                        ) *
                        smoothstep(
                            1.0,
                            0.78,
                            uv.x
                        );

                    distortion *=
                        mix(
                            0.35,
                            1.0,
                            edgeFade
                        );


                    /* =====================================
                       REVEAL
                    ===================================== */

                    distortion *=
                        smoothstep(
                            0.0,
                            1.0,
                            uReveal
                        );


                    /* =====================================
                       APPLY
                    ===================================== */

                    uv +=
                        distortion;


                    /* =====================================
                       VERY SUBTLE LENS CURVE
                    ===================================== */

                    vec2 centered =
                        uv - 0.5;

                    float distanceFromCenter =
                        dot(
                            centered,
                            centered
                        );

                    uv +=
                        centered *
                        distanceFromCenter *
                        0.035;


                    /* =====================================
                       VIDEO
                    ===================================== */

                    vec4 videoColor =
                        texture2D(
                            uVideo,
                            uv
                        );


                    /* =====================================
                       CINEMATIC COLOR
                    ===================================== */

                    vec3 color =
                        videoColor.rgb;


                    /* slight contrast */

                    color =
                        (color - 0.5) *
                        1.045 +
                        0.5;


                    /* preserve highlights */

                    color =
                        mix(
                            color,
                            color *
                            vec3(
                                1.015,
                                1.01,
                                0.985
                            ),
                            0.25
                        );


                    /* =====================================
                       ATMOSPHERIC LIGHT
                    ===================================== */

                    float light =
                        smoothstep(
                            0.85,
                            0.15,
                            distance(
                                uv,
                                vec2(
                                    0.56,
                                    0.47
                                )
                            )
                        );


                    color +=
                        light *
                        vec3(
                            0.025,
                            0.022,
                            0.015
                        );


                    /* =====================================
                       CINEMATIC TOP GRADIENT
                    ===================================== */

                    float topGradient =
                        smoothstep(
                            0.75,
                            0.05,
                            uv.y
                        );


                    color *=
                        mix(
                            1.0,
                            0.84,
                            topGradient *
                            0.35
                        );


                    /* =====================================
                       BOTTOM CINEMATIC GRADIENT
                    ===================================== */

                    float bottomGradient =
                        smoothstep(
                            0.35,
                            1.0,
                            uv.y
                        );


                    color *=
                        mix(
                            1.0,
                            0.62,
                            bottomGradient *
                            0.45
                        );


                    /* =====================================
                       VIGNETTE
                    ===================================== */

                    vec2 vignetteUV =
                        uv - 0.5;

                    vignetteUV.x *=
                        aspect;

                    float vignette =
                        smoothstep(
                            0.18,
                            0.78,
                            length(
                                vignetteUV
                            )
                        );


                    color *=
                        1.0 -
                        vignette *
                        0.32;


                    /* =====================================
                       FILM GRAIN
                    ===================================== */

                    float grain =
                        random(
                            uv *
                            uResolution.xy +
                            uTime
                        );


                    grain =
                        (
                            grain -
                            0.5
                        ) *
                        0.025;


                    color += grain;


                    /* =====================================
                       SUBTLE WHITE ATMOSPHERE
                    ===================================== */

                    float atmosphere =
                        smoothstep(
                            0.8,
                            0.25,
                            distance(
                                uv,
                                vec2(
                                    0.52,
                                    0.46
                                )
                            )
                        );


                    color =
                        mix(
                            color,
                            color +
                            vec3(
                                0.025
                            ),
                            atmosphere *
                            0.18
                        );


                    /* =====================================
                       FINAL
                    ===================================== */

                    gl_FragColor =
                        vec4(
                            color,
                            1.0
                        );

                }

            `

        });




    const geometry =
        new THREE.PlaneGeometry(
            2,
            2
        );


    const plane =
        new THREE.Mesh(
            geometry,
            material
        );

    scene.add(plane);



    function resize() {

        const width =
            hero.clientWidth;

        const height =
            hero.clientHeight;


        renderer.setSize(
            width,
            height,
            false
        );


        uniforms.uResolution.value.set(
            width,
            height
        );

    }

    resize();


    window.addEventListener(
        "resize",
        resize,
        {
            passive: true
        }
    );


  

    if (hasFinePointer) {

        hero.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    hero.getBoundingClientRect();


                targetMouse.x =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width -
                    0.5;


                targetMouse.y =
                    -(
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height -
                        0.5
                    );

            },
            {
                passive: true
            }
        );


        hero.addEventListener(
            "mouseleave",
            () => {

                targetMouse.set(
                    0,
                    0
                );

            }
        );

    }




    function startVideo() {

        const promise =
            video.play();

        if (
            promise !== undefined
        ) {

            promise.catch(() => {});

        }

    }


    if (
        video.readyState >= 2
    ) {

        startVideo();

    } else {

        video.addEventListener(
            "loadeddata",
            startVideo,
            {
                once: true
            }
        );

    }



    const split =
        new SplitType(
            ".hero-title",
            {
                types: "lines,chars"
            }
        );


    /* -----------------------------------------
       Initial states
    ----------------------------------------- */

    gsap.set(
        split.chars,
        {
            yPercent: 115,
            rotateX: -75,
            opacity: 0,
            transformOrigin:
                "50% 100%"
        }
    );


    gsap.set(
        ".hero-kicker",
        {
            y: 20,
            opacity: 0
        }
    );


    gsap.set(
        ".hero-info",
        {
            y: 28,
            opacity: 0
        }
    );


    gsap.set(
        ".hero-bottom",
        {
            y: 15,
            opacity: 0
        }
    );



    const intro =
        gsap.timeline();


    intro.to(
        uniforms.uDisplacement,
        {
            value: 1,

            duration: 1.8,

            ease:
                "power3.out"
        }
    );


    intro.to(
        uniforms.uReveal,
        {
            value: 1,

            duration: 2.2,

            ease:
                "power3.out"
        },
        0
    );


    intro.to(
        ".hero-kicker",
        {
            y: 0,
            opacity: 1,

            duration: .8,

            ease:
                "power3.out"
        },
        .65
    );


    intro.to(
        split.chars,
        {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,

            duration: 1.15,

            stagger: {
                each: .024,
                from: "start"
            },

            ease:
                "power4.out"
        },
        .72
    );


    intro.to(
        ".hero-info",
        {
            y: 0,
            opacity: 1,

            duration: .9,

            ease:
                "power3.out"
        },
        1.25
    );


    intro.to(
        ".hero-bottom",
        {
            y: 0,
            opacity: 1,

            duration: .75,

            ease:
                "power3.out"
        },
        1.55
    );



    function updateMouse() {

        mouse.lerp(
            targetMouse,
            isMobile
                ? 0.04
                : 0.055
        );

        uniforms.uMouse.value.copy(
            mouse
        );

    }


    let lastTime = 0;

    function render(time) {

        requestAnimationFrame(
            render
        );


        /* ---------------------------------------------
           Limit excessive precision
        --------------------------------------------- */

        const delta =
            time - lastTime;


        if (
            delta < 15
        ) return;


        lastTime = time;


        /* ---------------------------------------------
           Time
        --------------------------------------------- */

        uniforms.uTime.value =
            time * 0.001;


        /* ---------------------------------------------
           Mouse
        --------------------------------------------- */

        updateMouse();


        /* ---------------------------------------------
           Render
        --------------------------------------------- */

        renderer.render(
            scene,
            camera
        );

    }


    requestAnimationFrame(
        render
    );


 

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                video.pause();

            } else {

                startVideo();

            }

        }
    );


    window.addEventListener(
        "beforeunload",
        () => {

            videoTexture.dispose();
            material.dispose();
            geometry.dispose();

            renderer.dispose();

        }
    );

});