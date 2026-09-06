// Troque apenas esta URL quando o checkout definitivo estiver pronto.
if (!window.__pageScriptInitialized) {
  window.__pageScriptInitialized = true;

  const CHECKOUT_URL = "https://pay.wiapy.com/s7FHHzZ_VTyA";

// Repasse manual das UTMs (e parâmetros de origem) para o link do checkout,
// como reforço independente do script da UTMify — já houve caso de UTM não
// chegar no checkout Wiapy quando o link é definido dinamicamente via JS.
function buildCheckoutUrlWithParams(baseUrl) {
  const paramsToForward = [
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "src", "sck", "fbclid", "gclid"
  ];
  const currentParams = new URLSearchParams(window.location.search);
  const checkoutUrl = new URL(baseUrl);
  paramsToForward.forEach((key) => {
    const value = currentParams.get(key);
    if (value) checkoutUrl.searchParams.set(key, value);
  });
  return checkoutUrl.toString();
}

document.querySelectorAll("[data-checkout]").forEach((button) => {
  button.href = buildCheckoutUrlWithParams(CHECKOUT_URL);
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.addEventListener("click", () => {
    if (typeof fbq === "function") fbq("track", "InitiateCheckout");
  });
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
}
