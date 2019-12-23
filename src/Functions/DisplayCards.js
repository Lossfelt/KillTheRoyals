import React from "react";

export function displayCards(deck) {
  var viseKort = [];

  deck.forEach(element => {
    viseKort.push(<div className="kort">{element.Picture}</div>);
  });

  //console.log(viseKort)
  return <div>{viseKort}</div>;
}

//Denne funksjonen tror jeg ikke brukes noe sted, må sjekkes.
