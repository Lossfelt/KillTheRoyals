export function placeRoyalCard(hvilkenKnapp) {
  if (this.state.cardsInPlay.royalsToBePlaced[0].value >= 11 && 
    this.state.cardsInPlay.royalsToBePlaced[0].value <= 13 &&
    this.state.cardsInPlay[hvilkenKnapp][0].picture === "empty") {
      let royalsToBePlacedBunke = this.state.cardsInPlay.royalsToBePlaced;
      let bunke = this.state.cardsInPlay[hvilkenKnapp];
      let kort = royalsToBePlacedBunke.shift();
      bunke.unshift(kort);
      this.setState({
        royalsToBePlaced: royalsToBePlacedBunke,
        hvilkenKnapp: bunke
      })
    }
  else if (
    this.state.deck[0].value > 10 &&
    this.state.cardsInPlay[hvilkenKnapp][0].picture === "empty"
  ) {
    var kortstokk = this.state.deck;
    var bunke = this.state.cardsInPlay[hvilkenKnapp];
    var kort = kortstokk.shift();
    bunke.unshift(kort);
    this.setState({ deck: kortstokk });
    this.setState({ hvilkenKnapp: bunke });
  }
}
