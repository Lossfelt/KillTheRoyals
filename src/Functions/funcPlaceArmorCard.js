export function placeArmorCard(hvilkenKnapp) {
  let sub = this;
  if (
    this.state.deck[0].value < 10 &&
    this.state.cardsInPlay[hvilkenKnapp][0].picture === "\u{1F0F1}" &&
    this.state.cardsInPlay[hvilkenKnapp.replace("Armor", "Royal")][0]
      .picture !== "\u{1F0F1}" &&
    this.state.cardsInPlay[hvilkenKnapp.replace("Armor", "Royal")][0]
      .picture !== "\u{1F0A0}" &&
    this.state.deck[0].value +
    this.state.cardsInPlay[hvilkenKnapp.replace("Armor", "Royal")][0].value <=
    20 && checkArmorElegibility(hvilkenKnapp, sub) === true
  ) {
    var kortstokk = this.state.deck;
    var bunke = this.state.cardsInPlay[hvilkenKnapp];
    var kort = kortstokk.shift();
    bunke.unshift(kort);
    this.setState({ deck: kortstokk });
    this.setState({ hvilkenKnapp: bunke });
  }
}
//denne virker ikke. Hvis du har en knekt av feil suit og en dame av riktig suit, så vil ingen være gyldig da den ikke setter noe krav høyere enn det andre.
function checkArmorElegibility(hvilkenKnapp, sub) {
  let currentRoyal = hvilkenKnapp.replace("Armor", "Royal");
  let isElegible = true;
  const allRoyals = ["upperLeftRoyal", "upperMiddleRoyal", "upperRightRoyal",
    "leftUpperRoyal", "leftMiddleRoyal", "leftBottomRoyal",
    "rightUpperRoyal", "rightMiddleRoyal", "rightBottomRoyal",
    "bottomLeftRoyal", "bottomMiddleRoyal", "bottomRightRoyal"];
  allRoyals.forEach(royal => {
    if (currentRoyal !== royal) {
      if (sub.state.cardsInPlay[royal][0] !== "\u{1F0F1}" && sub.state.cardsInPlay[royal][0] !== "\u{1F0A0}") {
        if (sub.state.cardsInPlay[currentRoyal][0].value > sub.state.cardsInPlay[royal][0].value) {
          isElegible = false;
        } else if (sub.state.cardsInPlay[royal][0].suit === sub.state.deck[0].suit &&
          sub.state.cardsInPlay[currentRoyal][0].suit !== sub.state.deck[0].suit) {
          isElegible = false;
        } else if (sub.state.cardsInPlay[royal][0].color === sub.state.deck[0].color &&
          sub.state.cardsInPlay[currentRoyal][0].color !== sub.state.deck[0].color) {
          isElegible = false;
        }
      }
    }
  })
  return isElegible;
}