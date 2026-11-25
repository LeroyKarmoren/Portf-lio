const botoesMemoria = Array.from(document.querySelectorAll('.memoria-box'));
const modal = document.getElementById('modalAnexo');
const modalFotoFrame = document.getElementById('modalFotoFrame');
const btnFechar = document.getElementById('modalFechar');
const btnPrev = document.getElementById('modalPrev');
const btnNext = document.getElementById('modalNext');

let indiceAtual = 0;

function renderizarFoto(index) {
  if (!botoesMemoria.length || !modalFotoFrame) return;
  indiceAtual = (index + botoesMemoria.length) % botoesMemoria.length;

  const btn = botoesMemoria[indiceAtual];
  const img = btn.querySelector('img');
  const src = img?.getAttribute('src')?.trim();
  const carregouImagem = img && src && img.style.display !== 'none' && img.complete && img.naturalWidth > 0;

  if (carregouImagem) {
    modalFotoFrame.innerHTML = `<img src="${src}" alt="${img.alt || ''}" />`;
  } else {
    modalFotoFrame.innerHTML = `
      <div class="modal-nuvem-grande" aria-hidden="true">
        <svg viewBox="0 0 64 44" class="cloud-svg">
          <path d="M18 38h30a11 11 0 0 0 1.4-21.9A15 15 0 0 0 20.5 12 10 10 0 0 0 18 38Z" fill="#ffffff"/>
        </svg>
      </div>
    `;
  }
}

function abrirModal(index) {
  if (!modal) return;
  renderizarFoto(index);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

botoesMemoria.forEach((btn, idx) => {
  btn.addEventListener('click', () => abrirModal(idx));
});

if (btnFechar && btnPrev && btnNext && modal) {
  btnFechar.addEventListener('click', fecharModal);
  btnPrev.addEventListener('click', () => renderizarFoto(indiceAtual - 1));
  btnNext.addEventListener('click', () => renderizarFoto(indiceAtual + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') fecharModal();
    if (e.key === 'ArrowRight') renderizarFoto(indiceAtual + 1);
    if (e.key === 'ArrowLeft') renderizarFoto(indiceAtual - 1);
  });
}