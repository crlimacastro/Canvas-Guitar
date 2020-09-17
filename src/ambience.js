(function () {
    "use strict";

    const colors = Object.freeze({
        morning: "#d7e8fd",
        evening: "#392033",
        rain: "#2c3845",
        none: "#fff"
    });

    const sounds = Object.freeze({
        morning: new Tone.Player("../sounds/morning.mp3").toDestination(),
        evening: new Tone.Player("../sounds/night.mp3").toDestination(),
        rain: new Tone.Player("../sounds/rain.mp3").toDestination()
    });

    let ambienceState = "morning";
    let previousAmbienceState;

    let Ambience = {
        draw(ctx) {
            CtxUtil.fillBackground(ctx, colors[ambienceState]);
        }
    };

    window.addEventListener("load", init);
    function init() {
        let ambienceSelect = document.querySelector("select#ambience");
        let ambienceVolume = document.querySelector("input#ambienceVolume");

        // Make all ambience sounds loop
        // & default their volume
        for (const sound in sounds) {
            sounds[sound].loop = true;
            sounds[sound].volume.value = CrlLib.map_range(ambienceVolume.value, 0, 100, -100, 0);
        }

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

    if (window) {
        window["Ambience"] = Ambience;
    }
    else
        throw "'window is not defined'";
})();