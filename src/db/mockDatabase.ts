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

// Mock Database Class
export class MockDatabase {
  private users: Map<number, User> = new Map();
  private products: Map<number, Product> = new Map();
  private orders: Map<number, Order> = new Map();
  private orderItems: Map<number, OrderItem> = new Map();

  private nextUserId = 1;
  private nextProductId = 1;
  private nextOrderId = 1;
  private nextOrderItemId = 1;

  createUser(userData: Omit<User, "id">): User {
    const user: User = {
      id: this.nextUserId++,
      ...userData,
    };
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id: number): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(
    id: number,
    userData: Partial<Omit<User, "id">>,
  ): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id: number): boolean {
    return this.users.delete(id);
  }

  // Product methods
  createProduct(productData: Omit<Product, "id">): Product {
    const product: Product = {
      id: this.nextProductId++,
      ...productData,
    };
    this.products.set(product.id, product);
    return product;
  }

  getProductById(id: number): Product | undefined {
    return this.products.get(id);
  }

  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  getProductsByName(name: string): Product[] {
    return Array.from(this.products.values()).filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  updateProduct(
    id: number,
    productData: Partial<Omit<Product, "id">>,
  ): Product | undefined {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  updateProductStock(id: number, quantity: number): Product | undefined {
    const product = this.products.get(id);
    if (!product || product.stockQuantity < quantity) return undefined;

    product.stockQuantity -= quantity;
    this.products.set(id, product);
    return product;
  }

  deleteProduct(id: number): boolean {
    return this.products.delete(id);
  }

  // Order methods
  createOrder(orderData: Omit<Order, "id" | "createdAt">): Order {
    const order: Order = {
      id: this.nextOrderId++,
      createdAt: new Date(),
      ...orderData,
    };
    this.orders.set(order.id, order);
    return order;
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.get(id);
  }

  getOrdersByUserId(userId: number): Order[] {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  updateOrderStatus(
    id: number,
    paymentStatus: PaymentStatus,
  ): Order | undefined {
    const order = this.orders.get(id);
    if (!order) return undefined;

    order.paymentStatus = paymentStatus;
    this.orders.set(id, order);
    return order;
  }

  updateOrder(
    id: number,
    orderData: Partial<Omit<Order, "id" | "createdAt">>,
  ): Order | undefined {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, ...orderData };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  deleteOrder(id: number): boolean {
    // Also delete related order items
    const orderItems = this.getOrderItemsByOrderId(id);
    orderItems.forEach((item) => this.deleteOrderItem(item.id));

    return this.orders.delete(id);
  }

  // OrderItem methods
  createOrderItem(orderItemData: Omit<OrderItem, "id">): OrderItem {
    const orderItem: OrderItem = {
      id: this.nextOrderItemId++,
      ...orderItemData,
    };
    this.orderItems.set(orderItem.id, orderItem);
    return orderItem;
  }

  getOrderItemById(id: number): OrderItem | undefined {
    return this.orderItems.get(id);
  }

  getOrderItemsByOrderId(orderId: number): OrderItem[] {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId,
    );
  }

  getAllOrderItems(): OrderItem[] {
    return Array.from(this.orderItems.values());
  }

  updateOrderItem(
    id: number,
    itemData: Partial<Omit<OrderItem, "id">>,
  ): OrderItem | undefined {
    const orderItem = this.orderItems.get(id);
    if (!orderItem) return undefined;

    const updatedOrderItem = { ...orderItem, ...itemData };
    this.orderItems.set(id, updatedOrderItem);
    return updatedOrderItem;
  }

  deleteOrderItem(id: number): boolean {
    return this.orderItems.delete(id);
  }

  // Business logic methods
  getOrderWithItems(
    orderId: number,
  ): { order: Order; items: OrderItem[] } | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;

    const items = this.getOrderItemsByOrderId(orderId);
    return { order, items };
  }

  calculateOrderTotal(orderId: number): number {
    const items = this.getOrderItemsByOrderId(orderId);
    return items.reduce((total, item) => total + item.price, 0);
  }

  getStats(): {
    usersCount: number;
    productsCount: number;
    ordersCount: number;
    orderItemsCount: number;
  } {
    return {
      usersCount: this.users.size,
      productsCount: this.products.size,
      ordersCount: this.orders.size,
      orderItemsCount: this.orderItems.size,
    };
  }
}
