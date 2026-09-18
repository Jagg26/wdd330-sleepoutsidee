import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product, category) {
  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}&category=${category}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init(productIds = []) {
    const list = await this.dataSource.getData(this.category);
    const filteredList = productIds.length
      ? list.filter((product) => productIds.includes(product.Id))
      : list;
    this.renderList(filteredList);
  }

  renderList(list) {
    renderListWithTemplate(
      (product) => productCardTemplate(product, this.category),
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }
}
