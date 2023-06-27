import mons from "./mons.js";

const defaults = {
  sprite: "000-missing.png",
  name: "???",
  category: "???",
  height: "???",
  weight: "???",
};

const monEntry = (() => {
  let template = document.getElementById('mon-entry').innerHTML;
  let compiled_template = Handlebars.compile(template);
  return mon => {
    return compiled_template({...defaults, ...mon});
  }
})();

// open details modal
window.addEventListener("click", (evt) => {
  const entry = evt.target.closest(".mon-entry");
  if (!entry) { return }
  let mon = mons[entry.dataset.index];
  if (!mon.sprite) { return }
  mon.typeDisplay = mon.type.join(" / ");
  let template = document.getElementById('details-template').innerHTML;
  let compiled_template = Handlebars.compile(template);
  let evos = buildEvo(mon.evos);
  let rendered = compiled_template({...defaults, ...mon, evos});
  document.getElementById('modal-inner').innerHTML = rendered;
  openModal();
});

// input:
// {idx: 1, evos: [{idx: 2, evoType: "level 30"}]}
//
// output:
// <Sprite /><div>
//   <div>→ <Sprite /></div>
//   <div>→ <Sprite /></div>
// </div>
const buildEvo = (mon) => {
  if (!mon) { return }
  let monHtml = monEntry({index: mon.index, ...mons[mon.index]});
  if (mon.evoType) {
    // monHtml = `<span class="middle">-${mon.evoType}→ </span>${monHtml}`
    monHtml = `<span class="middle">→</span>${monHtml}`;
  }
  if (mon.evos) {
    let rows = "";
    for (const evo of mon.evos) {
      rows += buildEvo(evo);
    }
    monHtml += `<div class="evo-col">${rows}</div>`;
  }
  monHtml = `<div class="evo-unit">${monHtml}</div>`;
  return monHtml;
}

window.onload = function() {
  let rendered = "";
  for (let [index, mon] of mons.entries()) {
    rendered += monEntry({index, ...mon});
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
