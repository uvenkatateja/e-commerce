const express = require("express");
const router = express.Router();
const { getExchangeRates } = require("../controllers/currencyController");

/**
 * Currency Routes
 *
 * GET /api/currency/rates → live exchange rates (public, cached 10min)
 */
router.get("/rates", getExchangeRates);

module.exports = router;
