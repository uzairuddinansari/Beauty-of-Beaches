$(document).ready(function () {



    const $shutter = $(".Shutter");
    const $titles = $(".h1_sec h1");
    const $overlay = $(".overlayer");
    const $video = $(".vid_sec video");
    const $canvas = $("#shutterCanvas");

    let isOpen = false;
    let isAnimating = false;
    let timeline = null;

    let scene = null;
    let camera = null;
    let renderer = null;
    let material = null;
    let mesh = null;
    let videoTexture = null;
    let clock = null;

    let animationFrame = null;

    let threeReady = false;
    let threeRunning = false;

    let mouseX = 0;
    let mouseY = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;


    const mediaQuery = window.matchMedia(
        "(min-width: 801px)"
    );


    function isDesktop() {
        return mediaQuery.matches;
    }


    gsap.set($shutter, {
        x: "-100%",
        autoAlpha: 1
    });

    gsap.set($titles, {
        y: -26,
        opacity: 0
    });

    gsap.set($overlay, {
        x: "0%"
    });



    const video = $video.length
        ? $video[0]
        : null;


    if (video) {

        video.muted = true;
        video.volume = 0;

        video.loop = true;

        video.playsInline = true;

        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute(
            "webkit-playsinline",
            ""
        );

    }



    function stopScroll() {

        document.body.style.overflow = "hidden";

        if (
            typeof lenis !== "undefined" &&
            lenis &&
            typeof lenis.stop === "function"
        ) {
            lenis.stop();
        }

    }


    function startScroll() {

        document.body.style.overflow = "";

        if (
            typeof lenis !== "undefined" &&
            lenis &&
            typeof lenis.start === "function"
        ) {
            lenis.start();
        }

    }



    function startVideo() {

        if (!video) return;

        video.muted = true;
        video.volume = 0;

        const promise = video.play();

        if (promise !== undefined) {

            promise.catch(function () {});

        }

    }


    function pauseVideo() {

        if (!video) return;

        video.pause();

    }



    function initThree() {

        if (!isDesktop()) {
            return;
        }


        if (!video) {

            console.warn(
                "Shutter: video element not found."
            );

            return;
        }


        if (!$canvas.length) {

            console.warn(
                "Shutter: #shutterCanvas not found."
            );

            return;
        }


        if (typeof THREE === "undefined") {

            console.warn(
                "Shutter: Three.js not loaded. Using normal video."
            );

            showVideoFallback();

            return;
        }


        if (threeReady) {
            return;
        }



        scene = new THREE.Scene();


        camera = new THREE.OrthographicCamera(
            -1,
            1,
            1,
            -1,
            0.1,
            10
        );

        camera.position.z = 1;


        try {

            renderer = new THREE.WebGLRenderer({

                canvas: $canvas[0],

                alpha: true,

                antialias: false,

                powerPreference: "high-performance"

            });

        } catch (error) {

            console.warn(
                "Shutter: WebGL unavailable. Using normal video."
            );

            showVideoFallback();

            return;
        }


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                1
            )
        );


        renderer.setClearColor(
            0x000000,
            0
        );



        videoTexture = new THREE.VideoTexture(
            video
        );

        videoTexture.minFilter =
            THREE.LinearFilter;

        videoTexture.magFilter =
            THREE.LinearFilter;

        videoTexture.generateMipmaps = false;


        if ("colorSpace" in videoTexture) {

            videoTexture.colorSpace =
                THREE.SRGBColorSpace;

        }


        material = new THREE.ShaderMaterial({

            transparent: false,

            uniforms: {

                uTexture: {
                    value: videoTexture
                },

                uTime: {
                    value: 0
                },

                uMouse: {

                    value:
                        new THREE.Vector2(
                            0,
                            0
                        )

                }

            },


            vertexShader: `

                varying vec2 vUv;

                void main() {

                    vUv = uv;

                    gl_Position =
                        projectionMatrix *
                        modelViewMatrix *
                        vec4(
                            position,
                            1.0
                        );

                }

            `,


fragmentShader: `

    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uMouse;

    varying vec2 vUv;


    void main() {

        vec2 uv = vUv;


        /* =========================================
           SUBTLE MOUSE MOVEMENT
        ========================================= */

        uv.x += uMouse.x * 0.018;
        uv.y += uMouse.y * 0.012;


        /* =========================================
           VERY SOFT ORGANIC DISTORTION
        ========================================= */

        float waveX =
            sin(
                uv.y * 7.0 +
                uTime * 0.22
            )
            * 0.0012
            * uMouse.y;


        float waveY =
            cos(
                uv.x * 6.0 -
                uTime * 0.20
            )
            * 0.001
            * uMouse.x;


        uv.x += waveX;
        uv.y += waveY;


        /* =========================================
           SOFT LENS
        ========================================= */

        vec2 center =
            vUv - 0.5;

        float dist =
            dot(
                center,
                center
            );

        float lens =
            dist * 0.004;


        uv +=
            uMouse *
            lens;


        /* =========================================
           EDGE PROTECTION
           Never sample outside video
        ========================================= */

        uv = clamp(
            uv,
            vec2(0.002),
            vec2(0.998)
        );


        /* =========================================
           VIDEO
        ========================================= */

        vec3 color =
            texture2D(
                uTexture,
                uv
            ).rgb;


        /* =========================================
           CINEMATIC CONTRAST
        ========================================= */

        color =
            pow(
                color,
                vec3(0.98)
            );


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


        mesh =
            new THREE.Mesh(
                geometry,
                material
            );


        scene.add(mesh);


    

        clock =
            new THREE.Clock();


   

        threeReady = true;


        resizeThree();




        renderer.render(
            scene,
            camera
        );

    }




    function showVideoFallback() {

        if (!video) return;


        if ($canvas.length) {

            gsap.set(
                $canvas,
                {
                    autoAlpha: 0
                }
            );

        }


        gsap.set(
            $video,
            {
                autoAlpha: 1
            }
        );

    }


 

    function showThreeCanvas() {

        if (!$canvas.length) return;


        gsap.set(
            $canvas,
            {
                autoAlpha: 1
            }
        );


        if (video) {

            gsap.set(
                $video,
                {
                    autoAlpha: 0
                }
            );

        }

    }



    function resizeThree() {

        if (
            !renderer ||
            !$canvas.length ||
            !isDesktop()
        ) {
            return;
        }


        const width =
            $canvas[0].clientWidth ||
            window.innerWidth;


        const height =
            $canvas[0].clientHeight ||
            window.innerHeight;


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                1.25
            )
        );


        renderer.setSize(
            width,
            height,
            false
        );


        if (camera) {

            camera.left = -1;
            camera.right = 1;
            camera.top = 1;
            camera.bottom = -1;

            camera.updateProjectionMatrix();

        }


        if (
            renderer &&
            scene &&
            camera
        ) {

            renderer.render(
                scene,
                camera
            );

        }

    }

    function handleMouse(event) {

        if (
            !isOpen ||
            !isDesktop()
        ) {
            return;
        }


        targetMouseX =
            (
                event.clientX /
                window.innerWidth
            ) * 2 - 1;


        targetMouseY =
            (
                event.clientY /
                window.innerHeight
            ) * 2 - 1;


   

        targetMouseX *= 0.85;

        targetMouseY *= 0.85;

    }
     $(document).on("mousemove", handleMouse);

    /* =========================================================
       START THREE
    ========================================================= */

    function startThree() {

        if (
            !threeReady ||
            threeRunning ||
            !renderer
        ) {
            return;
        }


        threeRunning = true;


        if (clock) {

            clock.start();

        }


        renderThree();

    }




    function stopThree() {

        threeRunning = false;


        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;

        }


        targetMouseX = 0;
        targetMouseY = 0;

    }


  

    function renderThree() {

        if (!threeRunning) {
            return;
        }


        animationFrame =
            requestAnimationFrame(
                renderThree
            );


        if (
            !renderer ||
            !material ||
            !scene ||
            !camera
        ) {
            return;
        }


        const time =
            clock
                ? clock.getElapsedTime()
                : 0;


 
        mouseX +=
            (
                targetMouseX -
                mouseX
            ) * 0.09;


        mouseY +=
            (
                targetMouseY -
                mouseY
            ) * 0.09;


        material
            .uniforms
            .uTime
            .value = time;


        material
            .uniforms
            .uMouse
            .value
            .set(
                mouseX,
                mouseY
            );


      

        renderer.render(
            scene,
            camera
        );

    }



    function enableDesktop() {

        if (!video) return;


        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;


        initThree();


        if (threeReady) {

            showThreeCanvas();

        } else {

            showVideoFallback();

        }


        startVideo();


        if (threeReady) {

            startThree();

        }

    }



    function enableMobile() {

        stopThree();


        if ($canvas.length) {

            gsap.set(
                $canvas,
                {
                    autoAlpha: 0
                }
            );

        }


        if (!video) return;


        video.autoplay = false;
        video.muted = true;

        video.pause();


        gsap.set(
            $video,
            {
                autoAlpha: 1
            }
        );


        if (
            video.readyState >= 1
        ) {

            try {

                video.currentTime = 0;

            } catch (error) {}

        }

    }


    function applyMediaMode() {

        if (isDesktop()) {

            enableDesktop();

        } else {

            enableMobile();

        }

    }



    applyMediaMode();


    mediaQuery.addEventListener(
        "change",
        function () {


            if (timeline) {

                timeline.kill();

            }


            isOpen = false;
            isAnimating = false;


            gsap.set(
                $shutter,
                {
                    x: "-100%"
                }
            );


            gsap.set(
                $titles,
                {
                    y: -26,
                    opacity: 0
                }
            );


            gsap.set(
                $overlay,
                {
                    x: "0%"
                }
            );


            applyMediaMode();

        }
    );



    function openShutter() {

        if (isAnimating) {
            return;
        }


        isAnimating = true;
        isOpen = true;


        stopScroll();


        if (isDesktop()) {

            startVideo();

        } else {

            pauseVideo();

        }


        if (
            isDesktop() &&
            threeReady
        ) {

            showThreeCanvas();

            startThree();

        }


        if (timeline) {

            timeline.kill();

        }


        gsap.set(
            $shutter,
            {
                x: "-100%"
            }
        );


        gsap.set(
            $titles,
            {
                y: -26,
                opacity: 0
            }
        );


        gsap.set(
            $overlay,
            {
                x: "0%"
            }
        );


        timeline =
            gsap.timeline({

                onComplete: function () {

                    isAnimating = false;

                }

            });


        timeline.to(
            $shutter,
            {

                x: "0%",

                duration: 0.75,

                ease: "power3.out"

            }
        );


        timeline.to(
            $titles,
            {

                y: 0,

                opacity: 1,

                duration: 0.6,

                stagger: 0.12,

                ease: "power3.out"

            },
            "-=0.3"
        );



        timeline.to(
            $overlay,
            {

                x: "-100%",

                duration: 1,

                ease: "power3.inOut"

            },
            "-=0.45"
        );

    }

    function closeShutter() {

        if (isAnimating) {
            return;
        }


        isAnimating = true;
        isOpen = false;


        stopThree();


        if (!isDesktop()) {

            pauseVideo();

        }


        if (timeline) {

            timeline.kill();

        }


        timeline =
            gsap.timeline({

                onComplete: function () {

                    isAnimating = false;

                    startScroll();

                }

            });



        timeline.to(
            $titles,
            {

                y: -26,

                opacity: 0,

                duration: 0.25,

                stagger: 0.04,

                ease: "power2.in"

            }
        );


        timeline.to(
            $overlay,
            {

                x: "0%",

                duration: 0.65,

                ease: "power3.inOut"

            }
        );




        timeline.to(
            $shutter,
            {

                x: "-100%",

                duration: 0.7,

                ease: "power3.inOut"

            },
            "-=0.2"
        );

    }


    $(document).on(
        "click",
        ".click",
        function (event) {

            event.preventDefault();


            if (isAnimating) {
                return;
            }


            if (!isOpen) {

                openShutter();

            } else {

                closeShutter();

            }

        }
    );


    $(document).on(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                isOpen &&
                !isAnimating
            ) {

                closeShutter();

            }

        }
    );


    let resizeTimer = null;


    $(window).on(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        if (isDesktop()) {

                            resizeThree();

                        }

                    },
                    100
                );

        }
    );

    $(window).on(
        "beforeunload",
        function () {

            stopThree();

            pauseVideo();

            startScroll();

        }
    );

});