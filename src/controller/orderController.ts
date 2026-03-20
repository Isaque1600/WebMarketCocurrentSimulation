import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Buscar produtos no banco
    const productIds = items.map((item: any) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    // Mapear produtos por ID
    const productMap = new Map(
      products.map((product) => [product.id, product])
    );

    let total = 0;

    const orderItemsData = items.map((item: any) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const unitPrice = product.price;
      const price = unitPrice * item.quantity;

      total += price;

      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        price,
      };
    });

    // Criar pedido + itens (transação)
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        paymentStatus: "PENDING", // ajuste conforme seu enum
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: true,
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};
