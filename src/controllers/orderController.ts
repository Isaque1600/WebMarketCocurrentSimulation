import { PaymentStatus, type OrderItem } from "../db/index.js";

import { OrderService } from "db/order.js";
import { ProductService } from "db/product.js";
import type { Request, Response } from "express";

export class OrderController {
  static updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    console.log(`[ORDER ${id}] Received request to update order status:`, {
      id,
      paymentStatus,
    });

    if (
      (await OrderService.getOrderById(parseInt(id as string))) == undefined
    ) {
      console.log(`[ORDER ${id}] Order not found`);
      return res.status(404).json({
        error: "Order not found",
      });
    }

    if (
      !paymentStatus ||
      !Object.values(PaymentStatus).includes(paymentStatus)
    ) {
      console.log(`[ORDER ${id}] Invalid paymentStatus: ${paymentStatus}`);
      return res.status(400).json({
        error: "Invalid paymentStatus. Use: PENDING, DENIED or ACCEPTED",
      });
    }

    const updatedOrder = await OrderService.updateOrderStatus(
      parseInt(id as string),
      paymentStatus,
    );

    const orderWithItems = await OrderService.getOrderWithItems(
      parseInt(id as string),
    );

    if (paymentStatus === PaymentStatus.DENIED && orderWithItems) {
      for (const item of orderWithItems.items) {
        await ProductService.updateStock(item.productId, +item.quantity);
      }
    }

    console.log(`[ORDER ${id}] Finished processing order update`);

    return res.json(updatedOrder);
  };

  static createOrder = async (req: Request, res: Response) => {
    const { userId, items } = req.body;

    console.log(`[USER ${userId}] Request to create order with items:`, items);

    if (!userId || !Array.isArray(items)) {
      console.log(`[USER ${userId}] Invalid request body`);
      return res.status(400).json({ error: "Invalid request body" });
    }

    console.log(`[USER ${userId}] Creating order with items`);

    const formattedItems: OrderItem[] = items.map(
      (item: { productId: number; quantity: number }) =>
        ({
          orderId: 0,
          ...item,
          unitPrice: 0,
          price: 0,
        }) as OrderItem,
    );

    const newOrder = await OrderService.createOrderWithItems(
      {
        paymentStatus: PaymentStatus.PENDING,
        userId,
        paymentGetawayId: "apikey",
      },
      formattedItems,
    );

    newOrder.items.forEach(async (item) => {
      console.log(
        `[USER ${userId}] Created order item: productId=${item.productId}, quantity=${item.quantity}, unitPrice=${item.unitPrice}, price=${item.price}`,
      );
    });

    console.log(`[USER ${userId}] Created new order`);

    return res.status(201).json({
      order: newOrder.order,
      items: newOrder.items,
    });
  };
}
