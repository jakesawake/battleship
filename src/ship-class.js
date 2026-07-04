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
