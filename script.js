// ---------- CONFIG ----------
// Número da empresa: formato internacional, só números, sem "+"
const WHATSAPP_NUMBER = "5542998644207";

// BASE_PRICE só é usado como valor de reserva, caso um modelo não tenha "price" definido.
const BASE_PRICE = 25;
const EXTRA_EMBROIDERY = 6; // valor por bordado adicional

// Para trocar a foto de um modelo, edite o campo "img".
// Sem "img", o card mostra um ícone de boné no lugar da foto.
// PREÇO: para atualizar, mude o número depois de "price:".
const MODELS = [
  { id: "trucker", name: "Trucker", desc: "Frente estruturada, tela nas costas e fecho snapback.", tag: "1º mais pedido", price: 25, img: "TruckerAPGTEX.png" },
];

// AJUSTADOR: o campo "extra" é quanto esse fecho SOMA ao preço do boné.
// Ex: "extra: 0" = sem acréscimo.
const CLOSURES = [
  { id: "snapback", name: "Snapback", desc: "Botão de pressão plástico.",   icon: "🔘", extra: 0 },
];

// ---------- RENDER CATALOG ----------
const grid = document.getElementById('catalogGrid');
MODELS.forEach(m => {
  const card = document.createElement('div');
  card.className = 'card';
  const thumbContent = m.img
    ? `<img src="${m.img}" alt="Boné ${m.name}">`
    : `<span class="thumb-placeholder">🧢</span>`;

  card.innerHTML = `
    <div class="card-thumb">${thumbContent}</div>
    <div class="card-top">
      <h3>${m.name}</h3>
      ${m.tag ? `<span class="badge">${m.tag}</span>` : ''}
    </div>
    <p class="desc">${m.desc}</p>
    <div class="price">R$${m.price}<small> · bordado frente incluso</small></div>
    <a class="card-cta" href="#orcamento" data-model="${m.id}">Simular este modelo</a>
  `;
  grid.appendChild(card);
});

// ---------- SELECTS ----------
const modelSelect = document.getElementById('modelSelect');
MODELS.forEach(m => {
  const opt = document.createElement('option');
  opt.value = m.id;
  opt.textContent = m.name;
  modelSelect.appendChild(opt);
});

const closureSelect = document.getElementById('closureSelect');
CLOSURES.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c.id;
  opt.textContent = c.name;
  closureSelect.appendChild(opt);
});

// ---------- RENDER CLOSURES ----------
const closureGrid = document.getElementById('closureGrid');
let selectedClosure = CLOSURES[0].id;
closureSelect.value = selectedClosure;

function renderClosures(){
  closureGrid.innerHTML = '';
  CLOSURES.forEach(c => {
    const card = document.createElement('div');
    card.className = 'closure-card' + (c.id === selectedClosure ? ' selected' : '');
    card.dataset.closure = c.id;
    card.innerHTML = `
      <div class="closure-icon">${c.icon}</div>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
    `;
    closureGrid.appendChild(card);
  });
}
renderClosures();

closureGrid.addEventListener('click', (e) => {
  const card = e.target.closest('[data-closure]');
  if (!card) return;
  selectedClosure = card.dataset.closure;
  closureSelect.value = selectedClosure;
  renderClosures();
  updateTotal();
});

closureSelect.addEventListener('change', () => {
  selectedClosure = closureSelect.value;
  renderClosures();
  updateTotal();
});

// clicar em "simular este modelo" pré-seleciona o modelo
grid.addEventListener('click', (e) => {
  const link = e.target.closest('[data-model]');
  if (link) modelSelect.value = link.dataset.model;
  updateTotal();
});

// ---------- CALCULATOR ----------
const embCountEl = document.getElementById('embCount');
const qtyInput = document.getElementById('qtyInput');
const totalPriceEl = document.getElementById('totalPrice');
const waLink = document.getElementById('waLink');
const waLinkBottom = document.getElementById('waLinkBottom');

const MAX_EXTRA_EMBROIDERIES = 15;
let extraEmbroideries = 0;

document.getElementById('embPlus').addEventListener('click', () => {
  extraEmbroideries = Math.min(MAX_EXTRA_EMBROIDERIES, extraEmbroideries + 1);
  embCountEl.textContent = extraEmbroideries;
  updateTotal();
});
document.getElementById('embMinus').addEventListener('click', () => {
  extraEmbroideries = Math.max(0, extraEmbroideries - 1);
  embCountEl.textContent = extraEmbroideries;
  updateTotal();
});
qtyInput.addEventListener('input', updateTotal);
modelSelect.addEventListener('change', updateTotal);

function updateTotal(){
  const qty = Math.max(1, parseInt(qtyInput.value) || 1);
  const model = MODELS.find(m => m.id === modelSelect.value);
  const closure = CLOSURES.find(c => c.id === selectedClosure);
  const modelPrice = model ? model.price : BASE_PRICE;
  const closureExtra = closure ? closure.extra : 0;
  const unitPrice = modelPrice + closureExtra + extraEmbroideries * EXTRA_EMBROIDERY;
  const total = unitPrice * qty;
  totalPriceEl.textContent = `R$${total}`;

  const modelName = model ? model.name : '';
  const closureName = closure ? closure.name : '';
  const msgTexto =
    `Olá! Quero fazer um pedido na APGTEX:\n` +
    `Modelo: ${modelName}\n` +
    `Ajustador: ${closureName}\n` +
    `Bordados extras: ${extraEmbroideries}\n` +
    `Quantidade: ${qty}\n` +
    `Valor estimado: R$${total}`;

  waLink.href = `https://wa.me/${5542998644207}?text=${encodeURIComponent(msgTexto)}`;
  waLinkBottom.href = `https://wa.me/${5542998644207}`;
}

updateTotal();

// ---------- SCROLL REVEAL ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- MOBILE MENU ----------
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav){
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

// ---------- FLOATING WHATSAPP BUTTON ----------
const floatingWA = document.getElementById('floatingWA');
if (floatingWA){
  floatingWA.href = `https://wa.me/${5542998644207}`;
}