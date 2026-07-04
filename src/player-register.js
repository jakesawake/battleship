import { container } from "./main";

function playerGreeting(uponRegistering) {
  const formContainer = document.createElement("div");
  formContainer.classList.add("form-container");

  const playerForm = document.createElement("form");
  playerForm.classList.add("player-form");

  const playerNameInput = document.createElement("input");
  playerNameInput.classList.add("player-name-input");
  playerNameInput.type = "text";
  playerNameInput.name = "playername";
  playerNameInput.placeholder = "Enter your name here: ";

  const submitBtn = document.createElement("button");
  submitBtn.classList.add("submit-btn");
  submitBtn.type = "button";
  submitBtn.textContent = "Register";

  container.appendChild(formContainer);
  formContainer.appendChild(playerForm);
  playerForm.appendChild(playerNameInput);
  playerForm.appendChild(submitBtn);

  playerNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      formContainer.classList.add("hidden");
      uponRegistering(playerNameInput.value);
    }
  });

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.add("hidden");
    uponRegistering(playerNameInput.value);
  });
}

export { playerGreeting };
