// ship class blueprint
// constructor for creating the battleship pieces
// initial parameters include the ship name and the length of the ship
// additional properties of the class include a hit counter and the
// default orientation that it's set to (horizontal)
// toggle orientation function to change it from horizontal to vertical on function call
// hit function to increment the amount of hits a ship has taken
// returning the evaluation of the condition, either true or false will be returned
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.hits = 0;
    this.orientation = "horizontal";
  }
  toggleOrientation() {
    this.orientation =
      this.orientation === "horizontal" ? "vertical" : "horizontal";
    return this.orientation;
  }
  hit() {
    if (this.isSunk()) {
      console.log("The target ship has already sunk!");
    } else {
      this.hits++;
    }
  }
  isSunk() {
    return this.hits >= this.length;
  }
}

export { Ship };
