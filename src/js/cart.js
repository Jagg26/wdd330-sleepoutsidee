import { loadHeaderFooter } from "./utils.mjs";
import {
  getStoredItems,
  moveCartItemToWishlist,
  CART_KEY,
} from "./storage.mjs";

function renderCartContents() {
  const cartItems = getStoredItems(CART_KEY);

  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      `<li class="empty-list">Your cart is empty.</li>`;
    return;
  }

  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index),
  );
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item, index) {
  const image = item.Image || item.Images?.PrimaryMedium;
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__wishlist" data-index="${index}">
    Move to Wishlist
  </button>
</li>`;

  return newItem;
}

function attachCartListeners() {
  document.querySelector(".product-list").addEventListener("click", (event) => {
    if (!event.target.classList.contains("cart-card__wishlist")) {
      return;
    }

    moveCartItemToWishlist(Number(event.target.dataset.index));
    renderCartContents();
  });
}

async function init() {
  await loadHeaderFooter();
  renderCartContents();
  attachCartListeners();
}

init();
