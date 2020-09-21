(function() {
    "use strict";

    // *************** Consts *****************
    const STRING_COUNT = 6;

    // String position consts
    const STRING_START_X = 0;
    const STRING_START_Y = 100;
    const STRING_LENGTH = 600;
    const STRING_SPACING = 40;
    const STRING_WIDTH = 2;

    // String pluck consts
    const PLUCK_START_DISTANCE = 5.1;
    const MAX_PLUCK_DISTANCE = 30;

    // String wave consts
    const MAX_WAVE_AMPLITUDE = 10;
    const MAX_WAVE_DURATION = 3000;
    const WAVE_PERIOD_LENGTH = 80;
    const WAVE_DECREASE_RATE = 0.015;
    const WAVE_SHIFT_SPEED = 7;
    // Make sure string is long enough to translate seamlessly
    const WAVE_END_THETA = 4 * STRING_LENGTH * Math.PI / WAVE_PERIOD_LENGTH;

    // Sound consts
    const MAX_NOTE_DURATION = MAX_WAVE_DURATION / 1000;
    const FRETTING_COYOTE_TIME = 75;


    const stringState = {
            RESTING: 0,
            PLUCKING: 1,
            WAVING: 2
        }
        // ****************************************

    let instruments;
    let currentInstrument;
    Tone.loaded().then(_ => {
        instruments = Object.freeze({
            synth: new Tone.PolySynth().toDestination(),
            // acousticGuitar: new Tone.Sampler({
            //     urls: {
            //         "E2": "e2.mp3",
            //         "A2": "a2.mp3",
            //         "D3": "d3.mp3",
            //         "G3": "g3.mp3",
            //         "B3": "b3.mp3",
            //         "E4": "e4.mp3"
            //     },
            //     release: 1,
            //     baseUrl: "../sounds/acousticGuitar/",
            // }).toDestination(),
        });

        currentInstrument = instruments.synth;
    });

    let currentFret = 0;
    let currentChord;

    let NoteConverter = {
        getNoteHalfStepUp(note) {
            let newNote = '';
            switch (note[0]) {
                case 'A':
                    if (note[1] == '#')
                        newNote = 'B' + note[2];
                    else if (note[1] == 'b')
                        newNote = 'A' + note[2];
                    else
                        newNote = 'A#' + note[1];
                    break;
                case 'B':
                    if (note[1] == '#')
                        newNote = 'C#' + (Number(note[2]) + 1);
                    else if (note[1] == 'b')
                        newNote = 'B' + note[2];
                    else
                        newNote = 'C' + (Number(note[1]) + 1);
                    break;
                case 'C':
                    if (note[1] == '#')
                        newNote = 'D' + note[2];
                    else if (note[1] == 'b')
                        newNote = 'C' + note[2];
                    else
                        newNote = 'C#' + note[1];
                    break;
                case 'D':
                    if (note[1] == '#')
                        newNote = 'E' + note[2];
                    else if (note[1] == 'b')
                        newNote = 'D' + note[2];
                    else
                        newNote = 'D#' + note[1];
                    break;
                case 'E':
                    if (note[1] == '#')
                        newNote = 'F#' + note[2];
                    else if (note[1] == 'b')
                        newNote = 'E' + note[2];
                    else
                        newNote = 'E#' + note[1];
                    break;
                case 'F':
                    if (note[1] == '#')
                        newNote = 'G' + note[2];
                    else if (note[1] == 'b')
                        newNote = 'F' + note[2];
                    else
                        newNote = 'F#' + note[1];
                    break;
                case 'G':
                    if (note[1] == '#')
                        newNote = 'A' + note[2];
                    else if (note[1] == 'b')
                        newNote = 'G' + note[2];
                    else
                        newNote = 'G#' + note[1];
                    break;
            }
            return newNote;
        },

        getPitchedUpBy(note, halfStepCount) {
            let newNote = note;
            for (let i = 0; i < halfStepCount; i++) {
                newNote = this.getNoteHalfStepUp(newNote);
            }
            return newNote;
        }
    };

    class String {
        constructor(startPos, endPos, width) {
            this.state = stringState.RESTING;

            // Drawing variables
            this.startPos = startPos;
            this.endPos = endPos;
            this.pluckPos = undefined;
            this.width = width

            // Wave variables
            this.amplitude = 0;
            this.wavePosition = 0;
            this.waveShiftSpeed = 0;
            this.waveTimeoutId;

            // Sound variables
            this.openNote;
            this.previousNote;
        }
        update(mouse) {
            // Handle mouse functionality
            let mouseOver = mouse => Math.abs(mouse.pos.y - this.startPos.y) < PLUCK_START_DISTANCE;
            if (mouse.mouseDown && mouseOver(mouse))
                this.state = stringState.PLUCKING;

            // String Update Finite State Machine
            switch (this.state) {
                case stringState.PLUCKING:
                    // Clear rest timeout if there is one
                    if (this.waveTimeoutId)
                        clearTimeout(this.waveTimeoutId);
                    // Mute note being played (if any)
                    this.mute();
                    // Update the point of plucking & distance from rest point
                    this.pluckPos = mouse.pos;
                    let distanceFromRest = Math.abs(this.pluckPos.y - this.startPos.y);
                    // If user releases the mouse, pluck
                    if (!mouse.mouseDown)
                        this.pluck(distanceFromRest);
                    // If string is pulled too far, pluck
                    else if (distanceFromRest > MAX_PLUCK_DISTANCE)
                        this.pluck(distanceFromRest);
                    break;
                case stringState.WAVING:
                    // Slowly dampen the oscillation
                    this.amplitude -= this.amplitude * WAVE_DECREASE_RATE;
                    // Shift wave horizontally
                    this.wavePosition += this.waveShiftSpeed;
                    // Reset seamlessly to be able to visually shift infinitely
                    if (this.wavePosition > WAVE_PERIOD_LENGTH)
                        this.wavePosition = 0;
                    break;
            }
        }
        pluck(distance) {
            // Visual logic
            this.state = stringState.WAVING;
            this.amplitude = CrlLib.map_range(distance * this.width, 0, MAX_PLUCK_DISTANCE, 0, MAX_WAVE_AMPLITUDE);
            this.wavePosition = 0;
            this.waveShiftSpeed = WAVE_SHIFT_SPEED * CrlLib.map_range(distance, 0, MAX_PLUCK_DISTANCE, 0, 1);

            // Sound logic
            this.mute();
            let currentNote = this.openNote;
            currentNote = NoteConverter.getPitchedUpBy(currentNote, currentFret);
            currentInstrument.triggerAttackRelease(currentNote, CrlLib.map_range(distance, 0, MAX_PLUCK_DISTANCE, 0, MAX_NOTE_DURATION));
            this.previousNote = currentNote;

            // Go back to rest once string is done ringing
            const duration = CrlLib.map_range(distance, 0, MAX_PLUCK_DISTANCE, 0, MAX_WAVE_DURATION);
            if (this.waveTimeoutId)
                clearTimeout(this.waveTimeoutId);
            this.waveTimeoutId = setTimeout(_ => { this.state = stringState.RESTING }, duration);
        }
        mute() {
            currentInstrument.triggerRelease(this.previousNote, Tone.now());
        }
        draw(ctx) {
            // String Drawing Finite State Machine
            switch (this.state) {
                case stringState.RESTING:
                    CtxUtil.strokeLine(ctx, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y, "black", this.width);
                    break;
                case stringState.PLUCKING:
                    CtxUtil.strokeLine(ctx, this.startPos.x, this.startPos.y, this.pluckPos.x, this.pluckPos.y, "black", this.width);
                    CtxUtil.strokeLine(ctx, this.pluckPos.x, this.pluckPos.y, this.endPos.x, this.endPos.y, "black", this.width);
                    break;
                case stringState.WAVING:
                    CtxUtil.strokeSin(ctx, this.startPos.x - this.wavePosition, this.startPos.y, this.amplitude, WAVE_PERIOD_LENGTH, WAVE_END_THETA, "black", this.width);
                    break;
            }
        }
    }

    class Guitar {
        constructor() {
            this.strings = [];

            // Create Strings
            for (let i = 0; i < STRING_COUNT; i++) {
                this.strings.push(new String(
                    new Vector2d(STRING_START_X, STRING_START_Y + STRING_SPACING * i),
                    new Vector2d(STRING_START_X + STRING_LENGTH, STRING_START_Y + STRING_SPACING * i),
                    STRING_WIDTH / 3 * (STRING_COUNT - i)));
            }

            // Set strings tuning (standard tunning EADGBE)
            // 7th string and up's notes must be manually entered 
            this.strings[0].openNote = "E2";
            this.strings[1].openNote = "A2";
            this.strings[2].openNote = "D3";
            this.strings[3].openNote = "G3";
            this.strings[4].openNote = "B3";
            this.strings[5].openNote = "E4";

            // Attach Keyboard Functionality
            // Only six strings attached (extras must be attached manually)
            document.addEventListener('keyup', e => {
                // Only numpad numbers
                // https://stackoverflow.com/questions/13196945/keycode-values-for-numeric-keypad
                if (e.keyCode >= 96 && e.keyCode <= 105) {
                    switch (e.key) {
                        case '6':
                            if (this.strings[5])
                                this.strings[5].pluck(MAX_PLUCK_DISTANCE);
                            break;
                        case '5':
                            if (this.strings[4])
                                this.strings[4].pluck(MAX_PLUCK_DISTANCE);
                            break;
                        case '4':
                            if (this.strings[3])
                                this.strings[3].pluck(MAX_PLUCK_DISTANCE);
                            break;
                    }
                }
                // Only keyboard numbers
                else if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 189 || e.keyCode == 187) {
                    switch (e.key) {
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case '0':
                        case '-':
                        case '=':
                            setTimeout(_ => { currentFret = 0; }, FRETTING_COYOTE_TIME);
                            break;
                    }
                } else {
                    switch (e.key) {
                        case 'ArrowRight':
                            if (this.strings[2])
                                this.strings[2].pluck(MAX_PLUCK_DISTANCE);
                            break;
                        case 'ArrowDown':
                            if (this.strings[1])
                                this.strings[1].pluck(MAX_PLUCK_DISTANCE);
                            break;
                        case 'ArrowLeft':
                            if (this.strings[0])
                                this.strings[0].pluck(MAX_PLUCK_DISTANCE);
                            break;
                    }
                }

            });

            document.addEventListener('keydown', e => {
                // TODO - HANDLE CHORD SELECTION
                if (currentChord) {

                } else {
                    // Only keyboard numbers
                    // https://stackoverflow.com/questions/13196945/keycode-values-for-numeric-keypad
                    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 189 || e.keyCode == 187) {
                        switch (e.key) {
                            case '1':
                                currentFret = 1;
                                break;
                            case '2':
                                currentFret = 2;
                                break;
                            case '3':
                                currentFret = 3;
                                break;
                            case '4':
                                currentFret = 4;
                                break;
                            case '5':
                                currentFret = 5;
                                break;
                            case '6':
                                currentFret = 6;
                                break;
                            case '7':
                                currentFret = 7;
                                break;
                            case '8':
                                currentFret = 8;
                                break;
                            case '9':
                                currentFret = 9;
                                break;
                            case '0':
                                currentFret = 10;
                                break;
                            case '-':
                                currentFret = 11;
                                break;
                            case '=':
                                currentFret = 12;
                                break;
                        }
                    }
                }

                if (e.key == ' ') {
                    for (const string of this.strings) {
                        string.mute();
                        string.state = stringState.RESTING;
                    }
                }
            });
        }
        getStringCount() {
            return this.strings.length;
        }
        updateStrings(mouse) {
            for (const string of this.strings)
                string.update(mouse);
        }
        draw(ctx) {
            // CtxUtil.fillRing(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, 150, 1000, "black");
            for (const string of this.strings)
                string.draw(ctx);
        }
    }

    if (window)
        window["Guitar"] = Guitar;
    else
        throw "'window is not defined'";
})();