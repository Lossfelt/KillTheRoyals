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
      20
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
  const allRoyals = []; //list of all the royals
  let armorCanBePlaced = true;
  allRoyals.forEach(royal => {
    if(currentRoyal !== royal) {
      
    }
  })
}