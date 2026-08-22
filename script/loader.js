
(() => {

    const loader =
        document.getElementById(
            "beach-loader"
        );


    if (!loader) return;

    if (
        sessionStorage.getItem(
            "beautyOfBeachesLoader"
        ) === "shown"
    ) {

        loader.remove();

        document.body.classList.add(
            "page-ready"
        );

        return;

    }


    const canvas =
        document.getElementById(
            "loader-canvas"
        );


    const image =
        document.querySelector(
            ".loader-image"
        );


    const percent =
        document.getElementById(
            "loader-percent"
        );


    const status =
        document.querySelector(
            ".loader-status"
        );


    const startTime =
        performance.now();


    const MIN_TIME = 5000;

    const MAX_TIME = 7000;


    let progress = 0;

    let displayedProgress = 0;

    let ready = false;

    let finished = false;


    document.body.style.overflow =
        "hidden";



    const scene =
        new THREE.Scene();


    const camera =
        new THREE.PerspectiveCamera(

            45,

            window.innerWidth /
            window.innerHeight,

            .1,

            100

        );


    camera.position.z = 5;


    const renderer =
        new THREE.WebGLRenderer({

            canvas,

            alpha: true,

            antialias: true,

            powerPreference:
                "high-performance"

        });


    renderer.setPixelRatio(

        Math.min(
            window.devicePixelRatio,
            1.5
        )

    );


    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );



    const geometry =
        new THREE.PlaneGeometry(

            12,

            8,

            40,

            40

        );


    const material =
        new THREE.MeshBasicMaterial({

            color: 0xffffff,

            transparent: true,

            opacity: .035,

            wireframe: false

        });


    const plane =
        new THREE.Mesh(

            geometry,

            material

        );


    scene.add(
        plane
    );


    const positions =
        geometry.attributes.position;


    for (
        let i = 0;
        i < positions.count;
        i++
    ) {

        const x =
            positions.getX(i);

        const y =
            positions.getY(i);


        positions.setZ(

            i,

            Math.sin(
                x * .8
            ) *
            Math.cos(
                y * .7
            ) *
            .05

        );

    }


    positions.needsUpdate =
        true;


    let mouseX = 0;

    let mouseY = 0;


    window.addEventListener(

        "mousemove",

        (e) => {

            mouseX =
                (
                    e.clientX /
                    window.innerWidth
                ) - .5;


            mouseY =
                (
                    e.clientY /
                    window.innerHeight
                ) - .5;

        },

        {
            passive: true
        }

    );


    const clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );


        const time =
            clock.getElapsedTime();


        plane.rotation.x +=
            (
                mouseY * .002 -
                plane.rotation.x
            ) * .02;


        plane.rotation.y +=
            (
                mouseX * .002 -
                plane.rotation.y
            ) * .02;


        plane.position.x =
            Math.sin(
                time * .18
            ) * .025;


        plane.position.y =
            Math.cos(
                time * .16
            ) * .02;


        renderer.render(
            scene,
            camera
        );

    }

    animate();

    window.addEventListener(

        "resize",

        () => {

            camera.aspect =
                window.innerWidth /
                window.innerHeight;


            camera.updateProjectionMatrix();


            renderer.setSize(

                window.innerWidth,

                window.innerHeight

            );


            renderer.setPixelRatio(

                Math.min(
                    window.devicePixelRatio,
                    1.5
                )

            );

        }

    );


    const images =
        Array.from(
            document.images
        );


    let loadedImages = 0;


    function imageLoaded() {

        loadedImages++;


        progress =
            Math.min(

                90,

                (
                    loadedImages /
                    Math.max(
                        images.length,
                        1
                    )
                ) * 90

            );

    }


    if (
        images.length === 0
    ) {

        progress = 90;

    } else {

        images.forEach(

            (img) => {

                if (
                    img.complete
                ) {

                    imageLoaded();

                } else {

                    img.addEventListener(
                        "load",
                        imageLoaded,
                        {
                            once: true
                        }
                    );


                    img.addEventListener(
                        "error",
                        imageLoaded,
                        {
                            once: true
                        }
                    );

                }

            }

        );

    }


    window.addEventListener(

        "load",

        () => {

            progress = 100;

            ready = true;

        },

        {
            once: true
        }

    );



    setTimeout(

        () => {

            progress = 100;

            ready = true;

        },

        MAX_TIME

    );




    const statusWords = [

        "DISCOVERING THE SHORE",

        "FINDING THE HORIZON",

        "FOLLOWING THE COAST",

        "PREPARING YOUR JOURNEY",

        "WELCOME TO THE SHORE"

    ];


    let statusIndex = 0;


    const statusTimer =
        setInterval(

            () => {

                statusIndex++;


                if (
                    statusIndex <
                    statusWords.length
                ) {

                    status.textContent =
                        statusWords[
                            statusIndex
                        ];

                }

            },

            650

        );




    if (
        typeof gsap !==
        "undefined"
    ) {

        const intro =
            gsap.timeline();


        intro.set(

            image,

            {

                opacity: 0,

                scale: 1.12

            }

        );


        intro.set(

            ".loader-bb",
            {
                opacity: 0,
                scale: .8,
                y: 25
            }
        );
        intro.set(
            ".loader-title",
            {
                opacity: 0,
                y: 15
            }
        );
        intro.set(
            ".loader-top",
            {
                opacity: 0,
                y: -10
            }
        );
        intro.set(
            ".loader-bottom",
            {
                opacity: 0,
                y: 10
            }
        );
        intro.set(
            status,
            {
                opacity: 0
            }
        );
        /* Beach */

        intro.to(

            image,

            {

                opacity: .5,

                scale: 1,

                duration: 1.8,

                ease:
                    "power3.out"

            }

        );


        /* Top */

        intro.to(

            ".loader-top",

            {

                opacity: 1,

                y: 0,

                duration: .7,

                ease:
                    "power2.out"

            },

            "-=1.2"

        );


        /* BB */

        intro.to(

            ".loader-bb",

            {

                opacity: 1,

                scale: 1,

                y: 0,

                duration: 1.1,

                ease:
                    "power3.out"

            },

            "-=.45"

        );


        /* Title */

        intro.to(

            ".loader-title",

            {

                opacity: 1,

                y: 0,

                duration: .65,

                ease:
                    "power2.out"

            },

            "-=.55"

        );


        /* Line */

        intro.to(

            ".loader-line",

            {

                width: 85,

                duration: .7,

                ease:
                    "power3.inOut"

            },

            "-=.3"

        );


        /* Status */

        intro.to(

            status,

            {

                opacity: 1,

                duration: .5

            },

            "-=.3"

        );


        /* Bottom */

        intro.to(

            ".loader-bottom",

            {

                opacity: 1,

                y: 0,

                duration: .7

            },

            "-=.35"

        );

    }


 

    function progressLoop() {

        displayedProgress +=
            (
                progress -
                displayedProgress
            ) * .075;


        if (

            Math.abs(
                progress -
                displayedProgress
            ) < .1

        ) {

            displayedProgress =
                progress;

        }


        percent.textContent =
            String(
                Math.floor(
                    displayedProgress
                )
            ).padStart(
                3,
                "0"
            );


        const elapsed =
            performance.now() -
            startTime;


        if (

            ready &&

            elapsed >=
            MIN_TIME &&

            displayedProgress >= 99

        ) {

            finish();

            return;

        }


        requestAnimationFrame(
            progressLoop
        );

    }


    progressLoop();




    function finish() {

        if (finished) return;

        finished = true;


        sessionStorage.setItem(
            "beautyOfBeachesLoader",
            "shown"
        );


        clearInterval(
            statusTimer
        );


        if (
            typeof gsap !==
            "undefined"
        ) {

            const exit =
                gsap.timeline({

                    onComplete:
                        cleanup

                });


            /* Image becomes dominant */

            exit.to(

                image,

                {

                    opacity: .85,

                    scale: 1.04,

                    duration: .9,

                    ease:
                        "power3.inOut"

                }

            );


            /* UI disappears */

            exit.to(

                ".loader-editorial",

                {

                    opacity: 0,

                    scale: .98,

                    duration: .6,

                    ease:
                        "power2.in"

                },

                "-=.6"

            );


            /* Full image reveal */

            exit.to(

                image,

                {

                    scale: 1,

                    duration: 1,

                    ease:
                        "power3.inOut"

                },

                "-=.25"

            );


            /* Loader away */

            exit.to(

                loader,

                {

                    opacity: 0,

                    duration: .8,

                    ease:
                        "power2.out"

                },

                "-=.45"

            );

        } else {

            cleanup();

        }

    }



    function cleanup() {

        loader.remove();

        document.body.style.overflow =
            "";

        document.body.classList.add(
            "page-ready"
        );


        geometry.dispose();

        material.dispose();

        renderer.dispose();

    }


})();