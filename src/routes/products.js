const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const userId = req.user.id;
    const products = await pool.query("SELECT p.id, p.name, p.price, p.idcat, p.stock , u.login FROM products p JOIN users u ON (p.users_id = u.id) WHERE u.id = ?", [userId]);
    console.log(products);
    res.render('dashboard', { products });
});
router.post('/add', isLoggedIn, async (req, res) => {
    const { name, idcat, stock, price } = req.body;

    const newProduct = {
        name,
        price,
        idcat,
        stock,
        users_id: req.user.id
    }
    console.log(newProduct);

    const results = await pool.query("INSERT INTO products SET ?", [newProduct]);
    console.log(results);

    res.redirect('/products');

});
router.get('/edit/:xid', isLoggedIn, async (req, res) => {
    const id = req.params.xid;
    const product = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    res.render('edit', { product: product[0] });
});
router.post('/edit', isLoggedIn, async (req, res) => {
    const { id, name, price, idcat, stock } = req.body;
    console.log(req.body);
    const newProduct = {
        name,
        price,
        idcat,
        stock
    }
    const results = await pool.query("UPDATE products SET ? WHERE id = ?", [newProduct, id]);
    console.log(results);
    res.redirect('/products');
});
router.get('/delete/:xid', isLoggedIn, async (req, res) => {
    const id = req.params.xid;
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    res.redirect('/products');
});

module.exports = router;