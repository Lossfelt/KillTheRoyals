import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import Main from "./Components/Main";

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
/*
TODO
-----------------------------------------
Update placeArmorCard with correct rules for placing armor, ie. that no other royal is more elegible and does not have armor already
Make a function to place the first nine cards, as well as were royals can be put
Make a function to cycle through cards to find a royal, if no other royals are in play
Make a function to check if all royals are dead and the game is won
Make a function that lets you replace one card after the first nine have been placed
Change all buttons to just be <div>'s with onClick
Ensure other cards can't be placed when using joker or ace
Enable an undo-function (make an array with the state of every turn)
Possibly move deck, joker and ace row to the left side?
*/
