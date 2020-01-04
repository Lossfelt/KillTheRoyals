export function placeFirstNineCards() {
    const gridPositions = ["leftUpper", "middleUpper", "rightUpper",
        "leftMiddle", "middleMiddle", "rightMiddle",
        "leftBottom", "middleBottom", "rightBottom"];

    gridPositions.forEach(position => {
        while (this.state.cardsInPlay[position].length < 2) {
            let kortstokk = this.state.deck;
            let bunke = [];
            let kort = {};
            if (kortstokk[0].value < 11) {
                bunke = this.state.cardsInPlay[position]
                kort = kortstokk.shift();
                bunke.unshift(kort);
                this.setState({
                    deck: kortstokk,
                    position: bunke
                })
            } else if (kortstokk[0].value > 10) {
                bunke = this.state.cardsInPlay.royalsToBePlaced;
                let placeholder = bunke.pop();
                kort = kortstokk.shift();
                bunke.push(kort);
                bunke.push(placeholder);
                this.setState({
                    deck: kortstokk,
                    royalsToBePlaced: bunke
                })
            }
        }
    })

}