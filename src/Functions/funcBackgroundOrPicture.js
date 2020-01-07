import React from "react";

export function backgroundOrPicture(topPicture) {
    if (topPicture === "empty") {
        return <div className="backgroundSquare" />
    } else {
        return topPicture
    }
}