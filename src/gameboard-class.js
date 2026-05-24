// Gameboard class to take a snapshot of the current board and it's position
class Gameboard {
  // constructor that refers to an object instance containing data about
  // its position, attacked coordinates, and missed coordinates
  constructor() {
    this.position = new Map();
    this.attacked = [];
    this.missed = [];
  }

  // private function just to check if coordinate is within gameBoard
  // returns boolean
  #isValidCoordinate(coordinates) {
    // destructuring coordinates into letter & number
    const [letter, number] = coordinates;
    // returning the statement below that evaluates to true (checking if coordinates are IN bounds of gameboard)
    return letter >= "a" && letter <= "j" && number >= 0 && number <= 10;
  }

  // parameters for the coordinates that the ship is placed at, the ship
  // object reference itself, and the orienatation (vertical or horizontal)
  placeShip(coordinates, ship, orientation) {
    // place the ship at the current coordinates selected if it's inbounds
    if (this.#isValidCoordinate(coordinates)) {
      // parsing the number portion of the string using the slice method
      // (taking everything after the letter portion of the coordinate)
      let number = parseInt(coordinates.slice(1));
      // if the ship is laid out horizontally
      if (orientation === "horizontal") {
        // loop to execute if less than the ships length
        for (let i = 0; i < ship.length; i++) {
          // mapping the coordinates position, incrementing the number part
          // of the string because of the ship's length. Also passing in the
          // ship object
          this.position.set(coordinates[0] + (number + i), ship);
        }
        // if the ship is positioned vertically
      } else if (orientation === "vertical") {
        // Grabbing the first letter and assigning it's ASCII code to a variable
        let letterUnicode = coordinates.charCodeAt(0);
        // loop to execute if less than the ships length
        for (let i = 0; i < ship.length; i++) {
          // mapping the coordinates position, incrementing the letter part
          // of the string depending on the ship's length, also passing in the
          // ships object
          this.position.set(
            String.fromCharCode(letterUnicode + i) + number,
            ship,
          );
        }
      }
    }
  }

  // TODO: coordinates take a string to recieve attack e.g "B7"
  receiveAttack(coordinates) {
    // if the coordinates are NOT within the board
    if (!this.#isValidCoordinate(coordinates)) {
      throw new Error("The attack is out of bounds!");
    }
    // if the ship as already been attacked or already missed
    if (
      this.attacked.includes(coordinates) ||
      this.missed.includes(coordinates)
    ) {
      throw new Error("Can't attack here");
    }
    // proceed with attacking the ship
    if (this.position.has(coordinates)) {
    }
  }
}

export { Gameboard };
