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
    shipContainer.dataset.shipName = `${ship.name}`;

    shipContainer.addEventListener("click", () => {
      ship.toggleOrientation();
      if (ship.orientation === "vertical") {
        shipContainer.style.transform = "rotate(90deg)";
      } else {
        shipContainer.style.transform = "";
      }
    });

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
}

export { placeShips };
