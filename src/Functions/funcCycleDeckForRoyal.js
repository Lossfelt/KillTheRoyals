export function cycleDeckForRoyal() {
    let kortstokk = this.state.deck;

    if (kortstokk[0].value < 11 &&
        kortstokk[0].value > 13 &&
        this.state.cardsInPlay.royalsToBePlaced.length <= 1) {
        let cycleDeck = true;
        const allRoyals = ["upperLeftRoyal", "upperMiddleRoyal", "upperRightRoyal",
            "leftUpperRoyal", "leftMiddleRoyal", "leftBottomRoyal",
            "rightUpperRoyal", "rightMiddleRoyal", "rightBottomRoyal",
            "bottomLeftRoyal", "bottomMiddleRoyal", "bottomRightRoyal"]

        allRoyals.forEach(royal => {
            if (this.state.cardsInPlay[royal].picture !== "\u{1F0F1}" &&
                this.state.cardsInPlay[royal].picture !== "\u{1F0A0}") {
                cycleDeck = false;
            }
        })

        let placeholder = kortstokk.pop();
        while (cycleDeck) {
            let kort = kortstokk.shift();
            kortstokk.push(kort);
            if (kortstokk[0].value >= 11 &&
                kortstokk[0].value <= 13) {
                cycleDeck = false;
            }
        }
        kortstokk.push(placeholder);
        this.setState({deck: kortstokk})
    }

}