(function() {
    "use strict";

    const colors = Object.freeze({
        morning: "#d7e8fd",
        evening: "#392033",
        rain: "#2c3845"
    });

    let ambienceState = "morning";

    let Ambience = {
        draw(ctx) {
            CtxUtil.fillBackground(ctx, colors[ambienceState]);
        }
    };

    window.addEventListener("load", init);
    function init() {
        let ambienceSelect = document.querySelector("select#ambience");

        ambienceSelect.onchange = e => {
            ambienceState = e.target.value;
        };
    }

    if (window) {
        window["Ambience"] = Ambience;
    }
    else
        throw "'window is not defined'";
})();