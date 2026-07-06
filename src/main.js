import "./style.css";
import { playerGreeting } from "./player-register";
import { ComputerPlayer, Player } from "./player-class";
import { placeShips } from "./place-ships";
import { Gameboard } from "./gameboard-class";
import { gameLoop } from "./game-logic";

const container = document.querySelector(".container");
const headerContainer = document.querySelector(".header-container");
const gameAreaContainer = document.querySelector(".game-area-container");

// passing in returnPlayer to playerGreeting for callback
// returnPlayer will grab its arguement from playerGreeting in the player-register.js module
playerGreeting(returnPlayer);

let humanPlayer;

const controller = new AbortController();
const { signal } = controller;

// callback function for playerGreeting
// takes playerNameInput.value to create a new Player object
// also displays personalized string to tell the player to place their ships
function returnPlayer(playerNameInput) {
  const humanGameboard = new Gameboard();
  humanPlayer = new Player(playerNameInput, humanGameboard);
  const personalStr = `Thanks for playing ${humanPlayer.name}, please proceed with placing your ships for battle`;
  const personalStrContainer = document.createElement("div");
  personalStrContainer.classList.add("personal-string-container");
  personalStrContainer.textContent = personalStr;
  headerContainer.appendChild(personalStrContainer);
  placeShips(humanPlayer);
  printGameboard(humanPlayer);

  return humanPlayer;
}

function printBlankGrid(boardID) {
  const blankGameGrid = document.createElement("div");
  blankGameGrid.id = `${boardID}`;

  const gridSize = 10;

  for (let i = 0; i < gridSize; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < gridSize; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.style.display = "flex";
      square.style.justifyContent = "center";
      square.style.alignItems = "center";
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

// function that prints the gameboard and attaches event listeners for the
// squares dragging/dropping the ships
function printGameboard(player) {
  const initialGameGrid = printBlankGrid("human-gameboard");
  const gameGridSquares = initialGameGrid.querySelectorAll(".square");

  const shipArr = player.ships;
  const shipSpaceTotal = shipArr.reduce((acc, curr) => {
    return acc + curr.length;
  }, 0);

  for (const square of gameGridSquares) {
    square.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
      },
      { signal },
    );

    square.addEventListener("drop", (e) => {
      const coordinate = e.target.dataset.coordinate;
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { name } = data;
      const ship = player.ships.find(
        (obj) => {
          return obj.name === name;
        },
        { signal },
      );

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

          gameLoop(printComputerGameboard, humanPlayer, computerPlayer);
        }
      } catch (error) {
        alert(error.message);
      }
    });
  }
}

const setupComputerBoard = new Gameboard();

const computerPlayer = new ComputerPlayer(
  "Computer Player",
  setupComputerBoard,
);

computerPlayer.computerGameboard();

function printComputerGameboard(humanPlayer, computerPlayer) {
  const opponentGameboard = printBlankGrid("computer-gameboard");
  const opponentGameboardSquares =
    opponentGameboard.querySelectorAll(".square");

  for (const square of opponentGameboardSquares) {
    square.addEventListener(
      "click",
      (e) => {
        const clickedSquare = e.target;
        humanPlayer.playerAttack(
          computerPlayer.gameboard,
          clickedSquare.dataset.coordinate,
        );

        if (
          computerPlayer.gameboard.attacked.includes(
            clickedSquare.dataset.coordinate,
          )
        ) {
          clickedSquare.classList.add("hit");
        } else if (
          computerPlayer.gameboard.missed.includes(
            clickedSquare.dataset.coordinate,
          )
        ) {
          clickedSquare.classList.add("miss");
        }

        let coordinate = computerPlayer.computerAttack(humanPlayer.gameboard);

        const attackedSquare = document.querySelector(
          `#human-gameboard [data-coordinate=${coordinate}]`,
        );

        if (humanPlayer.gameboard.missed.includes(coordinate)) {
          attackedSquare.classList.add("miss");
        } else if (humanPlayer.gameboard.attacked.includes(coordinate)) {
          attackedSquare.classList.add("hit");
        }
        if (humanPlayer.gameboard.allShipsSunk()) {
          const winningMessage = document.createElement("div");
          winningMessage.classList.add("winning-message");
          winningMessage.textContent = `${humanPlayer.name} has lost all their ships!`;
          gameAreaContainer.appendChild(winningMessage);
          controller.abort();
        } else if (computerPlayer.gameboard.allShipsSunk()) {
          const winningMessage = document.createElement("div");
          winningMessage.classList.add("winning-message");
          winningMessage.textContent = `${humanPlayer.name} has sunk all enemy ships!`;
          gameAreaContainer.appendChild(winningMessage);
          controller.abort();
        }
      },
      { signal },
    );
  }
}

export { container, gameAreaContainer, printComputerGameboard };
