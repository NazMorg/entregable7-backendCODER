import { Router } from 'express';
import { productsManager } from '../managers/productsManager.js';

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await productsManager.findAllFiltered(req.query);
        if (!products) {
            res.status(400).json({ message: "No se encontraron productos" });
        }
        return res.status(200).json({ message: "Productos encontrados", products: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid
        const productById = await productsManager.findById(productId);
        if (!productById) {
            res.status(400).json({ message: "No se encontro el producto" });
        }
        return res.status(200).json({ message: "Producto encontrado", product: productById });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    if (!thumbnails) {
        delete req.body.thumbnails;
    }
    try {
        const createdProduct = await productsManager.createOne(req.body);
        res.status(200).json({ message: "Producto Creado", product: createdProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const productData = req.body;

        const updatedProduct = await productsManager.updateOne(productId, productData);
        if (!updatedProduct) {
            res.status(400).json({ message: "No se encontro el producto" });
        }
        res.status(200).json({ message: "Producto Actualizado", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const deletedProduct = await productsManager.deleteOne(productId);

        if (!deletedProduct) {
            res.status(400).json({ message: "No se encontro el producto" });
        }
        res.status(200).json({ message: "Producto Eliminado", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;