var hamburger = document.getElementById("hamburger");
var navUL = document.getElementById("nav-ul");

hamburger.addEventListener("click", () => {
  navUL.classList.toggle("show");
});