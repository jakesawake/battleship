// ship class blueprint
class Ship {
  // constructor for creating the battleship pieces
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.hits = 0;
  }

  // hit function to increment the amount of hits a ship has taken
  hit() {
    if (this.isSunk()) {
      console.log("The target ship has already sunk!");
    } else {
      this.hits++;
    }
  }

  // returning the evaluation of the condition, either true or false will be returned
  isSunk() {
    return this.hits >= this.length;
  }
}

export { Ship };
