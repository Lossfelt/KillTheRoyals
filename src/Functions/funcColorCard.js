export function colorCard(id) {
  let classes = "";

  if (id === "deck") {
    if (this.props[id][0].picture === "empty") {
      classes = "backgroundSquare";
    } else if (this.props[id][0].color === "red") {
      classes = "redButton";
    } else {
      classes = "blackButton";
    }
  } else if (this.props.cardsInPlay[id][0].picture === "empty") {
    classes = "backgroundSquare";
  } else if (this.props.cardsInPlay[id][0].color === "red") {
    classes = "redButton";
  } else {
    classes = "blackButton";
  }

  if (
    id === this.props.aceInUse ||
    id === this.props.jokerInUse ||
    id === this.props.jokerInUseBunkeNr1
  ) {
    classes += " activeCard";
  }

  return classes;
}
