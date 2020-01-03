import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import Main from "./Components/Main";

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
/*
TODO
-----------------------------------------
Put a placeholder-card on bottom of the deck and update counter -- maybe instead in createGrid do deck.length?deck.picture:\u{1F0F1}
- change Ace-use to ensure placeholder stays on bottom
- change normal placement so that you can't put placeholder on the grid
- change armor placement so you can't put the placeholder as armor
Make a function to place the first nine cards, as well as were royals can be put
- variable for whether one is in the startup phase, if so auto-place the first nine cards and collect royals found
- spot/button to put royals found until the first nine number-cards have been placed
- function to place the royal-cards found during startup
Make a function to cycle through cards to find a royal, if no other royals are in play
Make a function to check if all royals are dead and the game is won
Make a function that lets you replace one card after the first nine have been placed
Change all buttons to just be <div>'s with onClick
Change all placeholder-cards to instead be stack.length?stack[0].picture:\u{1F0F1}
Ensure other cards can't be placed when using joker or ace
Enable an undo-function (make an array with the state of every turn)
Possibly move deck, joker and ace row to the left side?
*/
