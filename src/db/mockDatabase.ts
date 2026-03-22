// Mock Database Types
export enum PaymentStatus {
  PENDING = "PENDING",
  DENIED = "DENIED",
  ACCEPTED = "ACCEPTED",
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentGetawayId?: string;
  createdAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  unitPrice: number;
}

function simulateDbDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 250) + 50;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export class MockDatabase {
  private users: Map<number, User> = new Map();
  private products: Map<number, Product> = new Map();
  private orders: Map<number, Order> = new Map();
  private orderItems: Map<number, OrderItem> = new Map();

  private nextUserId = 1;
  private nextProductId = 1;
  private nextOrderId = 1;
  private nextOrderItemId = 1;

  constructor() {
    this.seedData();
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    await simulateDbDelay();
    const user: User = {
      id: this.nextUserId++,
      ...userData,
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    await simulateDbDelay();
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await simulateDbDelay();
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    await simulateDbDelay();
    return Array.from(this.users.values());
  }

  async updateUser(
    id: number,
    userData: Partial<Omit<User, "id">>,
  ): Promise<User | undefined> {
    await simulateDbDelay();
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    await simulateDbDelay();
    return this.users.delete(id);
  }

  async createProduct(productData: Omit<Product, "id">): Promise<Product> {
    await simulateDbDelay();
    const product: Product = {
      id: this.nextProductId++,
      ...productData,
    };
    this.products.set(product.id, product);
    return product;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    await simulateDbDelay();
    return this.products.get(id);
  }

  async getAllProducts(): Promise<Product[]> {
    await simulateDbDelay();
    return Array.from(this.products.values());
  }

  async getProductsByName(name: string): Promise<Product[]> {
    await simulateDbDelay();
    return Array.from(this.products.values()).filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  async updateProduct(
    id: number,
    productData: Partial<Omit<Product, "id">>,
  ): Promise<Product | undefined> {
    await simulateDbDelay();
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async updateProductStock(
    id: number,
    quantity: number,
  ): Promise<Product | undefined> {
    await simulateDbDelay();
    const product = this.products.get(id);
    if (!product) return undefined;

    product.stockQuantity += quantity;
    this.products.set(id, product);
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    await simulateDbDelay();
    return this.products.delete(id);
  }

  async createOrder(
    orderData: Omit<Order, "id" | "createdAt">,
  ): Promise<Order> {
    await simulateDbDelay();
    const order: Order = {
      id: this.nextOrderId++,
      createdAt: new Date(),
      ...orderData,
    };
    this.orders.set(order.id, order);
    return order;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    await simulateDbDelay();
    return this.orders.get(id);
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    await simulateDbDelay();
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  async getAllOrders(): Promise<Order[]> {
    await simulateDbDelay();
    return Array.from(this.orders.values());
  }

  async updateOrderStatus(
    id: number,
    paymentStatus: PaymentStatus,
  ): Promise<Order | undefined> {
    await simulateDbDelay();
    const order = this.orders.get(id);
    if (!order) return undefined;

    order.paymentStatus = paymentStatus;
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(
    id: number,
    orderData: Partial<Omit<Order, "id" | "createdAt">>,
  ): Promise<Order | undefined> {
    await simulateDbDelay();
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, ...orderData };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    await simulateDbDelay();
    const orderItems = await this.getOrderItemsByOrderId(id);
    for (const item of orderItems) {
      await this.deleteOrderItem(item.id);
    }

    return this.orders.delete(id);
  }

  async createOrderItem(
    orderItemData: Omit<OrderItem, "id">,
  ): Promise<OrderItem> {
    await simulateDbDelay();
    const orderItem: OrderItem = {
      id: this.nextOrderItemId++,
      ...orderItemData,
    };
    this.orderItems.set(orderItem.id, orderItem);
    return orderItem;
  }

  async getOrderItemById(id: number): Promise<OrderItem | undefined> {
    await simulateDbDelay();
    return this.orderItems.get(id);
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    await simulateDbDelay();
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId,
    );
  }

  async getAllOrderItems(): Promise<OrderItem[]> {
    await simulateDbDelay();
    return Array.from(this.orderItems.values());
  }

  async updateOrderItem(
    id: number,
    itemData: Partial<Omit<OrderItem, "id">>,
  ): Promise<OrderItem | undefined> {
    await simulateDbDelay();
    const orderItem = this.orderItems.get(id);
    if (!orderItem) return undefined;

    const updatedOrderItem = { ...orderItem, ...itemData };
    this.orderItems.set(id, updatedOrderItem);
    return updatedOrderItem;
  }

  async deleteOrderItem(id: number): Promise<boolean> {
    await simulateDbDelay();
    return this.orderItems.delete(id);
  }

  async getOrderWithItems(
    orderId: number,
  ): Promise<{ order: Order; items: OrderItem[] } | undefined> {
    const order = await this.getOrderById(orderId);
    if (!order) return undefined;

    const items = await this.getOrderItemsByOrderId(orderId);
    return { order, items };
  }

  async calculateOrderTotal(orderId: number): Promise<number> {
    const items = await this.getOrderItemsByOrderId(orderId);
    return items.reduce((total, item) => total + item.price, 0);
  }

  async getStats(): Promise<{
    usersCount: number;
    productsCount: number;
    ordersCount: number;
    orderItemsCount: number;
  }> {
    await simulateDbDelay();
    return {
      usersCount: this.users.size,
      productsCount: this.products.size,
      ordersCount: this.orders.size,
      orderItemsCount: this.orderItems.size,
    };
  }

  async reset(): Promise<void> {
    await simulateDbDelay();
    this.users.clear();
    this.products.clear();
    this.orders.clear();
    this.orderItems.clear();

    this.nextUserId = 1;
    this.nextProductId = 1;
    this.nextOrderId = 1;
    this.nextOrderItemId = 1;

    this.seedData();
  }

  private seedData(): void {
    this.users.set(1, {
      id: 1,
      name: "Abdon Werner",
      email: "abaddon@example.com",
      password: "hashed_password_1",
    });

    this.users.set(2, {
      id: 2,
      name: "Raimundo Nonato",
      email: "raimundo@example.com",
      password: "hashed_password_2",
    });

    this.products.set(1, {
      id: 1,
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with precision tracking",
      price: 39.99,
      stockQuantity: 1,
    });

    this.nextUserId = 3;
    this.nextProductId = 2;
    this.nextOrderId = 1;
    this.nextOrderItemId = 1;
  }
}
