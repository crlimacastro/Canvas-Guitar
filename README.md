Canvas Guitar

Link to Application: <https://people.rit.edu/crl3554/330/project1>

My portfolio: <https://crlimacastro.github.io/>

# Documentation

## Contents

[Discussion Post](#Discussion-Post)

[Requirements](#Requirements)

[What went right & wrong](#What-went-right-&-what-went-wrong)

[Wishlist of Features](#Wishlist-of-Features)

[Citations](#Citations)

[Log](#Log)

------------------------------------

## Discussion Post

> I don't think periodic functions are going to get a lot of love so I want to make my Project 1 expand on that. I am planning on simulating guitar strings' "rolling shutter effect", the weird wobble they get when recorded on camera. I am going to draw a guitar on the canvas with basic shapes and have the user be able to "pluck" the strings by holding down the left mouse button. The frequency of the oscillations will be based on how hard the user plucks the string (how far away they release it). The user will also be able to "strum" the guitar by swiping the mouse through all the strings with the left mouse button down.

> Planning on adding sound as a stretch goal and for the user to be able to strum different chords.

------------------------------------

## Requirements

### A. Overall Theme/Impact

#### Theme

The app has a clear aesthetic theme from the moment it is first opened. The site has a minimalist philosophy behind its design, removing any unnecessary text or extra controls. The focus of the page(the guitar) is front and center and starkly highlighted by the color contrast between the black background and the sky color. The black background doubles up not just as contrast for the guitar, but as a visual trick to make the page seem as if it is contained inside the body of the guitar.

#### Engagement

The app engages both the visual and auditory senses. The visual “wow” factor comes from the waviness of the guitar’s simulated “rolling shutter effect” on the strings. This was the main focal point of the application from the very beginning and, as such, it went through much polishing to make it as visually  pleasant as possible. The auditory side of the application comes in the form of ambient sound effects that play as soon as the user enters the page, and the sound the user produces by plucking the strings. The ambient sounds can be turned off if they seem bothersome by adjusting the volume sliders or by selecting the “none” ambience from the “Ambience” dropdown menu(this will also color the sky white).

### B. User Experience

The application is self-explanatory at first glance and the controls are intuitive as they mimic real life. The guitar strings can be plucked individually by tugging on them like a real guitar and they can be strummed by swiping your mouse across them while holding the left mouse button. The amount of UI controls is also kept at a minimum, so the user is not overwhelmed. Short instructions are provided on how to use the application just in case.

Advanced controls are also provided and explained with instructions on the page. These allow for fretting different notes on the guitar and plucking the strings with the keyboard. Users can press all the way up to the 12th fret of each string, and the keys are all bound along the top numbers of the keyboard as well as the '-' and '=' keys.

To improve usability, a “Coyote Time” window has been added to the release of the frets. This is a concept borrowed from game design and it means that the pitch of the note will not instantly reset back to the open string. A very small window equaling fractions of a second is given where the user can pluck the string and it will still be the note they fretted. This makes it much easier to fret different notes continuously back to back as it aligns more closely with human reaction speeds and our expectations. It greatly reduces the chances that the user will release the fret button before they actually pluck the string, accidentally playing the open note instead.

All known errors have been taken care of throughout development and a strong visual aesthetic was created from very early on in development.

### C. Media

#### Embedded Fonts

[Cinzel](https://fonts.google.com/specimen/Cinzel) by Natanael Gama

[Fauna One](https://fonts.google.com/specimen/Fauna+One) by Eduardo Tunni

### D. Code

#### Above and Beyond

The application uses a few functionalities that have not been covered in class and a lot of concepts that draw from knowledge outside of this course:
1.	Mainly the extended use of sound. Through the external sound library [Tone.js](https://tonejs.github.io/)
2. Working with Tone.js required a small amount of knowledge about asynchronous JavaScript as well.
As illustrated by the following lines of code from `ambience.js`:
``` javascript
        // Async promise of when a new sound is loaded
        let loadPromise;
        if (sounds[ambienceState])
            loadPromise = ambiencePlayer.load(sounds[ambienceState]);
        // Restart player when a new sound has been loaded
        if (loadPromise)
            loadPromise.then(_ => { ambiencePlayer.start() });
```
3. Also beyond what has been covered in class is the extended use of JavaScript class syntax in the code.
4. I also made use of local storage to store users’ control settings between sessions. When a user closes the browser or goes to another site and comes back later, their volume sliders as well as their ambience and instrument selections will be just as they left them.
5. A small 2D Vector library was also created for the purposes of this project and future ones. It contains many of the common useful operations such as the dot product and it can perform vector transformations.

------------------------------------

## What went right & what went wrong

### Right

The pacing I took throughout the project really worked well for me. I had a few days of extensive progress and productivity between several days of slow but constant developments. Every other day I would push myself to add or polish something, no matter how small it was. During some of these work sessions, strokes of inspiration would take over me and in a short time I would develop major parts of the application in one sitting.

### Wrong

Because I took on the challenge of learning and implementing an external library(Tone.js) during the timespan of the project, a lot of bugs and errors came up as I was developing the app. Through extensive testing(both by me and external testing) I managed to fix and polish all the errors encountered.

The rest of the things I wish would have gonne better for the project can be found in the following Wishlist of Features section [below](#Wishlist-of-Features).

### Wishlist of Features

The only feature that ended up not being implemented was the ability to strum chords by simply holding the chord name on the keyboard. For example, holding down the 'G' key would allow the user to pluck at the strings and they would play a standard open G major chord. Different button combinations were meant to modify these chords and expand the repertoire of possible chords that could be played further by simply holding down a few keys. Holding down Shift would sharpen the current chord held, Control would flatten it. Holding Alt would play the minor version of the chord. So holding down F+Alt would get the guitar to play an F minor chord. Holding down the number 7 at the top would play a 7th chord, holding down 9, 11, 13, etc. would have a similar effect. There were a few reasons this was ultimately not implemented, but the two biggest are:
1. (Time constraints) All of these chord shapes would have to be saved in some sort of chord compendium object and they would have had to be typed manually, or taken a lot more code to write so that the computer figures out the notes contained in them and where to fret them in the guitar. And with 7 different note names, each with their own sharp and flat versions which must then be multiplied by two to account for the minor versions, the count is sitting at 7 x 2 x 2 = 28. Each chord would also contain 6 notes, one fretted at each string. And without counting the 7th, 9th, 11th, 13th chords, etc. there are already 28 x 6 = 168 notes to take care of.
2. (Complicated Controls/Button Combinations) Adding this feature would deal a massive blow to the minimalist philosophy the app and the site in general is going for. Asking the user to study huge charts of different chords and their combinations on the keyboard is not the most usable approach. Not to mention some of these combinations would(at the end of the day) even be difficult to pull off with one hand. Such as Am7 which would require holding the 'A' key, Alt, and the number 7 at the top.

Another aspect that could have been improved is the scalability of the page itself. I could have made the canvas elements use a more "responsive design" type of sizing and made it look nice on smaller screens and especially in portrait oriented-screens(like smartphones). As it stands, the site is not optimized for smartphone usage.

------------------------------------

## Citations

Tone.js (External sound library) - 
https://tonejs.github.io/

Morning Country Ambience with Birds by freesfx.co - 
https://www.freesfx.co.uk/sfx/morning

"Outdoor Nighttime Ambience.wav" by TaXMaNFoReVeR of freesound.org - 
https://freesound.org/people/TaXMaNFoReVeR/sounds/325426/

"Rain, Moderate, B.wav" by InspectorJ (www.jshaw.co.uk) of freesound.org - 
https://freesound.org/people/InspectorJ/sounds/401276/

Acoustic Guitar Sample Pack by BIOCHRON - https://soundpacks.com/free-sound-packs/acoustic-guitar-sample-pack/

Range Mapping Function - 
https://stackoverflow.com/questions/5649803/remap-or-map-function-in-javascript
``` javascript
        map_range(value, min1, max1, min2, max2) {
            return min2 + (max2 - min2) * (value - min1) / (max1 - min1);
        }
```

------------------------------------

## Log

|  Date   | Description                                                                                          |
|:-------:|------------------------------------------------------------------------------------------------------|
| 9/8/20  | Created repo                                                                                         |
| 9/10/20 | Worked on libraries externally                                                                       |
| 9/13/20 | Added libraries                                                                                      |
| 9/14/20 | Created guitar and plucking functionality                                                            |
| 9/15/20 | Implemented rolling shutter effect                                                                   |
| 9/16/20 | Added sounds, keyboard support, instructions, and some controls                                      |
| 9/17/20 | Improved styles & added the all-important favicon                                                    |
| 9/20/20 | Created background color interpolation & added falling raindrops                                     |
| 9/21/20 | Added coyote time to fretting & saving controls preferences                                          |
| 9/22/20 | Fixed volume sliders, made ambience audios fade between each other & created acoustic guitar sampler |
| 9/23/20 | Finished documentation & recorded demo reel                                                          |
