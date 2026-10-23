/* D$T/***TOKYO — private concept preview. Links go to the existing public BASE listings. */
const SHOP = {
  products: [
    { name: "D$T/***TOKYO sweatpants-2", url: "https://deadstockttt.base.shop/items/163811511" },
    { name: "D$T/***TOKYO sweatpants-1", url: "https://deadstockttt.base.shop/items/163811323" },
    { name: "D$T/***TOKYO hoodie", url: "https://deadstockttt.base.shop/items/163802895" }
  ]
};

document.querySelectorAll("[data-product-name]").forEach((el) => {
  const item = SHOP.products[Number(el.dataset.productName)];
  if (item) el.textContent = item.name;
});
document.querySelectorAll("[data-product-link]").forEach((link) => {
  const item = SHOP.products[Number(link.dataset.productLink)];
  if (item) { link.href = item.url; link.target = "_blank"; link.rel = "noopener noreferrer"; }
});


// Explicit EN/JP controls for selected editorial sections only.
const languageButtons = document.querySelectorAll("[data-language]");
function applyLanguage(language) {
  document.documentElement.lang = language === "ja" ? "ja" : "en";
  document.querySelectorAll(".i18n").forEach((element) => {
    const translation = element.dataset[language];
    if (translation) element.textContent = translation;
  });
  languageButtons.forEach((button) => {
    const selected = button.dataset.language === language;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });
}
languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});
applyLanguage("en");
