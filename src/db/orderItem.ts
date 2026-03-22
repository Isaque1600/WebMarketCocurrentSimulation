import { mockDB } from "./index.js";
import type { OrderItem } from "./mockDatabase.js";

// OrderItem service functions using the async mock database
export class OrderItemService {
  static async validateOrderItem(
    item: Omit<OrderItem, "id">,
  ): Promise<boolean> {
    const order = await mockDB.getOrderById(item.orderId);
    if (!order) return false;
    console.log("ORDER ITEM VALIDATION: Found order");

    const product = await mockDB.getProductById(item.productId);
    console.log("ORDER ITEM VALIDATION: Found product");
    if (!product || product.stockQuantity < item.quantity) return false;
    console.log("ORDER ITEM VALIDATION: Stock quantity is sufficient");

    if (item.unitPrice !== product.price) return false;
    console.log("ORDER ITEM VALIDATION: Unit price is valid");

    return true;
  }
}
