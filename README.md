modvisuals
==========

Pursuit in curiosity on the nature of modulus arithmetic.

===

Included is an html page with a visualization graph that isn't necessarily straightforward to use or understand.  I'll modify it eventually to include instructions over both the basics and the usage of stacky.js' little stack-based arithmetic language.

---

The top row of mods.html carries these input fields/buttons.
```
__1__ to __60__ [Eval] _% v[color-method] [Apply]  ...  [Scratchpad [<--] ]
```
The "1 to 60" is a range of sorts, but the first number ought remain 1, and the other can be whatever.

Eval button runs the supplied match command arithmetic and colors the squares appropriately.

Percentage simply shows percentage of completion, since more complex arithemtic on a greater quantity of squares can take a while running off stacked javascript functions.

Color-method dropdown contains several options.
- current base:
- top base: 
- green zeros:
- color matches:
- color multiples:
- color values:

Apply button runs the color command, again, but without re-rendering the squares, methinks (been a while).

Scratchpad bar opens a text area for writing and saving (locally, to browser LocalStorage) scratch notes, intended for assembling stacky formulae.

Arrow button within the Scratchpad bar, on clicking, will copy the line the text areaa's cursor is on to the _match_ field under the _color matches_ dropdown.

####stacky.js



