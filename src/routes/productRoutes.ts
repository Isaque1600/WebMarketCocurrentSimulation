import { ProductController } from "controllers/productController.js";
import { Router } from "express";

const productRouter: Router = Router();

productRouter.get("/products", ProductController.getAll);
productRouter.get("/products/:id", ProductController.getById);

export { productRouter };
