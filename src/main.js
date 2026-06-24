import "./style.css";
import { playerGreeting } from "./player-register";
import { Player } from "./player-class";
import { placeShips } from "./place-ships";
import { Gameboard } from "./gameboard-class";

const container = document.querySelector(".container");
const gameBoardContainer = document.querySelector(".gameboard-container");
const headerContainer = document.querySelector(".header-container");
const gameAreaContainer = document.querySelector(".game-area-container");

// function to print the battleship gameboard
// passing in a humanPlayer as an parameter
function printGameboard(player) {
  const gridSize = 10;

  for (let i = 0; i < gridSize; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < gridSize; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      row.appendChild(square);
      square.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      square.dataset.coordinate = `${String.fromCharCode(97 + i)}${j + 1}`;

      square.addEventListener("drop", (e) => {
        const coordinate = e.target.dataset.coordinate;
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const { name, orientation } = data;
        const ship = player.ships.find((obj) => {
          return obj.name === name;
        });
        console.log(coordinate, ship, orientation);
        player.gameboard.placeShip(coordinate, ship, orientation);
        console.log(player.gameboard.position);
      });

      if (j === 0) {
        const labelCellLetters = document.createElement("div");
        labelCellLetters.classList.add("labels");
        labelCellLetters.textContent = String.fromCharCode(
          97 + i,
        ).toUpperCase();
        row.prepend(labelCellLetters);
      }
    }
    gameBoardContainer.appendChild(row);
    container.appendChild(gameBoardContainer);
  }
  const numRow = document.createElement("div");
  numRow.classList.add("row");
  const emptyCell = document.createElement("div");

  for (let k = 1; k <= gridSize; k++) {
    const labelCellNumbers = document.createElement("div");
    emptyCell.classList.add("labels");
    labelCellNumbers.classList.add("number-labels");
    labelCellNumbers.textContent = k;
    numRow.appendChild(labelCellNumbers);
  }
  numRow.prepend(emptyCell);
  gameBoardContainer.appendChild(numRow);
  gameAreaContainer.appendChild(gameBoardContainer);
}

// callback function for playerGreeting
// takes playerNameInput.value to create a new Player object
// also displays personalized string to tell the player to place their ships
function returnPlayer(playerNameInput) {
  const humanGameboard = new Gameboard();
  const humanPlayer = new Player(playerNameInput, humanGameboard);
  const personalStr = `Thanks for playing ${humanPlayer.name}, please proceed with placing your ships for battle`;
  const personalStrContainer = document.createElement("div");
  personalStrContainer.classList.add("personal-string-container");
  personalStrContainer.textContent = personalStr;
  headerContainer.appendChild(personalStrContainer);
  placeShips(humanPlayer);
  printGameboard(humanPlayer);
  console.log(humanPlayer);

  return humanPlayer;
  // TODO: Hide the personalStr AFTER the player places their ships
}

// passing in returnPlayer to playerGreeting for callback
// returnPlayer will grab its arguement from playerGreeting in the player-register.js module
playerGreeting(returnPlayer);

export { container, gameAreaContainer };
