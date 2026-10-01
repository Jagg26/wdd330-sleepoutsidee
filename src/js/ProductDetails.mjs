import { addCartItem, addWishlistItem } from "./storage.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
    document
      .getElementById("addToWishlist")
      .addEventListener("click", this.addProductToWishlist.bind(this));
  }

  addProductToCart() {
    addCartItem(this.product);
    this.showSaveStatus("Added to cart.");
  }

  addProductToWishlist() {
    addWishlistItem(this.product);
    this.showSaveStatus("Saved to wishlist.");
  }

  showSaveStatus(message) {
    document.querySelector(".product-detail__status").textContent = message;
  }

  renderProductDetails() {
    document.querySelector(".product-detail").innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${this.product.Images.PrimaryLarge}"
        alt="${this.product.Name}"
      />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">
        ${this.product.DescriptionHtmlSimple}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        <button id="addToWishlist" data-id="${this.product.Id}" class="button-secondary">
          Wishlist
        </button>
      </div>
      <p class="product-detail__status" aria-live="polite"></p>
    `;
  }
}
