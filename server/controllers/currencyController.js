/**
 * Currency Controller — Real-time exchange rates via frankfurter.app
 *
 * frankfurter.app is a free, open-source API that provides exchange rates
 * published by the European Central Bank. No API key needed.
 *
 * We cache rates in-memory for 10 minutes to avoid hammering the API.
 */

let cachedRates = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const SUPPORTED_CURRENCIES = [
    "USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD",
    "CHF", "CNY", "KRW", "BRL", "MXN", "IDR", "SGD", "HKD"
];

// Currency metadata for the frontend
const CURRENCY_INFO = {
    USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
    EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
    GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
    INR: { symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
    JPY: { symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
    AUD: { symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
    CAD: { symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
    CHF: { symbol: "CHF", name: "Swiss Franc", locale: "de-CH" },
    CNY: { symbol: "¥", name: "Chinese Yuan", locale: "zh-CN" },
    KRW: { symbol: "₩", name: "South Korean Won", locale: "ko-KR" },
    BRL: { symbol: "R$", name: "Brazilian Real", locale: "pt-BR" },
    MXN: { symbol: "MX$", name: "Mexican Peso", locale: "es-MX" },
    IDR: { symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID" },
    SGD: { symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
    HKD: { symbol: "HK$", name: "Hong Kong Dollar", locale: "zh-HK" },
};

/**
 * @desc    Get live exchange rates (base: USD)
 * @route   GET /api/currency/rates
 * @access  Public
 *
 * Returns all supported currency rates relative to USD,
 * plus currency metadata (symbol, name, locale).
 * Uses in-memory cache with 10-minute TTL.
 */
const getExchangeRates = async (req, res, next) => {
    try {
        const now = Date.now();

        // Return cached rates if still fresh
        if (cachedRates && (now - cacheTimestamp) < CACHE_DURATION) {
            return res.json({
                success: true,
                data: {
                    base: "USD",
                    rates: cachedRates,
                    currencies: CURRENCY_INFO,
                    cachedAt: new Date(cacheTimestamp).toISOString(),
                    nextRefresh: new Date(cacheTimestamp + CACHE_DURATION).toISOString(),
                },
            });
        }

        // Fetch fresh rates from frankfurter.app
        // Base USD, get all supported currencies
        const targets = SUPPORTED_CURRENCIES.filter(c => c !== "USD").join(",");
        const response = await fetch(
            `https://api.frankfurter.app/latest?from=USD&to=${targets}`
        );

        if (!response.ok) {
            throw new Error(`Exchange rate API returned ${response.status}`);
        }

        const data = await response.json();

        // Build rates object with USD = 1
        const rates = { USD: 1, ...data.rates };

        // Cache it
        cachedRates = rates;
        cacheTimestamp = now;

        res.json({
            success: true,
            data: {
                base: "USD",
                rates,
                currencies: CURRENCY_INFO,
                cachedAt: new Date(cacheTimestamp).toISOString(),
                nextRefresh: new Date(cacheTimestamp + CACHE_DURATION).toISOString(),
            },
        });
    } catch (error) {
        // If the API fails, return fallback static rates so the app doesn't break
        console.error("Exchange rate fetch failed:", error.message);

        if (cachedRates) {
            // Return stale cache with a warning
            return res.json({
                success: true,
                data: {
                    base: "USD",
                    rates: cachedRates,
                    currencies: CURRENCY_INFO,
                    cachedAt: new Date(cacheTimestamp).toISOString(),
                    stale: true,
                },
            });
        }

        // Absolute fallback — approximate rates
        const fallbackRates = {
            USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, JPY: 149.5,
            AUD: 1.53, CAD: 1.36, CHF: 0.88, CNY: 7.24, KRW: 1330,
            BRL: 4.97, MXN: 17.15, IDR: 15650, SGD: 1.34, HKD: 7.82,
        };

        res.json({
            success: true,
            data: {
                base: "USD",
                rates: fallbackRates,
                currencies: CURRENCY_INFO,
                fallback: true,
            },
        });
    }
};

module.exports = {
    getExchangeRates,
};
