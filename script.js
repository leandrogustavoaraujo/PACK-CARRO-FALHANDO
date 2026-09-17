// URLs dos dois planos. O checkout Básico já existia na landing original.
if (!window.__pageScriptInitialized) {
  window.__pageScriptInitialized = true;

  const BASIC_CHECKOUT_URL = "https://pay.wiapy.com/s7FHHzZ_VTyA";
  const COMPLETE_FULL_CHECKOUT_URL = "https://pay.wiapy.com/ezi-A3FhAkl5";
  const COMPLETE_UPSELL_CHECKOUT_URL = "https://pay.wiapy.com/PHDL45nt4TNU";

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

function configureCheckoutButtons(selector, checkoutUrl) {
  document.querySelectorAll(selector).forEach((button) => {
    if (!checkoutUrl) {
      button.setAttribute("aria-disabled", "true");
      button.addEventListener("click", (event) => event.preventDefault());
      return;
    }
    button.href = buildCheckoutUrlWithParams(checkoutUrl);
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.addEventListener("click", () => {
      if (typeof fbq === "function") fbq("track", "InitiateCheckout");
    });
  });
}

configureCheckoutButtons("[data-checkout-basic]", BASIC_CHECKOUT_URL);
configureCheckoutButtons("[data-checkout-complete-full]", COMPLETE_FULL_CHECKOUT_URL);
configureCheckoutButtons("[data-checkout-complete-upsell]", COMPLETE_UPSELL_CHECKOUT_URL);

const upgradeModal = document.querySelector("#upgradeModal");
const upgradeDialog = upgradeModal?.querySelector(".upgrade-modal__dialog");
let modalTrigger = null;

function openUpgradeModal(trigger) {
  if (!upgradeModal) return;
  modalTrigger = trigger;
  upgradeModal.classList.add("is-open");
  upgradeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-modal-open");
  window.setTimeout(() => upgradeDialog?.focus(), 0);
}

function closeUpgradeModal() {
  if (!upgradeModal) return;
  upgradeModal.classList.remove("is-open");
  upgradeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-modal-open");
  modalTrigger?.focus();
}

document.querySelectorAll("[data-open-basic-modal]").forEach((button) => {
  button.addEventListener("click", () => openUpgradeModal(button));
});

document.querySelectorAll("[data-close-upgrade-modal]").forEach((button) => {
  button.addEventListener("click", closeUpgradeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && upgradeModal?.classList.contains("is-open")) {
    closeUpgradeModal();
  }
});

document.querySelectorAll(".js-scroll-buy").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const checkoutSection = document.querySelector("#checkout");
    if (!checkoutSection) return;

    // Salto imediato para os planos: evita a animação longa e possíveis
    // travamentos em celulares com menos memória/processamento.
    document.documentElement.classList.add("is-instant-checkout-jump");
    checkoutSection.scrollIntoView({ behavior: "auto", block: "start" });
    window.history.replaceState(null, "", "#checkout");
    window.requestAnimationFrame(() => {
      document.documentElement.classList.remove("is-instant-checkout-jump");
    });
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

// Prova social: clientes reais informados pelo responsável da página.
if (!window.__buyerProofInitialized) {
  window.__buyerProofInitialized = true;

  const buyerProofCustomers = [
    "Carlos Henrique de Campinas, SP",
    "Marcos Vinícius de Londrina, PR",
    "Rafael Almeida de Uberlândia, MG",
    "André Luiz de Joinville, SC",
    "Fernando Souza de Goiânia, GO",
    "Ricardo Martins de Ribeirão Preto, SP",
    "Paulo Roberto de Maringá, PR",
    "Eduardo Costa de Juiz de Fora, MG",
    "Bruno Ferreira de Caxias do Sul, RS",
    "Rodrigo Pereira de Campo Grande, MS",
    "Lucas Ribeiro de São José do Rio Preto, SP",
    "Gustavo Carvalho de Sorocaba, SP",
    "Diego Freitas de Blumenau, SC",
    "Leandro Nogueira de Anápolis, GO",
    "Thiago Barros de Pelotas, RS"
  ];

  const buyerProof = document.querySelector("#buyerProof");
  const buyerProofName = document.querySelector("#buyerProofName");
  let buyerProofIndex = 0;

  if (buyerProof && buyerProofName) {
    const visibleTime = 5000;
    const animationTime = 550;

    window.setTimeout(() => buyerProof.classList.add("is-visible"), 350);

    const showNextBuyer = () => {
      buyerProof.classList.remove("is-visible");
      window.setTimeout(() => {
        buyerProofIndex = (buyerProofIndex + 1) % buyerProofCustomers.length;
        buyerProofName.textContent = buyerProofCustomers[buyerProofIndex];
        buyerProof.classList.add("is-visible");
      }, animationTime);
    };

    window.setInterval(showNextBuyer, visibleTime + animationTime);
  }
}

