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
    const [letter, number] = coordinates;
    return letter >= "a" && letter <= "j" && number >= 0 && number <= 10;
  }

  placeShip(coordinates, ship, orientation) {
    if (this.#isValidCoordinate(coordinates)) {
      let number = parseInt(coordinates.slice(1));
      if (orientation === "horizontal") {
        for (let i = 0; i < ship.length; i++) {
          console.log(i);
          this.position.set(coordinates[0] + (number + i), ship);
        }
      } else if (orientation === "vertical") {
        let letterUnicode = coordinates.charCodeAt(0);
        for (let i = 0; i < ship.length; i++) {
          console.log(i);
          this.position.set(
            String.fromCharCode(letterUnicode + i) + number,
            ship,
          );
        }
      }
    }
  }

  // coordinates take a string to recieve attack e.g "B7"
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
  // TODO: add a method like allShipsSunk() to determine if all ships are sunk
  // in order to declare a winner. Since gameBoard has all the ship references in
  // the position map
}

export { Gameboard };
