import { mockDB } from "./index.js";
import type { Product } from "./mockDatabase.js";

// Product service functions using the async mock database
export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    return await mockDB.getAllProducts();
  }

  static async getProductById(id: number): Promise<Product | undefined> {
    return await mockDB.getProductById(id);
  }

  static async updateStock(
    id: number,
    quantity: number,
  ): Promise<Product | undefined> {
    return await mockDB.updateProductStock(id, quantity);
  }
}
