import React from "react";
import { colorCard } from "../Functions/funcColorCard";
import {backgroundOrPicture} from "../Functions/funcBackgroundOrPicture";

class CreateGrid extends React.Component {
  constructor(props) {
    super(props);
    this.placeNormalCard = this.placeNormalCard.bind(this);
    this.placeRoyalCard = this.placeRoyalCard.bind(this);
    this.placeArmorCard = this.placeArmorCard.bind(this);
    this.placeJoker = this.placeJoker.bind(this);
    this.placeAce = this.placeAce.bind(this);
    this.colorCard = colorCard.bind(this);
    this.backgroundOrPicture = backgroundOrPicture.bind(this);
  }

  placeNormalCard(e) {
    this.props.placeNormalCard(e.target.id);
  }

  placeRoyalCard(e) {
    this.props.placeRoyalCard(e.target.id);
  }

  placeArmorCard(e) {
    this.props.placeArmorCard(e.target.id);
  }

  placeJoker(e) {
    this.props.placeJoker(e.target.id);
  }

  placeAce(e) {
    this.props.placeAce(e.target.id);
  }

  render() {
    return (
      <div className="grid">
        <div />
        <div />
        <div>
          <button
            className={this.colorCard("upperLeftArmor")}
            id="upperLeftArmor"
            onClick={this.placeArmorCard}
          >{this.backgroundOrPicture(this.props.cardsInPlay.upperLeftArmor[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("upperMiddleArmor")}
            id="upperMiddleArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.upperMiddleArmor[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("upperRightArmor")}
            id="upperRightArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.upperRightArmor[0].picture)}
          </button>
        </div>
        <div />
        <div>
          <button
            className={this.props.cardsInPlay.royalsToBePlaced.length < 2 ? "contenthidden": this.colorCard("royalsToBePlaced")}
            id="royalsToBePlaced"
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.royalsToBePlaced[0].picture)}
          </button>
          {this.props.cardsInPlay.royalsToBePlaced.length < 2 ? "":  this.props.cardsInPlay.royalsToBePlaced.length - 1}
        </div>
        <div />
        <div />
        <div>
          <button
            className={this.colorCard("upperLeftRoyal")}
            id="upperLeftRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.upperLeftRoyal[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("upperMiddleRoyal")}
            id="upperMiddleRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.upperMiddleRoyal[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("upperRightRoyal")}
            id="upperRightRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.upperRightRoyal[0].picture)}
          </button>
        </div>
        <div />
        <div />
        <div>
          <button
            className={this.colorCard("leftUpperArmor")}
            id="leftUpperArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.leftUpperArmor[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("leftUpperRoyal")}
            id="leftUpperRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.leftUpperRoyal[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("leftUpper")}
            id="leftUpper"
            onClick={this.placeNormalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.leftUpper[0].picture)}
          </button>
          {this.props.cardsInPlay.leftUpper.length - 1}
        </div>
        <div>
          <button
            className={this.colorCard("middleUpper")}
            id="middleUpper"
            onClick={this.placeNormalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.middleUpper[0].picture)}
          </button>
          {this.props.cardsInPlay.middleUpper.length - 1}
        </div>
        <div>
          <button
            className={this.colorCard("rightUpper")}
            id="rightUpper"
            onClick={this.placeNormalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.rightUpper[0].picture)}
          </button>
          {this.props.cardsInPlay.rightUpper.length - 1}
        </div>
        <div>
          <button
            className={this.colorCard("rightUpperRoyal")}
            id="rightUpperRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.rightUpperRoyal[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("rightUpperArmor")}
            id="rightUpperArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.rightUpperArmor[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("leftMiddleArmor")}
            id="leftMiddleArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.leftMiddleArmor[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("leftMiddleRoyal")}
            id="leftMiddleRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.leftMiddleRoyal[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("leftMiddle")}
            id="leftMiddle"
            onClick={this.placeNormalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.leftMiddle[0].picture)}
          </button>
          {this.props.cardsInPlay.leftMiddle.length - 1}
        </div>
        <div>
          <button
            className={this.colorCard("middleMiddle")}
            id="middleMiddle"
            onClick={this.placeNormalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.middleMiddle[0].picture)}
          </button>
          {this.props.cardsInPlay.middleMiddle.length - 1}
        </div>
        <div>
          <button
            className={this.colorCard("rightMiddle")}
            id="rightMiddle"
            onClick={this.placeNormalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.rightMiddle[0].picture)}
          </button>
          {this.props.cardsInPlay.rightMiddle.length - 1}
        </div>
        <div>
          <button
            className={this.colorCard("rightMiddleRoyal")}
            id="rightMiddleRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.rightMiddleRoyal[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("rightMiddleArmor")}
            id="rightMiddleArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.rightMiddleArmor[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("leftBottomArmor")}
            id="leftBottomArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.leftBottomArmor[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("leftBottomRoyal")}
            id="leftBottomRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.leftBottomRoyal[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("leftBottom")}
            id="leftBottom"
            onClick={this.placeNormalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.leftBottom[0].picture)}
          </button>
          {this.props.cardsInPlay.leftBottom.length - 1}
        </div>
        <div>
          <button
            className={this.colorCard("middleBottom")}
            id="middleBottom"
            onClick={this.placeNormalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.middleBottom[0].picture)}
          </button>
          {this.props.cardsInPlay.middleBottom.length - 1}
        </div>
        <div>
          <button
            className={this.colorCard("rightBottom")}
            id="rightBottom"
            onClick={this.placeNormalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.rightBottom[0].picture)}
          </button>
          {this.props.cardsInPlay.rightBottom.length - 1}
        </div>
        <div>
          <button
            className={this.colorCard("rightBottomRoyal")}
            id="rightBottomRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.rightBottomRoyal[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("rightBottomArmor")}
            id="rightBottomArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.rightBottomArmor[0].picture)}
          </button>
        </div>
        <div />
        <div />
        <div>
          <button
            className={this.colorCard("bottomLeftRoyal")}
            id="bottomLeftRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.bottomLeftRoyal[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("bottomMiddleRoyal")}
            id="bottomMiddleRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.bottomMiddleRoyal[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("bottomRightRoyal")}
            id="bottomRightRoyal"
            onClick={this.placeRoyalCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.bottomRightRoyal[0].picture)}
          </button>
        </div>
        <div />
        <div />
        <div />
        <div />
        <div>
          <button
            className={this.colorCard("bottomLeftArmor")}
            id="bottomLeftArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.bottomLeftArmor[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("bottomMiddleArmor")}
            id="bottomMiddleArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.bottomMiddleArmor[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("bottomRightArmor")}
            id="bottomRightArmor"
            onClick={this.placeArmorCard}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.bottomRightArmor[0].picture)}
          </button>
        </div>
        <div />
        <div />
        <div>
          <button className={this.colorCard("deck")}>
            {this.backgroundOrPicture(this.props.deck[0].picture)}
          </button>
          {this.props.deck.length - 1}
        </div>
        <div>
          <button
            className={this.colorCard("joker1")}
            id="joker1"
            onClick={this.placeJoker}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.joker1[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("joker2")}
            id="joker2"
            onClick={this.placeJoker}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.joker2[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("ace1")}
            id="ace1"
            onClick={this.placeAce}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.ace1[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("ace2")}
            id="ace2"
            onClick={this.placeAce}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.ace2[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("ace3")}
            id="ace3"
            onClick={this.placeAce}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.ace3[0].picture)}
          </button>
        </div>
        <div>
          <button
            className={this.colorCard("ace4")}
            id="ace4"
            onClick={this.placeAce}
          >
            {this.backgroundOrPicture(this.props.cardsInPlay.ace4[0].picture)}
          </button>
        </div>
      </div>
    );
  }
}

export default CreateGrid;
