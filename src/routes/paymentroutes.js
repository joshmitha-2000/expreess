const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentcontroller");
const authenticateToken = require('../middlewavers/usermiddleware');  // Your auth middleware to get req.user

router.post("/create-intent", authenticateToken, paymentController.createPaymentIntent);
router.get("/", authenticateToken, paymentController.getUserPayments);
router.get("/:id", authenticateToken, paymentController.getPaymentById);

module.exports = router;
