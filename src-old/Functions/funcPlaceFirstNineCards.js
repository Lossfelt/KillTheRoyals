export function placeFirstNineCards() {
    let kortstokk = this.state.deck;
    let leftUpperBunke = this.state.cardsInPlay.leftUpper;
    let middleUpperBunke = this.state.cardsInPlay.middleUpper;
    let rightUpperBunke = this.state.cardsInPlay.rightUpper;
    let leftMiddleBunke = this.state.cardsInPlay.leftMiddle;
    let middleMiddleBunke = this.state.cardsInPlay.middleMiddle;
    let rightMiddleBunke = this.state.cardsInPlay.rightMiddle;
    let leftBottomBunke = this.state.cardsInPlay.leftBottom;
    let middleBottomBunke = this.state.cardsInPlay.middleBottom;
    let rightBottomBunke = this.state.cardsInPlay.rightBottom;
    let royalsToBePlacedBunke = this.state.cardsInPlay.royalsToBePlaced;
    let placeholder = royalsToBePlacedBunke.pop();
    let kort = {};
    const gridPositions = [leftUpperBunke, middleUpperBunke, rightUpperBunke,
        leftMiddleBunke, middleMiddleBunke, rightMiddleBunke,
        leftBottomBunke, middleBottomBunke, rightBottomBunke];
        
    gridPositions.forEach(position => {
        while (position.length < 2) {
            if (kortstokk[0].value < 11) {
                kort = kortstokk.shift();
                position.unshift(kort);
            } else if (kortstokk[0].value > 10 || 
                kortstokk[0].value === "A" || 
                kortstokk[0].value === "Joker") {
                kort = kortstokk.shift();
                royalsToBePlacedBunke.push(kort);
            }
        }
    })

    royalsToBePlacedBunke.push(placeholder);
    this.setState({
        deck: kortstokk,
        leftUpper: leftUpperBunke,
        middleUpper: middleUpperBunke,
        rightUpper: rightUpperBunke,
        leftMiddle: leftMiddleBunke,
        middleMiddle: middleMiddleBunke,
        rightMiddle: rightMiddleBunke,
        leftBottom: leftBottomBunke,
        middleBottom: middleBottomBunke,
        rightBottom: rightBottomBunke,
        royalsToBePlaced: royalsToBePlacedBunke
    })
}