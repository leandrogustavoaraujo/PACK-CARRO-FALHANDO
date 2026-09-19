/* Carrosséis: autoplay contínuo, pausa no hover e arraste/swap no desktop e mobile. */
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  carousel.addEventListener('pointerdown', (event) => {
    isDown = true;
    startX = event.clientX;
    startScroll = carousel.scrollLeft;
    carousel.classList.add('dragging');
    carousel.setPointerCapture(event.pointerId);
  });
  carousel.addEventListener('pointermove', (event) => {
    if (!isDown) return;
    carousel.scrollLeft = startScroll - (event.clientX - startX);
  });
  const finishDrag = () => { isDown = false; carousel.classList.remove('dragging'); };
  carousel.addEventListener('pointerup', finishDrag);
  carousel.addEventListener('pointercancel', finishDrag);
});

/* Evita que os links de exemplo tentem abrir um endereço inexistente na versão de demonstração. */
document.querySelectorAll('[data-checkout]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.href.includes('SEU-CHECKOUT')) {
      event.preventDefault();
      alert('Substitua este link pelo endereço do seu checkout antes de publicar.');
    }
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
