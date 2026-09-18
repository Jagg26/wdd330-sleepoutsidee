import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

async function init() {
  await loadHeaderFooter();

  const productId = getParam("product");
  const dataSource = new ProductData();

  if (productId) {
    const product = new ProductDetails(productId, dataSource);
    product.init();
  }
}

init();
