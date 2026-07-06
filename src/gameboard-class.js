// Gameboard class to take a snapshot of the current board and it's position
// constructor that refers to an object instance containing data about
// its position, attacked coordinates, and missed coordinates
class Gameboard {
  constructor() {
    this.position = new Map();
    this.attacked = [];
    this.missed = [];
  }

  #isValidCoordinate(coordinates) {
    const letter = coordinates[0];
    const number = parseInt(coordinates.slice(1));
    return letter >= "a" && letter <= "j" && number >= 0 && number <= 10;
  }

  placeShip(coordinates, ship) {
    const validCoordinates = [];
    const coordLetterUnicode = coordinates.charCodeAt(0);
    const coordLetter = coordinates[0];
    const coordNumber = parseInt(coordinates.slice(1));
    for (let i = 0; i < ship.length; i++) {
      if (ship.orientation === "horizontal") {
        let shipCoordHorizontal = coordLetter + (coordNumber + i);
        validCoordinates.push(shipCoordHorizontal);
      } else if (ship.orientation === "vertical") {
        let shipCoordVertical =
          String.fromCharCode(coordLetterUnicode + i) + coordNumber;
        validCoordinates.push(shipCoordVertical);
      }
    }
    for (const coord of validCoordinates) {
      if (!this.#isValidCoordinate(coord)) {
        throw new Error("The ship placed is not within bounds, try again");
      } else if (this.position.has(coord)) {
        throw new Error(
          "There is already a ship here, try placing it elsewhere!",
        );
      }
    }
    for (const validCoord of validCoordinates) {
      this.position.set(validCoord, ship);
    }
  }

  receiveAttack(coordinates) {
    if (!this.#isValidCoordinate(coordinates)) {
      throw new Error("The attack is out of bounds!");
    }
    if (
      this.attacked.includes(coordinates) ||
      this.missed.includes(coordinates)
    ) {
      throw new Error("Can't attack here");
    }
    if (this.position.has(coordinates)) {
      let attackedShip = this.position.get(coordinates);
      this.attacked.push(coordinates);
      return attackedShip.hit();
    } else {
      this.missed.push(coordinates);
    }
  }
  // returning boolean
  allShipsSunk() {
    return this.position.size === this.attacked.length;
  }
}

export { Gameboard };
