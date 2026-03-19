import { mockDB } from "./index.js";
import type { OrderItem } from "./mockDatabase.js";

// OrderItem service functions using the mock database
export class OrderItemService {
  static getAllOrderItems(): OrderItem[] {
    return mockDB.getAllOrderItems();
  }

  static getOrderItemById(id: number): OrderItem | undefined {
    return mockDB.getOrderItemById(id);
  }

  static getOrderItemsByOrderId(orderId: number): OrderItem[] {
    return mockDB.getOrderItemsByOrderId(orderId);
  }

  static createOrderItem(itemData: Omit<OrderItem, "id">): OrderItem {
    return mockDB.createOrderItem(itemData);
  }

  static updateOrderItem(
    id: number,
    itemData: Partial<Omit<OrderItem, "id">>,
  ): OrderItem | undefined {
    return mockDB.updateOrderItem(id, itemData);
  }

  static deleteOrderItem(id: number): boolean {
    return mockDB.deleteOrderItem(id);
  }

  static calculateItemTotal(item: OrderItem): number {
    return item.quantity * item.unitPrice;
  }

  static validateOrderItem(item: Omit<OrderItem, "id">): boolean {
    // Check if the order exists
    const order = mockDB.getOrderById(item.orderId);
    if (!order) return false;

    // Check if the product exists and has enough stock
    const product = mockDB.getProductById(item.productId);
    if (!product || product.stockQuantity < item.quantity) return false;

    // Check if price matches
    if (item.unitPrice !== product.price) return false;

    return true;
  }
}
