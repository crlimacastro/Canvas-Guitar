(function () {
    const STRING_COUNT = 6;

    // String position consts
    const STRING_START_X = 0;
    const STRING_START_Y = 100;
    const STRING_LENGTH = 600;
    const STRING_SPACING = 40;
    const STRING_WIDTH = 2;

    // String pluck consts
    const PLUCK_START_DISTANCE = 5.1;
    const MAX_PLUCK_DISTANCE = 40;

    // String wave consts
    const MAX_WAVE_AMPLITUDE = 30;
    const MAX_WAVE_DURATION = 5000;
    const WAVE_PERIOD_LENGTH = 80;
    const WAVE_DECREASE_RATE = 0.015;
    const WAVE_SHIFT_SPEED = 7;
    // Make sure string is long enough to translate seamlessly
    const WAVE_END_THETA = 2 * periodCountToTheta(lengthToPeriodCount(STRING_LENGTH, WAVE_PERIOD_LENGTH)) * WAVE_SHIFT_SPEED;

    const stringState = {
        RESTING: 0,
        PLUCKING: 1,
        WAVING: 2
    }

    class String {
        constructor(index, startPos, endPos) {
            this.index = index;
            this.startPos = startPos;
            this.endPos = endPos;
            this.pluckPos = null;
            this.state = stringState.RESTING;

            // Wave variables
            this.amplitude = 0;
            this.wavePosition = 0;
        }
        updateState(mouse) {
            let mouseOver = mouse => Math.abs(mouse.pos.y - this.startPos.y) < PLUCK_START_DISTANCE;

            if (mouse.mouseDown && mouseOver(mouse))
                this.state = stringState.PLUCKING;
            if (this.state == stringState.PLUCKING) {
                this.pluckPos = mouse.pos;

                let distanceFromRest = Math.abs(this.pluckPos.y - this.startPos.y);
                if (!mouse.mouseDown)
                    this.pluck(distanceFromRest);
                else if (distanceFromRest > MAX_PLUCK_DISTANCE)
                    this.pluck(distanceFromRest);
            }
            if (this.state == stringState.WAVING) {
                this.amplitude -= this.amplitude * WAVE_DECREASE_RATE;
                this.wavePosition += WAVE_SHIFT_SPEED;
            }
        }
        pluck(distance) {
            this.state = stringState.WAVING;
            this.amplitude = CrlLib.map_range(distance, 0, MAX_PLUCK_DISTANCE, 0, MAX_WAVE_AMPLITUDE);
            this.wavePosition = 0;
            const duration = CrlLib.map_range(distance, 0, MAX_PLUCK_DISTANCE, 0, MAX_WAVE_DURATION);
            // Go back to rest once string is done ringing
            setTimeout(_ => { this.state = stringState.RESTING }, duration);
        }
        draw(ctx) {
            // String State Finite State Machine
            switch (this.state) {
                case stringState.RESTING:
                    CtxUtil.strokeLine(ctx, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y, "black", STRING_WIDTH);
                    break;
                case stringState.PLUCKING:
                    CtxUtil.strokeLine(ctx, this.startPos.x, this.startPos.y, this.pluckPos.x, this.pluckPos.y, "black", STRING_WIDTH);
                    CtxUtil.strokeLine(ctx, this.pluckPos.x, this.pluckPos.y, this.endPos.x, this.endPos.y, "black", STRING_WIDTH);
                    break;
                case stringState.WAVING:
                    CtxUtil.strokeSin(ctx, this.startPos.x - this.wavePosition, this.startPos.y, this.amplitude, WAVE_PERIOD_LENGTH, WAVE_END_THETA, "black", STRING_WIDTH);
                    break;
            }
        }
    }

    // Conversions
    function thetaToPeriodCount(theta) {
        return theta / (2 * Math.PI);
    }
    function periodCountToTheta(count) {
        return count * (2 * Math.PI);
    }
    function periodCountToLength(count, periodLenght) {
        return count * periodLenght;
    }
    function lengthToPeriodCount(length, periodLenght) {
        return length / periodLenght;
    }

    class Guitar {
        constructor() {
            this.strings = [];
            // Create Strings
            for (let i = 0; i < STRING_COUNT; i++) {
                this.strings.push(new String(
                    i,
                    new Vector2d(STRING_START_X, STRING_START_Y + STRING_SPACING * i),
                    new Vector2d(STRING_START_X + STRING_LENGTH, STRING_START_Y + STRING_SPACING * i)));
            }
        }
        updateStrings(mouse) {
            for (const string of this.strings)
                string.updateState(mouse);
        }
        draw(ctx) {
            CtxUtil.fillRing(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, 150, 1000, "black");
            for (const string of this.strings)
                string.draw(ctx);
        }
    }

    if (window) {
        window["Guitar"] = Guitar;
    }
    else
        throw "'window is not defined'";
})();