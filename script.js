import {mons} from "./mons.js";
import {renderStats} from "./stats.js";

const defaults = {
  sprite: "000-missing.gif",
  name: "???",
  category: "???",
  height: "???",
  weight: "???",
};

const monTemplate = id => {
  let template = document.getElementById(id).innerHTML;
  let compiled_template = Handlebars.compile(template);
  return mon => {
    return compiled_template({...defaults, ...mon});
  }
};

const monEntry = monTemplate('mon-entry');
const monDetail = monTemplate('details-template');

// open details modal
window.addEventListener("click", event => {
  const entry = event.target.closest(".mon-entry");
  if (!entry) { return }
  let mon = mons[entry.dataset.index];
  if (!mon.sprite) { return }
  mon.typeDisplay = (mon.type ?? ["???"]).join(" / ");
  let evos = buildEvo(mon.evos);
  let rendered = monDetail({...mon, evos});
  document.getElementById('details').innerHTML = rendered;
  document.getElementById('details-sprite').src = `./sprites/${mon.sprite}`;
  document.getElementById('dex').textContent = mon.dex;
  let evoDom = document.getElementById('evo');
  if (!mon.evos) {
    evoDom.dataset.index = "null";
    evoDom.innerHTML = "";
  } else if (evoDom.dataset.index != mon.evos.index) {
    evoDom.dataset.index = mon.evos.index;
    evoDom.innerHTML = evos;
  }
  openModal("modal");
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
    // monHtml = `<span class="evo-arrow">-${mon.evoType}→ </span>${monHtml}`
    monHtml = `<span class="evo-arrow">→</span>${monHtml}`;
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
  renderStats();
};

const closeModals = () => {
  for (let modal of document.getElementsByClassName("modal")) {
    modal.classList.add("closed");
    window.setTimeout(() => { modal.style.visibility = "hidden"; }, 250);
  }
}

const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  modal.classList.remove("closed");
  modal.style.visibility = "visible";
}

window.addEventListener("click", event => {
  const modal = event.target.closest(".modal");
  if (!modal) { return }
  const inner = modal.getElementsByClassName("modal-inner")[0];
  if (!inner.contains(event.target)) {
    closeModals();
  }
});

document.addEventListener("keyup", event => {
  if(event.key === "Escape") {
    closeModals();
  }
});

document.getElementById("stats-button").addEventListener("click", event => {
  openModal("stats-modal");
});
