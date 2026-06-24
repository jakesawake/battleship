import { container, gameAreaContainer } from "./main";

// - async helper function for fetching svg by file path
// - parses it into a real DOM element and then returns that element
// so it can be appended directly to the page
async function loadSVGElement(filepath) {
  const response = await fetch(filepath);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "image/svg+xml");
  let svgElement = doc.documentElement;

  return svgElement;
}

// async function to place svg's of the ships for the humanPlayer
// passing in the humanPlayer object from main.js
// this module will then have access to both humanPlayer.ships &
// humanPlayer.gameboard (to call placeShip on when a ship is dropped)
async function placeShips(humanPlayer) {
  let loadedSVG;

  const shipOuterContainer = document.createElement("div");
  shipOuterContainer.classList.add("ship-outer-container");

  for (const ship of humanPlayer.ships) {
    let filePathStr = `/${ship.name}.svg`;
    loadedSVG = await loadSVGElement(filePathStr);
    const shipContainer = document.createElement("div");
    shipContainer.classList.add("ship-container");
    shipContainer.setAttribute("draggable", "true");

    shipContainer.addEventListener("click", () => {
      ship.toggleOrientation();
      if (ship.orientation === "vertical") {
        shipContainer.style.transform = "rotate(90deg)";
      } else {
        shipContainer.style.transform = "";
      }
    });

    // - adding event listener on the ship container to listen to dragstart events
    // - (fired on the source element): this event triggers the exact moment a user
    // clicks and beings dragging the item
    // NOTE: dataTransfer object holds the data that is being dragged during a drag-and-drop operation or transferred via clipboard
    // allows you to pass specific data like text or files from the element you are dragging to the element you are dropping to
    // setData() stores data during the drag operation, you define the data's format ie. text/plain,
    // and then the actual content, in this case passing in the ship's named and orientation as an object so we can pass in multiple values to dataTransfer
    // from the drop side we can destructure the object we've sent in to retrieve the data
    shipContainer.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ name: ship.name, orientation: ship.orientation }),
      );
    });
    shipContainer.appendChild(loadedSVG);
    shipOuterContainer.appendChild(shipContainer);
  }
  gameAreaContainer.appendChild(shipOuterContainer);
  container.appendChild(gameAreaContainer);
  // TODO: hide the shipOuterContainer after putting the ships on the board
}

export { placeShips };
