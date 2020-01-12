export function placeNormalCard(hvilkenKnapp) {
  let kortstokk = this.state.deck;
  let bunke = this.state.cardsInPlay[hvilkenKnapp];
  let kort = {};
  let sisteKortIBunken = {};

  //This is the replacement of a card during setup
  if (this.state.setupPhaseStackToBeReplaced === "waiting") {
    sisteKortIBunken = kortstokk.pop();
    kort = bunke.shift();
    kortstokk.push(kort);
    while(kortstokk[0].value >= 11 || 
      kortstokk[0].value === "A" || 
      kortstokk[0].value === "Joker"){
        kortstokk.push(kortstokk.shift());
      }
      bunke.unshift(kortstokk.shift());
      kortstokk.push(sisteKortIBunken);
      this.setState({
        isSetupPhase: false,
        setupPhaseStackToBeReplaced: "none",
        deck: kortstokk,
        hvilkenKnapp: bunke
      });
    }

  //This is the use of jokers
  else if (
    this.state.jokerInUse !== "none" &&
    this.state.jokerInUseBunkeNr1 !== "none"
  ) {
    if (
      bunke[0].value <=
      this.state.cardsInPlay[this.state.jokerInUseBunkeNr1][0].value
    ) {
      let navnPaBunkenDetTasKortFra = this.state.jokerInUseBunkeNr1;
      let bunkenDetByttesFra = this.state.cardsInPlay[
        navnPaBunkenDetTasKortFra
      ];
      kort = bunkenDetByttesFra.shift();
      bunke.unshift(kort);
      let jokerSomBleBrukt = this.state.jokerInUse;
      let jokerBunken = this.state.cardsInPlay[jokerSomBleBrukt];
      jokerBunken.unshift({ picture: "\u{1F0A0}" });
      this.setState({
        hvilkenKnapp: bunke,
        navnPaBunkenDetTasKortFra: bunkenDetByttesFra,
        jokerSomBleBrukt: jokerBunken,
        jokerInUse: "none",
        jokerInUseBunkeNr1: "none",
        checkForDeadRoyals: hvilkenKnapp
      });
    }
  } else if (bunke.length > 1 && this.state.jokerInUse !== "none") {
    this.setState({ jokerInUseBunkeNr1: hvilkenKnapp });
  }

  //This is the use of aces
  else if (bunke.length > 1 && this.state.aceInUse !== "none") {
    this.setState({ aceInUse: "none" });
    sisteKortIBunken = bunke.pop();
    kortstokk.pop();
    while (bunke.length) {
      kort = bunke.pop();
      kortstokk.push(kort);
    }
    bunke.push(sisteKortIBunken);
    kortstokk.push(sisteKortIBunken);
    let hvilkenAce = this.state.aceInUse;
    let aceBunke = this.state.cardsInPlay[hvilkenAce];
    aceBunke.unshift({ picture: "\u{1F0A0}" });
    this.setState({
      deck: kortstokk,
      hvilkenKnapp: bunke,
      hvilkenAce: aceBunke
    });
  }

  //This is the normal placement of cards on the grid
  else if (
    this.state.deck.length > 1 && 
    this.state.cardsInPlay.royalsToBePlaced.length === 1 && 
    this.state.deck[0].value < 11 &&
    this.state.deck[0].value >= bunke[0].value
  ) {
    kort = kortstokk.shift();
    bunke.unshift(kort);
    this.setState({
      deck: kortstokk,
      hvilkenKnapp: bunke,
      checkForDeadRoyals: hvilkenKnapp
    });
  }
}
