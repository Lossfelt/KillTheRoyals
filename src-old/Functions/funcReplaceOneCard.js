export function replaceOneCard(input) {
    if (input === "yes") {
        this.setState({
            setupPhaseStackToBeReplaced: "waiting"
        })
    }
    else if (input === "no") {
        this.setState({
            isSetupPhase: false
        })
    }
}