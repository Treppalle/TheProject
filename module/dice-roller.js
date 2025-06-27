document.addEventListener("click", event => {
  if (event.target.dataset.action === "roll-d6") {
    const roll = new Roll("1d6");
    roll.roll({ async: false });
    roll.toMessage();
  }
});
