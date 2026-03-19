import { mockDB } from "./index.js";
import type { Product } from "./mockDatabase.js";

// Product service functions using the mock database
export class ProductService {
  static getAllProducts(): Product[] {
    return mockDB.getAllProducts();
  }

  static getProductById(id: number): Product | undefined {
    return mockDB.getProductById(id);
  }

  static searchProductsByName(name: string): Product[] {
    return mockDB.getProductsByName(name);
  }

  static createProduct(productData: Omit<Product, "id">): Product {
    return mockDB.createProduct(productData);
  }

  static updateProduct(
    id: number,
    productData: Partial<Omit<Product, "id">>,
  ): Product | undefined {
    return mockDB.updateProduct(id, productData);
  }

  static deleteProduct(id: number): boolean {
    return mockDB.deleteProduct(id);
  }

  static updateStock(id: number, quantity: number): Product | undefined {
    return mockDB.updateProductStock(id, quantity);
  }

  static getAvailableProducts(): Product[] {
    return mockDB
      .getAllProducts()
      .filter((product) => product.stockQuantity > 0);
  }
}
