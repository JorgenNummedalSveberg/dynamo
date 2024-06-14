let route;
let routerLinks = [];
let styleSheets = {};

window.onload = () => {
  window.location.hash = "index.html";
  load();
};
window.addEventListener("hashchange", () => {
  load();
});

function load() {
  route = window.location.hash.substring(1);
  routerLinks = Array.from(document.querySelectorAll("[router-link]"));
  routerLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage(
        e.target.getAttribute("router-link"),
        e.target.getAttribute("router-target")
      );
    });
  });
}

async function loadPage(route, target) {
  const content = components[route]?.component;
  const targetElement = document.getElementById(target);
  if (!targetElement) return;
  targetElement.innerHTML = content || "";

  if (!components[route]) return;
  if (!components[route].style) {
    delete styleSheets[target];
  } else {
    if (!styleSheets[target]) styleSheets[target] = new CSSStyleSheet();
    const style = `#${target} {${components[route].style}}`;
    styleSheets[target].replace(style);
  }

  document.adoptedStyleSheets = [...Object.values(styleSheets)];
}
