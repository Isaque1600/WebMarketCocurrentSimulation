import { OrderController } from "controllers/orderController.js";
import { Router } from "express";

const orderRoutes: Router = Router();

orderRoutes.post("/orders", OrderController.createOrder);
orderRoutes.patch("/orders/:id/status", OrderController.updateOrderStatus);

export { orderRoutes };
