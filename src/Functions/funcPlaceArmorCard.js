export function placeArmorCard(hvilkenKnapp) {
  if (
    this.state.deck[0].value < 10 &&
    this.state.cardsInPlay[hvilkenKnapp][0].picture === "\u{1F0F1}" &&
    this.state.cardsInPlay[hvilkenKnapp.replace("Armor", "Royal")][0]
      .picture !== "\u{1F0F1}" &&
    this.state.cardsInPlay[hvilkenKnapp.replace("Armor", "Royal")][0]
      .picture !== "\u{1F0A0}" &&
    this.state.deck[0].value +
    this.state.cardsInPlay[hvilkenKnapp.replace("Armor", "Royal")][0].value <=
    20 && checkArmorElegibility(hvilkenKnapp)
  ) {
    var kortstokk = this.state.deck;
    var bunke = this.state.cardsInPlay[hvilkenKnapp];
    var kort = kortstokk.shift();
    bunke.unshift(kort);
    this.setState({ deck: kortstokk });
    this.setState({ hvilkenKnapp: bunke });
  }
}

function checkArmorElegibility(currentRoyal) {
  const allRoyals = ["upperLeftRoyal", "upperMiddleRoyal", "upperRightRoyal",
    "leftUpperRoyal", "leftMiddleRoyal", "leftBottomRoyal",
    "rightUpperRoyal", "rightMiddleRoyal", "rightBottomRoyal",
    "bottomLeftRoyal", "bottomMiddleRoyal", "bottomRightRoyal"];
  allRoyals.forEach(royal => {
    if (currentRoyal !== royal) {
      if (this.state.cardsInPlay[royal][0] !== "\u{1F0F1}" && this.state.cardsInPlay[royal][0] !== "\u{1F0A0}") {
        if (this.state.cardsInPlay[currentRoyal][0].value > this.state.cardsInPlay[royal][0].value) {
          return false;
        } else if (this.state.cardsInPlay[royal][0].suit === this.state.deck[0].suit &&
          this.state.cardsInPlay[currentRoyal][0].suit !== this.state.deck[0].suit) {
          return false;
        } else if (this.state.cardsInPlay[royal][0].color === this.state.deck[0].color &&
          this.state.cardsInPlay[currentRoyal][0].color !== this.state.deck[0].color) {
          return false;
        }
      }
    }
  })
  return true;
}