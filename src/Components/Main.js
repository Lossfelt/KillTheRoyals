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
import { placeFirstNineCards } from "../Functions/funcPlaceFirstNineCards";
import { cycleDeckForRoyal } from "../Functions/funcCycleDeckForRoyal";
import { replaceOneCard } from "../Functions/funcReplaceOneCard";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: shuffleDeck(createDeck()),
      jokerInUse: "none",
      jokerInUseBunkeNr1: "none",
      aceInUse: "none",
      checkForDeadRoyals: "none",
      isSetupPhase: true,
      setupPhaseStackToBeReplaced: "none",
      cardsInPlay: {
        leftUpper: [{ value: 0, suit: "", picture: "empty", color: "" }],
        middleUpper: [{ value: 0, suit: "", picture: "empty", color: "" }],
        rightUpper: [{ value: 0, suit: "", picture: "empty", color: "" }],
        leftMiddle: [{ value: 0, suit: "", picture: "empty", color: "" }],
        middleMiddle: [{ value: 0, suit: "", picture: "empty", color: "" }],
        rightMiddle: [{ value: 0, suit: "", picture: "empty", color: "" }],
        leftBottom: [{ value: 0, suit: "", picture: "empty", color: "" }],
        middleBottom: [{ value: 0, suit: "", picture: "empty", color: "" }],
        rightBottom: [{ value: 0, suit: "", picture: "empty", color: "" }],
        upperLeftRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        upperMiddleRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        upperRightRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        leftUpperRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        leftMiddleRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        leftBottomRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        rightUpperRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        rightMiddleRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        rightBottomRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        bottomLeftRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        bottomMiddleRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        bottomRightRoyal: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        upperLeftArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        upperMiddleArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        upperRightArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        leftUpperArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        leftMiddleArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        leftBottomArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        rightUpperArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        rightMiddleArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        rightBottomArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        bottomLeftArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        bottomMiddleArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        bottomRightArmor: [
          { value: 0, suit: "", picture: "empty", color: "" }
        ],
        joker1: [{ value: 0, suit: "", picture: "empty", color: "" }],
        joker2: [{ value: 0, suit: "", picture: "empty", color: "" }],
        ace1: [{ value: 0, suit: "", picture: "empty", color: "" }],
        ace2: [{ value: 0, suit: "", picture: "empty", color: "" }],
        ace3: [{ value: 0, suit: "", picture: "empty", color: "" }],
        ace4: [{ value: 0, suit: "", picture: "empty", color: "" }],
        royalsToBePlaced: [{ value: 0, suit: "", picture: "empty", color: "" }]
      }
    };
    this.placeNormalCard = placeNormalCard.bind(this);
    this.placeRoyalCard = placeRoyalCard.bind(this);
    this.placeArmorCard = placeArmorCard.bind(this);
    this.placeJoker = placeJoker.bind(this);
    this.placeAce = placeAce.bind(this);
    this.killRoyals = killRoyals.bind(this);
    this.placeFirstNineCards = placeFirstNineCards.bind(this);
    this.cycleDeckForRoyal = cycleDeckForRoyal.bind(this);
    this.replaceOneCard = replaceOneCard.bind(this);
    this.replaceOrNot = this.replaceOrNot.bind(this);
  }

  componentDidMount() {
    this.placeFirstNineCards();
  }

  componentDidUpdate() {
    if (this.state.checkForDeadRoyals !== "none") {
      let spotToBeChecked = this.state.checkForDeadRoyals;
      this.setState({ checkForDeadRoyals: "none" });
      this.killRoyals(spotToBeChecked);
    }
    this.cycleDeckForRoyal();
  }

  replaceOrNot(e) {
    this.replaceOneCard(e.target.id);
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
        <div className={this.state.isSetupPhase &&
          this.state.setupPhaseStackToBeReplaced === "none" &&
          this.state.cardsInPlay.royalsToBePlaced.length <= 1 ? "replaceOneCardBox" : "contenthidden"}>
          <h5>Do you want to replace one number-card?</h5>
          <div id="yes" className="yes" onClick={this.replaceOrNot}>Yes</div>
          <div />
          <div id="no" className="no" onClick={this.replaceOrNot}>No</div>
        </div>
      </div>
    );
  }
}

export default Main;
