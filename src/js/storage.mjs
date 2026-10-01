import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export const CART_KEY = "so-cart";
export const WISHLIST_KEY = "so-wishlist";

export function getStoredItems(key) {
  const storedItems = getLocalStorage(key);
  if (Array.isArray(storedItems)) {
    return storedItems;
  }
  return storedItems ? [storedItems] : [];
}

export function addCartItem(product) {
  const cartItems = getStoredItems(CART_KEY);
  cartItems.push(product);
  setLocalStorage(CART_KEY, cartItems);
}

export function removeCartItem(index) {
  const cartItems = getStoredItems(CART_KEY);
  cartItems.splice(index, 1);
  setLocalStorage(CART_KEY, cartItems);
}

export function clearCart() {
  setLocalStorage(CART_KEY, []);
}

export function addWishlistItem(product) {
  const wishlistItems = getStoredItems(WISHLIST_KEY);
  const alreadySaved = wishlistItems.some((item) => item.Id === product.Id);

  if (!alreadySaved) {
    wishlistItems.push(product);
    setLocalStorage(WISHLIST_KEY, wishlistItems);
  }
}

export function removeWishlistItem(productId) {
  const wishlistItems = getStoredItems(WISHLIST_KEY).filter(
    (item) => item.Id !== productId,
  );
  setLocalStorage(WISHLIST_KEY, wishlistItems);
}

export function moveCartItemToWishlist(index) {
  const cartItems = getStoredItems(CART_KEY);
  const [item] = cartItems.splice(index, 1);

  if (item) {
    setLocalStorage(CART_KEY, cartItems);
    addWishlistItem(item);
  }
}

export function moveWishlistItemToCart(productId) {
  const wishlistItems = getStoredItems(WISHLIST_KEY);
  const item = wishlistItems.find((product) => product.Id === productId);

  if (item) {
    addCartItem(item);
    removeWishlistItem(productId);
  }
}
