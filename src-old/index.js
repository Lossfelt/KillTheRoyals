import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import Main from "./Components/Main";

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
/*
TODO
-----------------------------------------
cycleDeckForRoyal should work now, also if Joker or Ace on top of deck when no royals
Enable possibility to "undo" joker- and ace-usage
Make function to enforce correct royal-placement
Make funcCheckIfGameWon display a win-message
Create function to display message if you lost the game
Disable placement and usage of cards when all royals are dead
Make a restart-button so you don't have to reload the site to start again
Change all buttons to just be <div>'s with onClick
Remove all bottom-placeholder-cards and replace with unicode shield or crown, or letters A or J
Clean up grid and add pictures/colors to show where different cards are to be placed
Ensure other cards can't be placed when using joker or ace
Change stack-length number from static to onHover
Enable an undo-function (make an array with the state of every turn)
Possibly move deck, joker and ace row to the left side?
*/
