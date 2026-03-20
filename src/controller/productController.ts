import { ProductService } from '../db/product.js';

export class ProductController {
    static getAll(req: any, res: any) {
        const products = ProductService.getAllProducts();
        return res.json(products);
    }

    static getById(req: any, res: any) {
        const id = Number(req.params.id);
        const product = ProductService.getProductById(id);

        if (!product) {
        return res.status(404).json({ message: "Produto não encontrado!" });
        }

        return res.json(product);
    }
}