import { Router } from 'express';
import { cartsManager } from '../managers/cartsManager.js';

const router = Router();

router.get("/", async (req, res) => {
    try {
        const carts = await cartsManager.findAll();
        if (!carts) {
            res.status(400).json({ message: "No se encontraron carritos" });
        }
        return res.status(200).json({ message: "Carritos encontrados", carts: carts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cartById = await cartsManager.findAndPopulate(cartId);
        if (!cartById) {
            res.status(400).json({ message: "No se encontro el carrito" });
        }
        return res.status(200).json({ message: "Carrito encontrado", cart: cartById });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post("/", async (req, res) => {
    const { productId, quantity } = req.body;
    const obj = { products: [ { product: productId, quantity: quantity }]};
    try {
        const newCart = await cartsManager.createOne(obj);
        if (!newCart) {
            res.status(400).json({ message: "No se pudo crear el carrito" });
        }
        return res.status(200).json({ message: "Carrito creado", cart: newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const productsData = req.body;
    try {
        const updatedCart = await cartsManager.addToCart(cartId, productsData);
        if (!updatedCart) {
            res.status(400).json({ message: "No se pudo actualizar el carrito" });
        }
        return res.status(200).json({ message: "Carrito actualizado", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const emptyCart = await cartsManager.deleteAllProducts(cartId);
        if (!emptyCart) {
            res.status(400).json({ message: "No se pudo vaciar el carrito" });
        }
        return res.status(200).json({ message: "Productos eliminados del carrito", cart: emptyCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {
        const cartUpdate = await cartsManager.updateProductQuantity(cartId, productId, quantity);
        if (!cartUpdate) {
            res.status(400).json({ message: "No se pudo actualizar la cantidad" });
        }
        return res.status(200).json({ message: "Cantidad Actualizada", cart: cartUpdate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const cartUpdate = await cartsManager.deleteOneProduct(cartId, productId);
        if (!cartUpdate) {
            res.status(400).json({ message: "No se pudo eliminar el producto" });
        }
        return res.status(200).json({ message: "Producto eliminado", cart: cartUpdate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;