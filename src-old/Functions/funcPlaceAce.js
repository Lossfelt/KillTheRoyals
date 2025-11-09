export function placeAce(hvilkenKnapp) {
  let kortstokk = this.state.deck;
  let bunke = this.state.cardsInPlay[hvilkenKnapp];
  let kort = {};
  if (this.state.cardsInPlay.royalsToBePlaced[0].value === "A" && 
  this.state.cardsInPlay[hvilkenKnapp][0].picture === "empty") {
    let royalsToBePlacedBunke = this.state.cardsInPlay.royalsToBePlaced
    kort = royalsToBePlacedBunke.shift();
    bunke.unshift(kort);
    this.setState({
      royalsToBePlaced: royalsToBePlacedBunke,
      hvilkenKnapp: bunke
    })
  }
  else if (
    this.state.cardsInPlay[hvilkenKnapp][0].value === "A" &&
    this.state.aceInUse === "none"
  ) {
    this.setState({ aceInUse: hvilkenKnapp });
  } else if (
    this.state.deck[0].value === "A" &&
    this.state.cardsInPlay[hvilkenKnapp][0].picture === "empty"
  ) {
    kort = kortstokk.shift();
    bunke.unshift(kort);
    this.setState({ deck: kortstokk });
    this.setState({ hvilkenKnapp: bunke });
  }
}
