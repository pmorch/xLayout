xLayout
=======

## What is this for

This is a jQuery plugin for laying out pages

This was borne out of the need to accomplish the following: I want to have 3
divs, that have heights like this pseudocode:

    <div id="div1" style="height: 100px">bla</div>
    <div id="div2" style="height: $(window).outerHeight(true) - 200px">bla</div>
    <div id="div3" style="height: 100px">bla</div>


I want to have 3 divs, the first and the last being 100px high, and the middle one filling up "the remainder". I don't know of any way to do this without javascript that works in all browsers.

## Demo

`./layout.html` has an example of how it is used.

## Browser support

Works in at least IE8+, Chrome and Firefox and tested on Safari for iPad too.

## Other projects

There are perhaps other projects of this kind that solve the same problem.
Patches/links welcome! :-)
