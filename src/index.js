import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import Main from "./Components/Main";

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
/*
TODO
-----------------------------------------
cycleDeckForRoyal not working, debug
Ensure cycleDeck doesn't break the game when all royals are dead
Make function to enforce correct royal-placement
Hide startup-royal-button when not in use
Make a function to check if all royals are dead and the game is won
Make a function that lets you replace one card after the first nine have been placed
Change all buttons to just be <div>'s with onClick
Ensure other cards can't be placed when using joker or ace
Enable an undo-function (make an array with the state of every turn)
Possibly move deck, joker and ace row to the left side?
Do I need the startup-phase variable?
*/
