import { mockDB } from "./index.js";
import type { Order, OrderItem, PaymentStatus } from "./mockDatabase.js";

// Order service functions using the mock database
export class OrderService {
  static getAllOrders(): Order[] {
    return mockDB.getAllOrders();
  }

  static getOrderById(id: number): Order | undefined {
    return mockDB.getOrderById(id);
  }

  static getOrdersByUserId(userId: number): Order[] {
    return mockDB.getOrdersByUserId(userId);
  }

  static createOrder(orderData: Omit<Order, "id" | "createdAt">): Order {
    return mockDB.createOrder(orderData);
  }

  static updateOrder(
    id: number,
    orderData: Partial<Omit<Order, "id" | "createdAt">>,
  ): Order | undefined {
    return mockDB.updateOrder(id, orderData);
  }

  static updateOrderStatus(
    id: number,
    status: PaymentStatus,
  ): Order | undefined {
    return mockDB.updateOrderStatus(id, status);
  }

  static deleteOrder(id: number): boolean {
    return mockDB.deleteOrder(id);
  }

  static getOrderWithItems(
    orderId: number,
  ): { order: Order; items: OrderItem[] } | undefined {
    return mockDB.getOrderWithItems(orderId);
  }

  static calculateOrderTotal(orderId: number): number {
    return mockDB.calculateOrderTotal(orderId);
  }

  static createOrderWithItems(
    orderData: Omit<Order, "id" | "createdAt" | "total">,
    items: Array<Omit<OrderItem, "id" | "orderId">>,
  ): { order: Order; items: OrderItem[] } {
    // Calculate total from items
    const total = items.reduce((sum, item) => sum + item.price, 0);

    // Create the order
    const order = mockDB.createOrder({ ...orderData, total });

    // Create order items
    const orderItems = items.map((item) =>
      mockDB.createOrderItem({ ...item, orderId: order.id }),
    );

    return { order, items: orderItems };
  }
}
