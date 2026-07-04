import "./style.css";
import { playerGreeting } from "./player-register";
import { ComputerPlayer, Player } from "./player-class";
import { placeShips } from "./place-ships";
import { Gameboard } from "./gameboard-class";
import { gameLoop } from "./game-logic";

const container = document.querySelector(".container");
const headerContainer = document.querySelector(".header-container");
const gameAreaContainer = document.querySelector(".game-area-container");

// TODO:
// - create a blank 10 x 10 grid that takes the current player (human or computer)
// as parameters
// - return the gameboard-container (the DOM node)

function printBlankGrid() {
  const blankGameGrid = document.createElement("div");
  blankGameGrid.classList.add("blank-game-grid");
  const gridSize = 10;

  for (let i = 0; i < gridSize; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < gridSize; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.dataset.coordinate = `${String.fromCharCode(97 + i)}${j + 1}`;
      row.appendChild(square);
      if (j === 0) {
        const labelCellLetters = document.createElement("div");
        labelCellLetters.classList.add("labels");
        labelCellLetters.textContent = String.fromCharCode(
          97 + i,
        ).toUpperCase();
        row.prepend(labelCellLetters);
      }
    }
    blankGameGrid.appendChild(row);
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
  blankGameGrid.appendChild(numRow);
  gameAreaContainer.appendChild(blankGameGrid);
  return blankGameGrid;
}

// TODO:
//   1. Call printBlankGrid() to get the grid
//   2. Query the squares within that returned grid and add dragover and drop listeners
//   3. Append the grid to gameAreaContainer
function printGameboard(player) {
  const initialGameGrid = printBlankGrid();
  const gameGridSquares = initialGameGrid.querySelectorAll(".square");

  const shipArr = player.ships;
  const shipSpaceTotal = shipArr.reduce((acc, curr) => {
    return acc + curr.length;
  }, 0);

  for (const square of gameGridSquares) {
    square.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    square.addEventListener("drop", (e) => {
      const coordinate = e.target.dataset.coordinate;
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { name } = data;
      const ship = player.ships.find((obj) => {
        return obj.name === name;
      });

      try {
        player.gameboard.placeShip(coordinate, ship);
        const occupiedCoordinates = [];
        let coordinateNumber = parseInt(coordinate.slice(1));
        if (ship.orientation === "horizontal") {
          for (let k = 0; k < ship.length; k++) {
            let occupiedCoordinate = coordinate[0] + (coordinateNumber + k);
            occupiedCoordinates.push(occupiedCoordinate);
          }
        } else if (ship.orientation === "vertical") {
          let coordinateUnicode = coordinate.charCodeAt(0);
          for (let l = 0; l < ship.length; l++) {
            let occupiedCoordinate =
              String.fromCharCode(coordinateUnicode + l) + coordinateNumber;
            occupiedCoordinates.push(occupiedCoordinate);
          }
        }

        for (const coord of occupiedCoordinates) {
          let coordTurnRed = initialGameGrid.querySelector(
            `[data-coordinate=${coord}]`,
          );
          coordTurnRed.classList.add("highlight-red");
        }

        let placedShip = document.querySelector(
          `[data-ship-name=${ship.name}]`,
        );
        if (placedShip) {
          placedShip.setAttribute("draggable", "false");
          placedShip.classList.add("placed");
        }

        if (shipSpaceTotal === player.gameboard.position.size) {
          const strToRemove = document.querySelector(
            ".personal-string-container",
          );
          const shipTrayToRemove = document.querySelector(
            ".ship-outer-container",
          );
          shipTrayToRemove.classList.add("hidden");
          strToRemove.classList.add("hidden");

          gameLoop();
        }
      } catch (error) {
        alert(error.message);
      }
    });
  }
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

  return humanPlayer;
}

const setupComputerBoard = new Gameboard();

const computerPlayer = new ComputerPlayer(
  "Computer Player",
  setupComputerBoard,
);

computerPlayer.computerGameboard();

// passing in returnPlayer to playerGreeting for callback
// returnPlayer will grab its arguement from playerGreeting in the player-register.js module
playerGreeting(returnPlayer);

export { container, gameAreaContainer };
