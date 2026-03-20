import { Router } from "express";
import { ProductController } from "../controller/productController.js";

const router = Router();

router.get("/products", ProductController.getAll);
router.get("/products/:id", ProductController.getById);

export default router;