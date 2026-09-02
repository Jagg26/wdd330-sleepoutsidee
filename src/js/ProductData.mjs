import backpacks from "../json/backpacks.json";
import sleepingBags from "../json/sleeping-bags.json";
import tents from "../json/tents.json";

const productData = {
  backpacks,
  "sleeping-bags": sleepingBags,
  tents,
};

export default class ProductData {
  constructor(category) {
    this.category = category;
  }
  getData() {
    return Promise.resolve(productData[this.category]);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
