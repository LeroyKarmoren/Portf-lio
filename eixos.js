// Troca título (e descrição se existir) ao clicar nos cartões menores
document.querySelectorAll('.eixo-bloco').forEach((bloco) => {
  const cards = bloco.querySelectorAll('.atividade-card');
  const titulo = bloco.querySelector('.destaque-titulo');
  const desc = bloco.querySelector('.destaque-desc');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      cards.forEach((c) => c.classList.remove('is-active'));
      card.classList.add('is-active');

      if (titulo && card.dataset.title !== undefined) {
        titulo.textContent = card.dataset.title;
      }
      if (desc && card.dataset.desc !== undefined) {
        desc.textContent = card.dataset.desc;
      }
    });
  });
});

// Modal em carrossel nas imagens de destaque de cada eixo
const destaques = Array.from(document.querySelectorAll('.destaque-img'));
const modal = document.getElementById('modalDestaque');
const modalImg = document.getElementById('modalImg');
const modalTitulo = document.getElementById('modalTitulo');
const modalDesc = document.getElementById('modalDesc');
const modalContador = document.getElementById('modalContador');
const btnFechar = document.getElementById('modalFechar');
const btnPrev = document.getElementById('modalPrev');
const btnNext = document.getElementById('modalNext');

let indiceAtual = 0;

function formatarNum(n) {
  return String(n).padStart(2, '0');
}

function renderizarSlide(index) {
  if (!destaques.length) return;
  indiceAtual = (index + destaques.length) % destaques.length;
  const imgEl = destaques[indiceAtual];
  const bloco = imgEl.closest('.eixo-bloco');
  const eixoNome = bloco ? bloco.querySelector('.eixo-label')?.textContent?.trim() : '';
  const tituloBloco = bloco ? bloco.querySelector('.destaque-titulo')?.textContent?.trim() : '';
  const descBloco = bloco ? bloco.querySelector('.destaque-desc')?.textContent?.trim() : '';

  modalImg.src = imgEl.getAttribute('src') || '';
  modalImg.alt = imgEl.alt || '';
  modalTitulo.textContent = imgEl.dataset.modalTitle || [eixoNome, tituloBloco].filter(Boolean).join(' · ') || 'Destaque';
  modalDesc.textContent = imgEl.dataset.modalDesc || descBloco || '';
  modalContador.textContent = `${formatarNum(indiceAtual + 1)} / ${formatarNum(destaques.length)}`;
}

function abrirModal(index) {
  renderizarSlide(index);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

destaques.forEach((imgEl, idx) => {
  imgEl.style.cursor = 'zoom-in';
  imgEl.addEventListener('click', () => abrirModal(idx));
});

if (btnFechar && btnPrev && btnNext && modal) {
  btnFechar.addEventListener('click', fecharModal);
  btnPrev.addEventListener('click', () => renderizarSlide(indiceAtual - 1));
  btnNext.addEventListener('click', () => renderizarSlide(indiceAtual + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') fecharModal();
    if (e.key === 'ArrowRight') renderizarSlide(indiceAtual + 1);
    if (e.key === 'ArrowLeft') renderizarSlide(indiceAtual - 1);
  });
}