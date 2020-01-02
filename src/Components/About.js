import React from "react";

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentclass: "contenthidden"
    };
    this.toggleAbout = this.toggleAbout.bind(this);
  }

  toggleAbout() {
    if (this.state.contentclass === "contenthidden") {
      this.setState({ contentclass: "contentvisible" });
    } else {
      this.setState({ contentclass: "contenthidden" });
    }
  }

  render() {
    return (
      <div>
        <div className="topgrid">
          <div />
          <div>
            <h1>Kill the royals</h1>
          </div>
          <div>
            <button className="aboutbutton" onClick={this.toggleAbout}>
              About
            </button>
          </div>
        </div>
        <div className={this.state.contentclass} onClick={this.toggleAbout}>
          <p>
            This game is an implementation of Gridcannon, created by{" "}
            <a href="https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/">
              Tom Francis
            </a>
          </p>
          <h3>Rules</h3>
          <h4>Setup</h4>
          <p>
            Draw cards and lay out a 3×3 grid. If you draw any royals during
            this, put them on a separate pile instead and keep drawing til
            you’ve made the grid without royals.
          </p>
          <p>
            If you did draw some royals, you now place them the same way we will
            when playing: put it outside the center nine cards, adjacent to the
            card it’s most similar to. That means highest value card of the same
            suit. If none match suit, highest of same colour. If none match
            colour, highest value. If still tied, you can choose. If the card
            most like the royal is on a corner, you can choose which side to put
            it.
          </p>
          <p>
            If you wish, you can now choose one number-card on the grid and
            place it on the bottom of the deck. If you choose to do so, you then
            place a new card in the same spot.
          </p>
          <h4>Play</h4>
          <h5>Draw a card from the deck.</h5>
          <ul>
            <li>If it’s a royal: use placement rule above.</li>
            <li>
              If it has value 2-10: you must place it on the grid. It can go on
              any card with the same or lower value. Empty spots have value
              zero.
            </li>
            <li>
              If it’s an ace or joker: these are put on the bottom row, next to
              the deck.
            </li>
          </ul>
          <h5>Killing royals</h5>
          If you’re able to place a card on the grid opposite a royal – so there
          are two cards between – those two cards become a ‘payload’ that you
          are firing at the royal. The sum of their values is the power of the
          shot. The power of the shot must be as much or greater than the health
          of the royal to kill it – if it’s not, it does nothing.
          <ul>
            <li>Jacks: 11 health. The cards in the payload can be any suit.</li>
            <li>
              Queens: 12 health. The cards in the payload must match the colour
              of the queen to count.
            </li>
            <li>
              Kings: 13 health. The cards in the payload must match the suit of
              the king to count.
            </li>
          </ul>
          If there are no more alive royals in play, but you've not yet killed
          all 12, then you will need to click on the deck to cycle through it to
          find a royal for you to place into play. The number-cards cycled
          through are added to the bottom of the deck.
          <h5>Adding armor</h5>
          <p>
            If you can't play a card you can add it to the royal it’s most
            similar to (lowest value royal, and if tied; of same color or suit) and increases their
            health by the added value. So a King with a 3 as armour now has 13 +
            3 = 16 health.
          </p>
          <h5>Using an Ace</h5>
          <p>
            At any time, you can spend an ace from the bottom row to pick up any
            stack. When using an ace to pick up a stack, the stack is placed on
            the bottom of the deck. When you've used an ace it is turned face
            down to show that it can't be used again.
          </p>
          <h5>Using a Joker</h5>
          <p>
            At any time, you can spend a joker to move a card that’s already on
            the grid. You can only move it to a valid place to play it. You only
            move the top card, not the whole stack. As with aces, it is then
            turned face down to show that it can't be used again.
          </p>
          <h5>Winning</h5>
          <p>
            If all 12 royals have been placed on the board and then killed,
            you've won and your unspent Jokers and Aces are your score. So a
            perfect game is 6, if you won without using any.
          </p>
          <h5>Losing</h5>
          <p>
            If you can't place a card either on the grid or as armor (either
            because no more armor slots are available or because it would make a
            royal invincible), you lose the game. If your deck runs out and you
            don't have any unused aces, you also lose the game.
          </p>
        </div>
      </div>
    );
  }
}

export default About;
