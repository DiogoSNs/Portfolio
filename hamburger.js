function hamburg() {
  document.querySelector(".dropdown").classList.add("active");
}

function cancel() {
  document.querySelector(".dropdown").classList.remove("active");
}

// Fechar menu ao clicar em um link (opcional)
document.querySelectorAll(".dropdown a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".dropdown").classList.remove("active");
  });
});
