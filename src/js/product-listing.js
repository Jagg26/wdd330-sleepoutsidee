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
  const dataSource = new ProductData();
  const listElement = document.querySelector(".product-list");
  const titleElement = document.querySelector(".products h2");

  titleElement.textContent = `Top Products: ${categoryNames[category] || category}`;

  const productList = new ProductList(category, dataSource, listElement);
  productList.init();
}

init();
