const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentcontroller");
const authenticateToken = require('../middlewavers/usermiddleware');

router.post("/create-intent", authenticateToken, paymentController.createPaymentIntent);
router.get("/", authenticateToken, paymentController.getPaymentsByUser);
router.get("/:id", authenticateToken, paymentController.getPaymentById);

module.exports = router;
