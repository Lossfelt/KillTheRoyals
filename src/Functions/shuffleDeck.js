export function shuffleDeck(deck) {
  for (var i = 0; i < 1000; i++) {
    var location1 = Math.floor(Math.random() * deck.length);
    var location2 = Math.floor(Math.random() * deck.length);
    var tmp = deck[location1];
    deck[location1] = deck[location2];
    deck[location2] = tmp;
  }
  deck.push({ value: 0, suit: "", picture: "\u{1F0F1}", color: "" });
  return deck;
}
