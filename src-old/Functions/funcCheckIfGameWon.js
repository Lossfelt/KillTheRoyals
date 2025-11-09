export function checkIfGameWon(sub) {
    const allRoyals = ["upperLeftRoyal", "upperMiddleRoyal", "upperRightRoyal",
        "leftUpperRoyal", "leftMiddleRoyal", "leftBottomRoyal",
        "rightUpperRoyal", "rightMiddleRoyal", "rightBottomRoyal",
        "bottomLeftRoyal", "bottomMiddleRoyal", "bottomRightRoyal"];
    let stillAlive = false;

    allRoyals.forEach(royal => {
        if (sub.state.cardsInPlay[royal][0].picture !== "\u{1F0A0}") {
            stillAlive = true;
        }
    });

    return stillAlive;
}