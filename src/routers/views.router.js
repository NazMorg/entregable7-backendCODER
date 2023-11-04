import { Router } from 'express';
import { productsManager } from '../managers/productsManager.js';
import { cartsManager } from '../managers/cartsManager.js';

const router = Router();

router.get("/", (req, res) => {
    res.render('login');
})

router.get("/signup", (req, res) => {
    res.render("signup");
})

router.get("/loginerror", (req, res) => {
    res.render("loginerror");
})

router.get("/registererror", (req, res) => {
    res.render("signuperror");
})

router.get("/products", async (req, res) => {
    const products = await productsManager.findAll();
    const { first_name, last_name, isAdmin } = req.user;
    var role = "";
    if (isAdmin) {
        role = "Admin";
    } else {
        role = "User"
    }
    res.render('products', { products, first_name, last_name, role });
})

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const cartFound = await cartsManager.findAndPopulate(cartId);
    res.render('cart', { cartFound });
})

router.get("/products/:pid", async (req, res) => {
    const productId = req.params.pid;
    const productFound = await productsManager.findById(productId);
    const { _id, title, description, price, stock, category } = productFound;
    res.render('details', { _id, title, description, price, stock, category });
})

export default router;