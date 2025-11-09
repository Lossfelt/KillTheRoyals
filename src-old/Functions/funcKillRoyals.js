export function killRoyals(hvilkenKnapp) {
  let card1 = {};
  let card2 = {};
  let royal1 = {};
  let armor1 = {};
  let hvilkenRoyalBunke1 = "";
  let card3 = {};
  let card4 = {};
  let royal2 = {};
  let armor2 = {};
  let hvilkenRoyalBunke2 = "";
  let sub = this;

  if (hvilkenKnapp === "leftUpper") {
    card1 = this.state.cardsInPlay.middleUpper[0];
    card2 = this.state.cardsInPlay.rightUpper[0];
    royal1 = this.state.cardsInPlay.rightUpperRoyal[0];
    armor1 = this.state.cardsInPlay.rightUpperArmor[0];
    hvilkenRoyalBunke1 = "rightUpperRoyal";
    doTheKilling(card1, card2, royal1, armor1, hvilkenRoyalBunke1, sub);
    card3 = this.state.cardsInPlay.leftMiddle[0];
    card4 = this.state.cardsInPlay.leftBottom[0];
    royal2 = this.state.cardsInPlay.bottomLeftRoyal[0];
    armor2 = this.state.cardsInPlay.bottomLeftArmor[0];
    hvilkenRoyalBunke2 = "bottomLeftRoyal";
    doTheKilling(card3, card4, royal2, armor2, hvilkenRoyalBunke2, sub);
  } else if (hvilkenKnapp === "middleUpper") {
    card1 = this.state.cardsInPlay.middleMiddle[0];
    card2 = this.state.cardsInPlay.middleBottom[0];
    royal1 = this.state.cardsInPlay.bottomMiddleRoyal[0];
    armor1 = this.state.cardsInPlay.bottomMiddleArmor[0];
    hvilkenRoyalBunke1 = "bottomMiddleRoyal";
    doTheKilling(card1, card2, royal1, armor1, hvilkenRoyalBunke1, sub);
  } else if (hvilkenKnapp === "rightUpper") {
    card1 = this.state.cardsInPlay.middleUpper[0];
    card2 = this.state.cardsInPlay.leftUpper[0];
    royal1 = this.state.cardsInPlay.leftUpperRoyal[0];
    armor1 = this.state.cardsInPlay.leftUpperArmor[0];
    hvilkenRoyalBunke1 = "leftUpperRoyal";
    doTheKilling(card1, card2, royal1, armor1, hvilkenRoyalBunke1, sub);
    card3 = this.state.cardsInPlay.rightMiddle[0];
    card4 = this.state.cardsInPlay.rightBottom[0];
    royal2 = this.state.cardsInPlay.bottomRightRoyal[0];
    armor2 = this.state.cardsInPlay.bottomRightArmor[0];
    hvilkenRoyalBunke2 = "bottomRightRoyal";
    doTheKilling(card3, card4, royal2, armor2, hvilkenRoyalBunke2, sub);
  } else if (hvilkenKnapp === "leftMiddle") {
    card1 = this.state.cardsInPlay.middleMiddle[0];
    card2 = this.state.cardsInPlay.rightMiddle[0];
    royal1 = this.state.cardsInPlay.rightMiddleRoyal[0];
    armor1 = this.state.cardsInPlay.rightMiddleArmor[0];
    hvilkenRoyalBunke1 = "rightMiddleRoyal";
    doTheKilling(card1, card2, royal1, armor1, hvilkenRoyalBunke1, sub);
  } else if (hvilkenKnapp === "rightMiddle") {
    card1 = this.state.cardsInPlay.middleMiddle[0];
    card2 = this.state.cardsInPlay.leftMiddle[0];
    royal1 = this.state.cardsInPlay.leftMiddleRoyal[0];
    armor1 = this.state.cardsInPlay.leftMiddleArmor[0];
    hvilkenRoyalBunke1 = "leftMiddleRoyal";
    doTheKilling(card1, card2, royal1, armor1, hvilkenRoyalBunke1, sub);
  } else if (hvilkenKnapp === "leftBottom") {
    card1 = this.state.cardsInPlay.middleBottom[0];
    card2 = this.state.cardsInPlay.rightBottom[0];
    royal1 = this.state.cardsInPlay.rightBottomRoyal[0];
    armor1 = this.state.cardsInPlay.rightBottomArmor[0];
    hvilkenRoyalBunke1 = "rightBottomRoyal";
    doTheKilling(card1, card2, royal1, armor1, hvilkenRoyalBunke1, sub);
    card3 = this.state.cardsInPlay.leftMiddle[0];
    card4 = this.state.cardsInPlay.leftUpper[0];
    royal2 = this.state.cardsInPlay.upperLeftRoyal[0];
    armor2 = this.state.cardsInPlay.upperLeftArmor[0];
    hvilkenRoyalBunke2 = "upperLeftRoyal";
    doTheKilling(card3, card4, royal2, armor2, hvilkenRoyalBunke2, sub);
  } else if (hvilkenKnapp === "middleBottom") {
    card1 = this.state.cardsInPlay.middleMiddle[0];
    card2 = this.state.cardsInPlay.middleUpper[0];
    royal1 = this.state.cardsInPlay.upperMiddleRoyal[0];
    armor1 = this.state.cardsInPlay.upperMiddleArmor[0];
    hvilkenRoyalBunke1 = "upperMiddleRoyal";
    doTheKilling(card1, card2, royal1, armor1, hvilkenRoyalBunke1, sub);
  } else if (hvilkenKnapp === "rightBottom") {
    card1 = this.state.cardsInPlay.middleBottom[0];
    card2 = this.state.cardsInPlay.leftBottom[0];
    royal1 = this.state.cardsInPlay.leftBottomRoyal[0];
    armor1 = this.state.cardsInPlay.leftBottomArmor[0];
    hvilkenRoyalBunke1 = "leftBottomRoyal";
    doTheKilling(card1, card2, royal1, armor1, hvilkenRoyalBunke1, sub);
    card3 = this.state.cardsInPlay.rightMiddle[0];
    card4 = this.state.cardsInPlay.rightUpper[0];
    royal2 = this.state.cardsInPlay.upperRightRoyal[0];
    armor2 = this.state.cardsInPlay.upperRightArmor[0];
    hvilkenRoyalBunke2 = "upperRightRoyal";
    doTheKilling(card3, card4, royal2, armor2, hvilkenRoyalBunke2, sub);
  }
}

function doTheKilling(card1, card2, royal, armor, hvilkenRoyalBunke, sub) {
  let deadRoyal = { picture: "\u{1F0A0}" };
  let bunkenTilRoyal = sub.state.cardsInPlay[hvilkenRoyalBunke];

  if (royal.value === 13) {
    if (
      card1.value + card2.value >= royal.value + armor.value &&
      card1.suit === card2.suit &&
      card1.suit === royal.suit
    ) {
      bunkenTilRoyal.unshift(deadRoyal);
      sub.setState({ hvilkenRoyalBunke: bunkenTilRoyal });
      if (armor.picture !== "empty") {
        let actualArmor = hvilkenRoyalBunke.replace("Royal", "Armor");
        let actualArmorBunke = sub.state.cardsInPlay[actualArmor];
        actualArmorBunke.unshift(deadRoyal);
        sub.setState({ actualArmor: actualArmorBunke });
      }
    }
  } else if (royal.value === 12) {
    if (
      card1.value + card2.value >= royal.value + armor.value &&
      card1.color === card2.color &&
      card1.color === royal.color
    ) {
      bunkenTilRoyal.unshift(deadRoyal);
      sub.setState({ hvilkenRoyalBunke: bunkenTilRoyal });
      if (armor.picture !== "empty") {
        let actualArmor = hvilkenRoyalBunke.replace("Royal", "Armor");
        let actualArmorBunke = sub.state.cardsInPlay[actualArmor];
        actualArmorBunke.unshift(deadRoyal);
        sub.setState({ actualArmor: actualArmorBunke });
      }
    }
  } else if (royal.value === 11) {
    if (card1.value + card2.value >= royal.value + armor.value) {
      bunkenTilRoyal.unshift(deadRoyal);
      sub.setState({ hvilkenRoyalBunke: bunkenTilRoyal });
      if (armor.picture !== "empty") {
        let actualArmor = hvilkenRoyalBunke.replace("Royal", "Armor");
        let actualArmorBunke = sub.state.cardsInPlay[actualArmor];
        actualArmorBunke.unshift(deadRoyal);
        sub.setState({ actualArmor: actualArmorBunke });
      }
    }
  }
}
