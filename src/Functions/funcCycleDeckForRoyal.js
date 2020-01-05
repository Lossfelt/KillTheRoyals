export function cycleDeckForRoyal() {
    let kortstokk = this.state.deck;
console.log("cycleDeck ble kalt: " + kortstokk[0].value + " " + this.state.cardsInPlay.royalsToBePlaced.length)
    if (kortstokk[0].value < 11 &&
        kortstokk[0].value > 13 &&
        this.state.cardsInPlay.royalsToBePlaced.length <= 1) {
            console.log("cycleDeck begynte å kjøre")
        let cycleDeck = true;
        const allRoyals = ["upperLeftRoyal", "upperMiddleRoyal", "upperRightRoyal",
            "leftUpperRoyal", "leftMiddleRoyal", "leftBottomRoyal",
            "rightUpperRoyal", "rightMiddleRoyal", "rightBottomRoyal",
            "bottomLeftRoyal", "bottomMiddleRoyal", "bottomRightRoyal"]

        allRoyals.forEach(royal => {
            if (this.state.cardsInPlay[royal].picture !== "\u{1F0F1}" &&
                this.state.cardsInPlay[royal].picture !== "\u{1F0A0}") {
                cycleDeck = false;
                console.log("cycleDeck går gjennom royalsarray")
            }
        })
console.log("cycleDeck begynner på While-loop")
        let placeholder = kortstokk.pop();
        while (cycleDeck) {
            console.log("inni while-loop")
            let kort = kortstokk.shift();
            kortstokk.push(kort);
            if (kortstokk[0].value >= 11 &&
                kortstokk[0].value <= 13) {
                cycleDeck = false;
                console.log("cycleDeck fant en royal")
            }
        }
        kortstokk.push(placeholder);
        this.setState({deck: kortstokk})
        console.log("cycleDeck oppdaterte decken")
    }

}