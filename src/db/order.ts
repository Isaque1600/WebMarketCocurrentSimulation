import { mockDB } from "./index.js";
import type { Order, OrderItem } from "./mockDatabase.js";
import { PaymentStatus } from "./mockDatabase.js";

export class OrderService {
  static async getOrderById(id: number): Promise<Order | undefined> {
    return await mockDB.getOrderById(id);
  }

  static async createOrder(
    orderData: Omit<Order, "id" | "createdAt">,
  ): Promise<Order> {
    return await mockDB.createOrder(orderData);
  }

  static async updateOrderStatus(
    id: number,
    status: PaymentStatus,
  ): Promise<Order | undefined> {
    return await mockDB.updateOrderStatus(id, status);
  }

  static async getOrderWithItems(
    orderId: number,
  ): Promise<{ order: Order; items: OrderItem[] } | undefined> {
    return await mockDB.getOrderWithItems(orderId);
  }

  static async createOrderWithItems(
    orderData: Omit<Order, "id" | "createdAt" | "total">,
    items: Array<Omit<OrderItem, "id" | "orderId">>,
  ): Promise<{ order: Order; items: OrderItem[] }> {
    const total = items.reduce((sum, item) => sum + item.price, 0);

    const order = await mockDB.createOrder({ ...orderData, total });

    const orderItems = [];
    for (const item of items) {
      const product = await mockDB.getProductById(item.productId);

      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      const orderItem = await mockDB.createOrderItem({
        ...item,
        orderId: order.id,
        unitPrice: product.price,
        price: product.price * item.quantity,
      });

      orderItems.push(orderItem);

      await mockDB.updateProductStock(item.productId, -item.quantity);
    }

    return { order, items: orderItems };
  }
}
