import React from "react";
import CreateGrid from "./CreateGrid";
import About from "./About";
import { createDeck } from "../Functions/CreateDeck";
import { shuffleDeck } from "../Functions/shuffleDeck";
import { placeNormalCard } from "../Functions/funcPlaceNormalCard";
import { placeRoyalCard } from "../Functions/funcPlaceRoyalCard";
import { placeArmorCard } from "../Functions/funcPlaceArmorCard";
import { placeJoker } from "../Functions/funcPlaceJoker";
import { placeAce } from "../Functions/funcPlaceAce";
import { killRoyals } from "../Functions/funcKillRoyals";
import {placeFirstNineCards} from "../Functions/funcPlaceFirstNineCards";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: shuffleDeck(createDeck()),
      jokerInUse: "none",
      jokerInUseBunkeNr1: "none",
      aceInUse: "none",
      checkForDeadRoyals: "none",
      isSetupPhase: false, //not in use yet
      cardsInPlay: {
        leftUpper: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        middleUpper: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        rightUpper: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        leftMiddle: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        middleMiddle: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        rightMiddle: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        leftBottom: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        middleBottom: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        rightBottom: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        upperLeftRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        upperMiddleRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        upperRightRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        leftUpperRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        leftMiddleRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        leftBottomRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        rightUpperRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        rightMiddleRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        rightBottomRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        bottomLeftRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        bottomMiddleRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        bottomRightRoyal: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        upperLeftArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        upperMiddleArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        upperRightArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        leftUpperArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        leftMiddleArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        leftBottomArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        rightUpperArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        rightMiddleArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        rightBottomArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        bottomLeftArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        bottomMiddleArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        bottomRightArmor: [
          { value: 0, suit: "", picture: "\u{1F0F1}", color: "" }
        ],
        joker1: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        joker2: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        ace1: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        ace2: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        ace3: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        ace4: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }],
        royalsToBePlaced: [{ value: 0, suit: "", picture: "\u{1F0F1}", color: "" }]
      }
    };
    this.placeNormalCard = placeNormalCard.bind(this);
    this.placeRoyalCard = placeRoyalCard.bind(this);
    this.placeArmorCard = placeArmorCard.bind(this);
    this.placeJoker = placeJoker.bind(this);
    this.placeAce = placeAce.bind(this);
    this.killRoyals = killRoyals.bind(this);
    this.placeFirstNineCards = placeFirstNineCards.bind(this);
  }

  componentDidMount(){
    this.placeFirstNineCards();
  }

  componentDidUpdate(){
        if (this.state.checkForDeadRoyals !== "none") {
      let spotToBeChecked = this.state.checkForDeadRoyals;
      this.setState({ checkForDeadRoyals: "none" });
      this.killRoyals(spotToBeChecked);
    }
  }

  render() {
    return (
      <div className="Main">
        <About />
        <div className="centerTheGrid">
          <CreateGrid
            placeNormalCard={this.placeNormalCard}
            placeRoyalCard={this.placeRoyalCard}
            placeArmorCard={this.placeArmorCard}
            placeJoker={this.placeJoker}
            placeAce={this.placeAce}
            deck={this.state.deck}
            cardsInPlay={this.state.cardsInPlay}
            aceInUse={this.state.aceInUse}
            jokerInUse={this.state.jokerInUse}
            jokerInUseBunkeNr1={this.state.jokerInUseBunkeNr1}
          />
        </div>
      </div>
    );
  }
}

export default Main;
