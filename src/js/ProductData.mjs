import { convertToJson } from "./utils.mjs";

const baseURL = import.meta.env.VITE_SERVER_URL;
const productCategories = ["tents", "backpacks", "sleeping-bags", "hammocks"];

export default class ProductData {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async searchData(query) {
    const products = await Promise.all(
      productCategories.map((category) =>
        this.getData(category).catch(() => []),
      ),
    );
    const searchTerm = query.toLowerCase();
    return products
      .flat()
      .filter((product) => this.matchesSearch(product, searchTerm));
  }

  matchesSearch(product, searchTerm) {
    const searchFields = [
      product.Name,
      product.NameWithoutBrand,
      product.Brand?.Name,
      product.Category,
      product.DescriptionHtmlSimple,
    ];
    return searchFields.some((field) =>
      field?.toLowerCase().includes(searchTerm),
    );
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
