(function() {
    "use strict";

    const RAIN_COUNT = 100;
    // By how much in each direction will the rain rotate
    const RAIN_ANGLE = Math.PI / 6;

    const colors = Object.freeze({
        morning: "#d7e8fd",
        evening: "#392033",
        rain: "#2c3845",
        none: "#ffffff"
    });

    const ambiencePlayer = new Tone.Player().toDestination();
    const sounds = Object.freeze({
        morning: "../sounds/morning.mp3",
        evening: "../sounds/night.mp3",
        rain: "../sounds/rain.mp3"
    });

    let ambienceState = "morning";
    let previousAmbienceState;
    let ambienceColor = colors[ambienceState];

    let rainPool = [];

    let Ambience = {
        update(dt) {
            // Lerp background color
            let currentRGB = hexToRgb(ambienceColor);
            const targetRGB = hexToRgb(colors[ambienceState]);
            if (currentRGB.r != targetRGB.r && currentRGB.g != targetRGB.g && currentRGB.b != targetRGB.b) {
                currentRGB.r = CrlLib.lerp(currentRGB.r, targetRGB.r, dt);
                currentRGB.g = CrlLib.lerp(currentRGB.g, targetRGB.g, dt);
                currentRGB.b = CrlLib.lerp(currentRGB.b, targetRGB.b, dt);
                ambienceColor = rgbToHex(Math.trunc(currentRGB.r), Math.trunc(currentRGB.g), Math.trunc(currentRGB.b));
            }

            // Update raindrops
            if (ambienceState == 'rain') {
                for (const raindrop of rainPool) {
                    raindrop.update(dt);
                }
            }
        },
        draw(ctx) {
            CtxUtil.fillBackground(ctx, ambienceColor);
            if (ambienceState == 'rain') {
                for (const raindrop of rainPool) {
                    raindrop.draw(ctx);
                }
            }
        }
    };

    window.addEventListener("load", init);

    function init() {
        let ambienceSelect = document.querySelector("select#ambience");
        if (localStorage.getItem("ambienceSelect"))
            ambienceSelect.value = localStorage.getItem("ambienceSelect");
        let ambienceVolume = document.querySelector("input#ambienceVolume");
        if (localStorage.getItem("ambienceVolume"))
            ambienceVolume.value = localStorage.getItem("ambienceVolume");
        let canvas = document.querySelector("canvas")

        ambiencePlayer.loop = true;
        ambiencePlayer.volume.value = volumeToDB(ambienceVolume.value);
        ambiencePlayer.load(sounds[ambienceState]);

        // Populate raindrops object pool
        for (let i = 0; i < RAIN_COUNT; i++) {
            let direction = Vector2d.getRotated(new Vector2d(0, RandUtil.getRandom(-100, -40)), RandUtil.getRandom(-RAIN_ANGLE, RAIN_ANGLE));

            rainPool.push({
                ray: new Ray2d(
                    // Position
                    new Vector2d(RandUtil.getRandom(0, canvas.width), RandUtil.getRandom(0, 50)),
                    // Direction
                    direction
                ),
                vel: Vector2d.getScaled(direction, RandUtil.getRandom(10, 50)),
                update(dt) {
                    this.ray.pos.x += this.vel.x * dt;
                    this.ray.pos.y -= this.vel.y * dt;

                    if (this.ray.pos.y > canvas.height) {
                        this.ray.pos.x = RandUtil.getRandom(0, canvas.width);
                        this.ray.pos.y = 0;
                        this.ray.dir = Vector2d.getRotated(new Vector2d(0, RandUtil.getRandom(-100, -40)), RandUtil.getRandom(-RAIN_ANGLE, RAIN_ANGLE));
                        this.vel = Vector2d.getScaled(this.ray.dir, 10, 50);
                    }
                },
                draw(ctx) {
                    this.ray.draw(ctx, 'black');
                }
            });
        }

        // Events
        ambienceVolume.oninput = e => { ambiencePlayer.volume.value = volumeToDB(ambienceVolume.value) };

        Tone.loaded().then(() => {
            ambiencePlayer.start();

            ambienceSelect.onchange = e => {
                ambienceState = e.target.value;
                if (sounds[ambienceState])
                    ambiencePlayer.load(sounds[ambienceState]);
                ambiencePlayer.restart();

                localStorage.setItem("ambienceSelect", e.target.value);
            };
        });
    }

    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    function componentToHex(c) {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function volumeToDB(volume) {
        return 20 * Math.log10(volume / 100);
    }

    if (window) {
        window["Ambience"] = Ambience;
    } else
        throw "'window is not defined'";
})();