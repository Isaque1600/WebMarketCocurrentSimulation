import type { Request, Response } from "express";
import { ProductService } from "../db/product.js";

export class ProductController {
  static async getAll(_req: Request, res: Response) {
    const products = await ProductService.getAllProducts();

    console.log("Fetching all products...");
    console.log(`Found ${products.length} products in the database.`);

    return res.json(products);
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const product = await ProductService.getProductById(id);

    console.log("Fetching product with ID:", id);

    if (!product) {
      console.log("Product not found with ID:", id);
      return res.status(404).json({ message: "Produto não encontrado!" });
    }

    console.log("Product found:", product);
    return res.json(product);
  }
}
