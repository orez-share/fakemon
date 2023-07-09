import {evos, mons} from "./mons.js";

const buildTypeStats = () => {
  let types = {};
  for (let mon of mons) {
    if (!mon.sprite || !mon.type) { continue }
    for (let type of mon.type) {
      types[type] ||= 0;
      types[type] += 1;
    }
  }

  types = Object.entries(types);
  types.sort();
  let typesHtml = "";
  for (let [type, count] of types) {
    typesHtml += `<tr><th>${type}</th><td>${count}</td></tr>`;
  }
  return typesHtml;
}

const buildFamiliesStats = () => {
  let html = "";
  let families = {Solo: 0};
  for (let mon of mons) {
    if (!mon.sprite) { continue }
    if (!mon.evos) {
      families.Solo += 1;
    }
  }

  for (let evo of Object.values(evos)) {
    let stack = [evo];
    let count = 0;
    let branched = false;
    while (stack.length) {
      count += 1;
      let ev = stack.pop();
      if (!ev.evos) { continue }
      if (ev.evos.length > 1) { branched = true }
      stack.push(...ev.evos);
    }
    let key = `${count} ${branched}`;
    families[key] |= 0;
    families[key] += 1;
  }
  let push = (name, id) => {
    let count = families[id];
    html += `<tr><th>${name}</th><td>${count}</td></tr>`;
    delete families[id];
  }
  push("Solo", "Solo");
  push("Two Stage", "2 false");
  push("Three Stage", "3 false");
  push("Three-Mon Branched", "3 true");
  return html;
}

const buildPaletteStats = () => {
  let palettes = {};
  for (let mon of mons) {
    if (!mon.sprite) { continue }
    let palette = mon.palette ?? "???";
    palettes[palette] ||= 0;
    palettes[palette] += 1;
  }
  let html = "";
  const paletteOrder = ["trainer", "blue", "red", "cyan", "purple", "brown", "green", "pink", "yellow", "gray"];
  if (palettes["???"]) {
    paletteOrder.push("???");
  }
  for (let palette of paletteOrder) {
    let count = palettes[palette] ?? 0;
    html += `<tr><th>${palette}</th><td>${count}</td></tr>`;
  }
  return html;
};

export const renderStats = () => {
  const monCount = mons.filter(mon => mon.sprite).length;
  let typesHtml = buildTypeStats();
  let familiesHtml = buildFamiliesStats();
  let palettesHtml = buildPaletteStats();
  document.getElementById("types-list").innerHTML = typesHtml;
  document.getElementById("families-list").innerHTML = familiesHtml;
  document.getElementById("palettes-list").innerHTML = palettesHtml;
  document.getElementById("progress").innerHTML = `<h2 class="mt0">Progress<br>${monCount} / 150</h2>`;
};
