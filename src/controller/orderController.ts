import { Router } from "express";
import { OrderService } from "db/order.js";
import { PaymentStatus } from "db/mockDatabase.js";

import { Request, Response, NextFunction } from "express";
import { mockDB } from "../mockDatabase";

export const orderRouter = Router();

orderRouter.put("/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  if (await OrderService.getOrderById(parseInt(id)) == undefined){
    return res.status(404).json({
      error: "Order not found",
    });
  }

  if (!paymentStatus || !Object.values(PaymentStatus).includes(paymentStatus)) {
    return res.status(400).json({
      error: "Invalid paymentStatus. Use: PENDING, DENIED or ACCEPTED",
    });
  }

  const updatedOrder = await OrderService.updateOrderStatus(parseInt(id), paymentStatus);

  return res.json(updatedOrder);
});

export const createOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    let total = 0;

    // Criar ID do pedido
    const orderId = mockDB.orders.length + 1;

    const newOrderItems = [];

    for (const item of items) {
      const product = mockDB.products.find(
        (p) => p.id === item.productId
      );

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${item.productId} not found` });
      }

      if (product.stockQuantity < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for product ${product.id}` });
      }

      const unitPrice = product.price;
      const price = unitPrice * item.quantity;

      total += price;

      // Criar ID do OrderItem
      const orderItemId = mockDB.orderItems.length + newOrderItems.length + 1;

      const orderItem = {
        id: orderItemId,
        orderId: orderId,
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        price,
      };

      newOrderItems.push(orderItem);

      // Atualizar estoque
      product.stockQuantity -= item.quantity;
    }

    const newOrder = {
      id: orderId,
      userId,
      total,
      paymentStatus: "PENDING",
      createdAt: new Date(),
    };

    // Persistir no "banco"
    mockDB.orders.push(newOrder);
    mockDB.orderItems.push(...newOrderItems);

    return res.status(201).json({
      order: newOrder,
      items: newOrderItems,
    });
  } catch (error) {
    next(error);
  }
};
