const SERVICES = [
  { id: "to", name: "Плановое ТО", base: 8900, hours: "2–3 ч" },
  { id: "diag", name: "Компьютерная диагностика", base: 2500, hours: "40 мин" },
  { id: "brakes", name: "Тормозная система", base: 12400, hours: "3–5 ч" },
  { id: "chassis", name: "Ходовая / подвеска", base: 9800, hours: "3–6 ч" },
  { id: "engine", name: "Двигатель / замена масла", base: 6400, hours: "1–2 ч" },
  { id: "ac", name: "Кондиционер / антифриз", base: 7200, hours: "1–3 ч" }
];

const CLASSES = [
  { id: "city", label: "Городской", k: 1 },
  { id: "sedan", label: "Седан / кросс", k: 1.15 },
  { id: "suv", label: "Внедорожник", k: 1.32 },
  { id: "premium", label: "Премиум", k: 1.55 }
];

const serviceSelect = document.getElementById("service");
const classWrap = document.getElementById("car-class");
const urgencySelect = document.getElementById("urgency");
const partsCheck = document.getElementById("parts");
const priceEl = document.getElementById("price");
const rangeEl = document.getElementById("range");
const metaEl = document.getElementById("meta");
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const header = document.getElementById("header");
const toast = document.getElementById("toast");
const bookForm = document.getElementById("book-form");

SERVICES.forEach((item, index) => {
  const option = document.createElement("option");
  option.value = item.id;
  option.textContent = item.name;
  if (index === 0) option.selected = true;
  serviceSelect.append(option);
});

let currentClass = CLASSES[1].id;

CLASSES.forEach((item) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "pill" + (item.id === currentClass ? " is-active" : "");
  button.textContent = item.label;
  button.addEventListener("click", () => {
    currentClass = item.id;
    classWrap.querySelectorAll(".pill").forEach((el) => el.classList.remove("is-active"));
    button.classList.add("is-active");
    renderPrice();
  });
  classWrap.append(button);
});

function formatMoney(value) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₽";
}

function renderPrice() {
  const service = SERVICES.find((item) => item.id === serviceSelect.value) || SERVICES[0];
  const car = CLASSES.find((item) => item.id === currentClass) || CLASSES[0];
  const urgency = Number(urgencySelect.value);
  const parts = partsCheck.checked ? 1.22 : 1;
  const total = service.base * car.k * urgency * parts;

  priceEl.textContent = formatMoney(total);
  rangeEl.textContent = `Диапазон: ${formatMoney(total * 0.92)} — ${formatMoney(total * 1.12)}`;
  metaEl.innerHTML = `
    <li>Услуга: ${service.name}</li>
    <li>Класс авто: ${car.label}</li>
    <li>Срок в боксе: ${service.hours}</li>
    <li>Расходники: ${partsCheck.checked ? "включены" : "отдельно"}</li>
  `;
}

["change", "input"].forEach((eventName) => {
  serviceSelect.addEventListener(eventName, renderPrice);
  urgencySelect.addEventListener(eventName, renderPrice);
});
partsCheck.addEventListener("change", renderPrice);
renderPrice();

burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("is-open"));
});

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}, { passive: true });

const dateInput = bookForm.querySelector('input[name="date"]');
const today = new Date();
dateInput.min = today.toISOString().slice(0, 10);

function showToast(message) {
  toast.hidden = false;
  toast.textContent = message;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookForm.reportValidity()) return;
  bookForm.reset();
  dateInput.min = today.toISOString().slice(0, 10);
  showToast("Заявка отправлена. Перезвоним в течение 10 минут.");
});
