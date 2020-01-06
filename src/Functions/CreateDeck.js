export function createDeck() {
  var deck = [];
  var suits = ["spades", "diamonds", "clubs", "hearts"];
  var values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  suits.forEach(suitElement => {
    values.forEach(valueElement => {
      var card = {
        value: valueElement,
        suit: suitElement,
        picture: "",
        color: ""
      };
      deck.push(card);
    });
  });

  deck.forEach(element => {
    if (element.suit === "spades") {
      if (element.value === "A") {
        element.picture = "\u{1F0a1}";
      }
      if (element.value === 2) {
        element.picture = "\u{1F0a2}";
      }
      if (element.value === 3) {
        element.picture = "\u{1F0a3}";
      }
      if (element.value === 4) {
        element.picture = "\u{1F0a4}";
      }
      if (element.value === 5) {
        element.picture = "\u{1F0a5}";
      }
      if (element.value === 6) {
        element.picture = "\u{1F0a6}";
      }
      if (element.value === 7) {
        element.picture = "\u{1F0a7}";
      }
      if (element.value === 8) {
        element.picture = "\u{1F0a8}";
      }
      if (element.value === 9) {
        element.picture = "\u{1F0a9}";
      }
      if (element.value === 10) {
        element.picture = "\u{1F0aA}";
      }
      if (element.value === 11) {
        element.picture = "\u{1F0aB}";
      }
      if (element.value === 12) {
        element.picture = "\u{1F0aD}";
      }
      if (element.value === 13) {
        element.picture = "\u{1F0aE}";
      }
      element.color = "black";
    }
    if (element.suit === "hearts") {
      if (element.value === "A") {
        element.picture = "\u{1F0b1}";
      }
      if (element.value === 2) {
        element.picture = "\u{1F0b2}";
      }
      if (element.value === 3) {
        element.picture = "\u{1F0b3}";
      }
      if (element.value === 4) {
        element.picture = "\u{1F0b4}";
      }
      if (element.value === 5) {
        element.picture = "\u{1F0b5}";
      }
      if (element.value === 6) {
        element.picture = "\u{1F0b6}";
      }
      if (element.value === 7) {
        element.picture = "\u{1F0b7}";
      }
      if (element.value === 8) {
        element.picture = "\u{1F0b8}";
      }
      if (element.value === 9) {
        element.picture = "\u{1F0b9}";
      }
      if (element.value === 10) {
        element.picture = "\u{1F0bA}";
      }
      if (element.value === 11) {
        element.picture = "\u{1F0bB}";
      }
      if (element.value === 12) {
        element.picture = "\u{1F0bD}";
      }
      if (element.value === 13) {
        element.picture = "\u{1F0bE}";
      }
      element.color = "red";
    }
    if (element.suit === "diamonds") {
      if (element.value === "A") {
        element.picture = "\u{1F0c1}";
      }
      if (element.value === 2) {
        element.picture = "\u{1F0c2}";
      }
      if (element.value === 3) {
        element.picture = "\u{1F0c3}";
      }
      if (element.value === 4) {
        element.picture = "\u{1F0c4}";
      }
      if (element.value === 5) {
        element.picture = "\u{1F0c5}";
      }
      if (element.value === 6) {
        element.picture = "\u{1F0c6}";
      }
      if (element.value === 7) {
        element.picture = "\u{1F0c7}";
      }
      if (element.value === 8) {
        element.picture = "\u{1F0c8}";
      }
      if (element.value === 9) {
        element.picture = "\u{1F0c9}";
      }
      if (element.value === 10) {
        element.picture = "\u{1F0cA}";
      }
      if (element.value === 11) {
        element.picture = "\u{1F0cB}";
      }
      if (element.value === 12) {
        element.picture = "\u{1F0cD}";
      }
      if (element.value === 13) {
        element.picture = "\u{1F0cE}";
      }
      element.color = "red";
    }
    if (element.suit === "clubs") {
      if (element.value === "A") {
        element.picture = "\u{1F0d1}";
      }
      if (element.value === 2) {
        element.picture = "\u{1F0d2}";
      }
      if (element.value === 3) {
        element.picture = "\u{1F0d3}";
      }
      if (element.value === 4) {
        element.picture = "\u{1F0d4}";
      }
      if (element.value === 5) {
        element.picture = "\u{1F0d5}";
      }
      if (element.value === 6) {
        element.picture = "\u{1F0d6}";
      }
      if (element.value === 7) {
        element.picture = "\u{1F0d7}";
      }
      if (element.value === 8) {
        element.picture = "\u{1F0d8}";
      }
      if (element.value === 9) {
        element.picture = "\u{1F0d9}";
      }
      if (element.value === 10) {
        element.picture = "\u{1F0dA}";
      }
      if (element.value === 11) {
        element.picture = "\u{1F0dB}";
      }
      if (element.value === 12) {
        element.picture = "\u{1F0dD}";
      }
      if (element.value === 13) {
        element.picture = "\u{1F0dE}";
      }
      element.color = "black";
    }
  });

  var joker1 = {
    value: "Joker",
    suit: "red",
    picture: "\u{1F0DF}",
    color: "red"
  };
  deck.push(joker1);
  var joker2 = {
    value: "Joker",
    suit: "black",
    picture: "\u{1F0DF}",
    color: "black"
  };
  deck.push(joker2);

  //console.log(deck);
  return deck;
}
