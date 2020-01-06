export function cycleDeckForRoyal() {
    let kortstokk = this.state.deck;
    let sub = this;
    if ((kortstokk[0].value < 11 ||
        kortstokk[0].value === "Joker" || 
        kortstokk[0].value === "A") &&
        this.state.cardsInPlay.royalsToBePlaced.length <= 1) {
        let cycleDeck = true;
        const allRoyals = ["upperLeftRoyal", "upperMiddleRoyal", "upperRightRoyal",
            "leftUpperRoyal", "leftMiddleRoyal", "leftBottomRoyal",
            "rightUpperRoyal", "rightMiddleRoyal", "rightBottomRoyal",
            "bottomLeftRoyal", "bottomMiddleRoyal", "bottomRightRoyal"]

        allRoyals.forEach(royal => {
            if (this.state.cardsInPlay[royal][0].picture !== "\u{1F0F1}" &&
                this.state.cardsInPlay[royal][0].picture !== "\u{1F0A0}") {
                cycleDeck = false;
            }
        })
        if (cycleDeck) {
            actuallyCycleTheDeck(sub, kortstokk);
        }
    }
}

function actuallyCycleTheDeck(sub, kortstokk){
        let placeholder = kortstokk.pop();
        let cycling = true;
        while (cycling) {
            let kort = kortstokk.shift();
            kortstokk.push(kort);
            if (kortstokk[0].value >= 11 &&
                kortstokk[0].value <= 13) {
                cycling = false;
                kortstokk.push(placeholder);
                sub.setState({ deck: kortstokk })
            }
        }
}