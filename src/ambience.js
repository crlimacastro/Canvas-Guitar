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

    const sounds = Object.freeze({
        morning: new Tone.Player("../sounds/morning.mp3").toDestination(),
        evening: new Tone.Player("../sounds/night.mp3").toDestination(),
        rain: new Tone.Player("../sounds/rain.mp3").toDestination()
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
        let ambienceVolume = document.querySelector("input#ambienceVolume");
        let canvas = document.querySelector("canvas")

        // Make all ambience sounds loop
        // & default their volume
        for (const sound in sounds) {
            sounds[sound].loop = true;
            sounds[sound].volume.value = CrlLib.map_range(ambienceVolume.value, 0, 100, -100, 0);
        }

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
        ambienceVolume.oninput = e => {
            for (const sound in sounds) {
                let dBs = CrlLib.map_range(e.target.value, 0, 100, -100, 0)
                sounds[sound].volume.value = dBs;
            }
        }

        Tone.loaded().then(() => {
            sounds[ambienceState].start();

            ambienceSelect.onchange = e => {
                previousAmbienceState = ambienceState;
                ambienceState = e.target.value;

                if (sounds[previousAmbienceState])
                    sounds[previousAmbienceState].stop();
                if (sounds[ambienceState])
                    sounds[ambienceState].start();
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

    if (window) {
        window["Ambience"] = Ambience;
    } else
        throw "'window is not defined'";
})();