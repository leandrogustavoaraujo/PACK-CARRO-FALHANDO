// Troque apenas esta URL quando o checkout definitivo estiver pronto.
const CHECKOUT_URL = "https://seu-checkout-aqui.com/pack-carro-falhando";

document.querySelectorAll("[data-checkout]").forEach((button) => {
  button.href = CHECKOUT_URL;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
});

document.querySelectorAll(".js-scroll-buy, .mobile-sticky a").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".faq details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq details").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

const today = new Date();
const offerDate = document.querySelector("#offerDate");
if (offerDate) {
  offerDate.textContent = today.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

const checkout = document.querySelector("#checkout");
const sticky = document.querySelector("#mobileSticky");
if (checkout && sticky && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    sticky.classList.toggle("is-hidden", entry.isIntersecting);
  }, { threshold: 0.2 }).observe(checkout);
}
