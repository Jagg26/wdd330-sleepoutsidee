import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  const dataSource = new ProductData("tents");
  const listElement = document.querySelector(".product-list");
  const productIds = ["880RR", "985RF", "985PR", "344YJ"];

  const productList = new ProductList("tents", dataSource, listElement);
  productList.init(productIds);
}

init();
