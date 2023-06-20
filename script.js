import mons from "./mons.js";

const defaults = {
  sprite: "000-missing.png",
  name: "???",
};

window.onload = function() {
  let template = document.getElementById('mon-entry').innerHTML;
  let compiled_template = Handlebars.compile(template);
  let rendered = "";
  for (let mon of mons) {
    rendered += compiled_template({...defaults, ...mon});
  }
  document.getElementById('mon-list').innerHTML = rendered;
};
