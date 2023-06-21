import mons from "./mons.js";

const defaults = {
  sprite: "000-missing.png",
  name: "???",
  category: "???",
  height: "???",
  weight: "???",
};

window.addEventListener("click", (evt) => {
  const entry = evt.target.closest(".mon-entry");
  if (!entry) { return }
  let mon = mons[entry.dataset.index];
  if (!mon.sprite) { return }
  mon.typeDisplay = mon.type.join(" / ");
  let template = document.getElementById('details-template').innerHTML;
  let compiled_template = Handlebars.compile(template);
  let rendered = compiled_template({...defaults, ...mon});
  document.getElementById('modal-inner').innerHTML = rendered;
  openModal();
});

window.onload = function() {
  let template = document.getElementById('mon-entry').innerHTML;
  let compiled_template = Handlebars.compile(template);
  let rendered = "";
  for (let [index, mon] of mons.entries()) {
    rendered += compiled_template({index, ...defaults, ...mon});
  }
  document.getElementById('mon-list').innerHTML = rendered;
};

const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.classList.add("closed");
  window.setTimeout(() => { modal.style.visibility = "hidden"; }, 250);
}

const openModal = () => {
  const modal = document.getElementById("modal");
  modal.classList.remove("closed");
  modal.style.visibility = "visible";
}

document.getElementById("modal").addEventListener("click", event => {
  if (!document.getElementById("modal-inner").contains(event.target)) {
    closeModal();
  }
});

document.addEventListener("keyup", event => {
  if(event.key === "Escape") {
    closeModal();
  }
});
