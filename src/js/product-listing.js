import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

const categoryNames = {
  tents: "Tents",
  backpacks: "Backpacks",
  "sleeping-bags": "Sleeping Bags",
  hammocks: "Hammocks",
};

async function init() {
  await loadHeaderFooter();

  const category = getParam("category") || "tents";
  const search = getParam("search");
  const dataSource = new ProductData();
  const listElement = document.querySelector(".product-list");
  const titleElement = document.querySelector(".products h2");
  const messageElement = document.querySelector(".product-list-message");
  const productList = new ProductList(category, dataSource, listElement);

  if (search) {
    const results = await dataSource.searchData(search);
    titleElement.textContent = `Search Results: ${search}`;
    messageElement.textContent = results.length
      ? `${results.length} products found`
      : "No products found";
    productList.renderList(results);
    return;
  }

  titleElement.textContent = `Top Products: ${categoryNames[category] || category}`;

  messageElement.textContent = "";
  productList.init();
}

init();
