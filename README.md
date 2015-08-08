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

On clicking Eval or Apply, the value in the... match input box, well the top of the two boxes, anyway, will either be assigned the last value result of the formula (if it's a number), or be assigned the color specified in the second box (if the final result is a boolean, instead).


####stacky.js

This is a very simple stack-based language.

Imagine all the tokens (delimited by a space) as individual elements in a stack.  Those elements consist of either a *number* or a *function*.  Operators are also considered functions.  On evaluation, elements, starting from the right side, will be pushed onto another stack, and every time a function or operator is pushed, that function will be called with the stack as a parameter, allowing for use of elements already in the second stack within the function, and the popping of those elements off the stack.  The only remaining value in the stack is the result of the function, in its place.  Then the popping off the original stack onto the second continues until is met the next function.

A few examples...

```
+ 3 6
< 1 2
< 3 - 4 2
```

The first would result in 9.  Push the 6, then the 3, and when the function is hit (+), it is called, using 3 and 6 to end with 9.

The second would result in _true_, pushing 2 and 1 and comparing with '<' (I believe I ordered it so the written equivalent would still be 1 < 2, rather than 2 < 1).

The third would result in _false_, because 4 and 2 are passed to the subtraction function (-), resulting in 2, which is now the only number on the second stack.  Then 3 is pushed, and finally '<', which is run using 3 and 2, and since 3 is greater than 2, not less that, _false_.

All functions/operators native to *stacky.js*:
- print (string)
- ceil (number)
- floor (number)
- logb (base, number)
- '+' (number, number)
- '-' (number, number)
- '*' (number, number)
- '/' (number, number)
- '%' (number, number)
- '<' (number, number)
- '<=' (number, number)
- '>' (number, number)
- '>=' (number, number)
- '=' (number, number)
- '&' (boolean, boolean)
- '|' (boolean, boolean)

All mods.html functions/operators evaluated through stacky.js' interpreter ability:
- a : current row
- b : current column
- c : current value
- n : current... node's string value?
- @ (number, number) : value of cell i,j or x,y, or row,col or something

```
+ c @ - a 1 b
```
The above ought result in the addition of the current mod value to that of the cell one above.  Imagine it as "(c + @(a -1, b))".  Play around with it.

