# Project 1 Documentation

## Contents

[Discussion Post](#Discussion-Post)

[Requirements](#Requirements)

[Above and Beyond](#Above-and-Beyond)

[What went right & wrong](#What-went-right-&-what-went-wrong)

[Wishlist of Features](#Wishlist-of-Features)

[Citations](#Citations)

[Log](#Log)

------------------------------------

## Discussion Post
I don't think periodic functions are going to get a lot of love so I want to make my Project 1 expand on that. I am planning on simulating guitar strings' "rolling shutter effect", the weird wobble they get when recorded on camera. I am going to draw a guitar on the canvas with basic shapes and have the user be able to "pluck" the strings by holding down the left mouse button. The frequency of the oscillations will be based on how hard the user plucks the string (how far away they release it). The user will also be able to "strum" the guitar by swiping the mouse through all the strings with the left mouse button down.

Planning on adding sound as a stretch goal and for the user to be able to strum different chords.

------------------------------------

## Requirements

### A. Overall Theme/Impact

### B. User Experience

### C. Media

### D. Code

------------------------------------

## Above and Beyond

------------------------------------

## What went right & what went wrong

------------------------------------

## Wishlist of Features

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

Range Mapping Function - 
https://stackoverflow.com/questions/5649803/remap-or-map-function-in-javascript
```javascript
        map_range(value, min1, max1, min2, max2) {
            return min2 + (max2 - min2) * (value - min1) / (max1 - min1);
        }
```

------------------------------------

## Log
|   Date   | Description                               |
|  :----:  | -----------                               |
|  9/8/20  | Created repo                              |
|  9/10/20 | Worked on libraries externally            |
|  9/13/20 | Added libraries                           |
|  9/14/20 | Created guitar and plucking functionality |
|  9/15/20 | Implemented rolling shutter effect        |
|  9/16/20 | Added sounds and keyboard support. Also added instructions and some controls |
|  9/17/20 | Improved styles & added the all-important favicon |