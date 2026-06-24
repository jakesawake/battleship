import { Ship } from "./ship-class";

// player blueprint
// constructor to construct the players
// - taking their player name so that we can build dynamic strings using
// the players name ie. 'Jake sunked the opponents Carrier!'
// - taking the players current gameboard
// - boolean for if it's the player's turn
// - array of Ship object instances that belong to each player
// (length is determined in when Ship class constructor is called)
// method for the attack logic of the human player
// wrapper that takes the players gameBoard & coordinates to call
// the receiveAttack() method that gameBoard has
class Player {
  constructor(name, gameboard) {
    this.name = name;
    this.gameboard = gameboard;
    this.turn = false;

    this.ships = [
      new Ship("Carrier", 5),
      new Ship("Battleship", 4),
      new Ship("Cruiser", 3),
      new Ship("Submarine", 3),
      new Ship("Destroyer", 2),
    ];
  }
  playerAttack(gameBoard, coordinates) {
    gameBoard.receiveAttack(coordinates);
  }
}

// separate player class for the computer that inherits from Player class above
// the computer player should have a method that generates random coordinates
class ComputerPlayer extends Player {
  #randomLetter() {
    return String.fromCharCode(97 + Math.floor(Math.random() * 10));
  }

  #randomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }

  #generateCoordinate() {
    let letter = this.#randomLetter();
    let number = this.#randomNumber();
    return letter + number;
  }

  computerAttack(gameBoard) {
    let coordinates = this.#generateCoordinate();
    while (
      gameBoard.attacked.includes(coordinates) ||
      gameBoard.missed.includes(coordinates)
    ) {
      coordinates = this.#generateCoordinate();
    }
    gameBoard.receiveAttack(coordinates);
  }
}

export { Player, ComputerPlayer };
