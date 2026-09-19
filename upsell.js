/* Modal de upgrade do Pacote Básico; os links e valores ficam explícitos. */
(() => {
  const trigger = document.getElementById('basic-purchase-trigger');
  const overlay = document.getElementById('upsell-modal');
  if (!trigger || !overlay) return;

  const dialog = overlay.querySelector('.upsell-dialog');
  const closeButton = overlay.querySelector('.upsell-close');
  const rejectButton = overlay.querySelector('.upsell-reject');
  const acceptLink = overlay.querySelector('.upsell-accept');
  const countdown = document.getElementById('upsell-countdown');
  const basicCheckout = 'https://pay.wiapy.com/s7FHHzZ_VTyA';
  const allowedParameters = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck', 'fbclid', 'gclid'];
  const campaignParameters = new URLSearchParams(location.search);
  const storageKey = 'scanner-no-celular-upsell-expires';
  let expiresAt = 0;
  let timer = null;

  function trackedUrl(base) {
    const url = new URL(base);
    allowedParameters.forEach(parameter => {
      const value = campaignParameters.get(parameter);
      if (value) url.searchParams.set(parameter, value);
    });
    return url.toString();
  }

  function goToBasicCheckout() {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_name: 'Scanner no Celular — Essencial',
        value: 9.90,
        currency: 'BRL'
      });
    }
    window.location.assign(trackedUrl(basicCheckout));
  }

  function loadExpiry() {
    try { return Number(sessionStorage.getItem(storageKey)) || 0; }
    catch { return expiresAt; }
  }

  function saveExpiry(value) {
    try { sessionStorage.setItem(storageKey, String(value)); }
    catch { /* O prazo segue nesta visita, mesmo sem armazenamento. */ }
  }

  function updateCountdown() {
    const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    countdown.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    if (seconds === 0) {
      clearInterval(timer);
      timer = null;
      acceptLink.classList.add('is-expired');
      acceptLink.setAttribute('aria-disabled', 'true');
      acceptLink.textContent = 'CONDIÇÃO ESPECIAL ENCERRADA';
    }
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.classList.remove('upsell-open');
    clearInterval(timer);
    timer = null;
    trigger.focus();
  }

  function openModal() {
    expiresAt = loadExpiry();
    if (expiresAt && Date.now() >= expiresAt) {
      goToBasicCheckout();
      return;
    }
    if (!expiresAt) {
      expiresAt = Date.now() + 15 * 60 * 1000;
      saveExpiry(expiresAt);
    }
    overlay.hidden = false;
    document.body.classList.add('upsell-open');
    updateCountdown();
    timer = window.setInterval(updateCountdown, 1000);
    closeButton.focus();
  }

  trigger.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  rejectButton.addEventListener('click', goToBasicCheckout);
  overlay.addEventListener('click', event => {
    if (event.target === overlay) closeModal();
  });
  acceptLink.addEventListener('click', event => {
    if (acceptLink.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
    if (event.key !== 'Tab') return;
    const focusable = [closeButton, acceptLink, rejectButton].filter(element => element.getAttribute('aria-disabled') !== 'true');
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
