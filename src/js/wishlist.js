import { loadHeaderFooter } from "./utils.mjs";
import {
  getStoredItems,
  moveWishlistItemToCart,
  removeWishlistItem,
  WISHLIST_KEY,
} from "./storage.mjs";

function renderWishlistContents() {
  const wishlistItems = getStoredItems(WISHLIST_KEY);
  const listElement = document.querySelector(".product-list");

  if (wishlistItems.length === 0) {
    listElement.innerHTML =
      `<li class="empty-list">Your wishlist is empty.</li>`;
    return;
  }

  listElement.innerHTML = wishlistItems.map(wishlistItemTemplate).join("");
}

function wishlistItemTemplate(item) {
  const image = item.Image || item.Images?.PrimaryMedium;
  return `<li class="cart-card divider">
    <a href="/product_pages/?product=${item.Id}" class="cart-card__image">
      <img src="${image}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">saved</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <div class="cart-card__actions">
      <button class="wishlist__cart" data-id="${item.Id}">Move to Cart</button>
      <button class="wishlist__remove button-secondary" data-id="${item.Id}">
        Remove
      </button>
    </div>
  </li>`;
}

function attachWishlistListeners() {
  document.querySelector(".product-list").addEventListener("click", (event) => {
    const productId = event.target.dataset.id;

    if (event.target.classList.contains("wishlist__cart")) {
      moveWishlistItemToCart(productId);
      renderWishlistContents();
    }

    if (event.target.classList.contains("wishlist__remove")) {
      removeWishlistItem(productId);
      renderWishlistContents();
    }
  });
}

async function init() {
  await loadHeaderFooter();
  renderWishlistContents();
  attachWishlistListeners();
}

init();
