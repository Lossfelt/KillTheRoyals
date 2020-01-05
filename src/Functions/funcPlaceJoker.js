export function placeJoker(hvilkenKnapp) {
  let kortstokk = this.state.deck;
  let bunke = this.state.cardsInPlay[hvilkenKnapp];
  let kort = {};
  if (this.state.cardsInPlay.royalsToBePlaced[0].value === "Joker" && 
  this.state.cardsInPlay[hvilkenKnapp][0].picture === "\u{1F0F1}") {
    let royalsToBePlacedBunke = this.state.cardsInPlay.royalsToBePlaced
    kort = royalsToBePlacedBunke.shift();
    bunke.unshift(kort);
    this.setState({
      royalsToBePlaced: royalsToBePlacedBunke,
      hvilkenKnapp: bunke
    })
  }
  else if (
    this.state.cardsInPlay[hvilkenKnapp][0].value === "Joker" &&
    this.state.jokerInUse === "none"
  ) {
    this.setState({ jokerInUse: hvilkenKnapp });
  } else if (
    this.state.deck[0].value === "Joker" &&
    this.state.cardsInPlay[hvilkenKnapp][0].picture === "\u{1F0F1}"
  ) {
    kort = kortstokk.shift();
    bunke.unshift(kort);
    this.setState({ deck: kortstokk });
    this.setState({ hvilkenKnapp: bunke });
  }
}
