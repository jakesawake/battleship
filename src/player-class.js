// player blueprint
class Player {
  // constructor to construct the players
  // - taking their player name
  // - taking the players current gameboard
  // - boolean for if it's the player's turn
  // - array of ships that belong to each player (length is determined in when Ship class constructor is called)
  constructor(name, gameboard) {
    this.name = name;
    this.gameboard = gameboard;
    this.turn = false;
    this.ships = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];
  }
}

export { Player };
